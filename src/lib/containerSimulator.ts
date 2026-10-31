import {
  normalizeShipName,
  type Container,
  type Item,
  type ItemDrop,
  type Rarity
} from './container';

export interface RollResult {
  drop: ItemDrop;
  item?: Item;
  /** Set when every item of the chosen drop is already owned */
  compensation?: Item;
  guaranteed: boolean;
  additionalRewards?: RollResult[];
}

export interface LootEntry {
  name: string;
  amount: number;
  times: number;
  rarity: Rarity;
}

/** Non-ship rewards summed up by item name */
export type Loot = Record<string, LootEntry>;

export interface SimulatorState {
  opened: number;
  /** Containers opened since the last guaranteed-type drop */
  pity: number;
  /** Normalized names of ships the player owns, including ones received in this session */
  owned: Set<string>;
  counts: Record<string, number>;
  ships: Item[];
  loot: Loot;
  /** Drop table of the last roll, reused until the container or owned ships change */
  dropsCache?: { container: Container; ownedSize: number; drops: WeightedDrop[] };
}

interface WeightedDrop {
  drop: ItemDrop;
  probability: number;
  items: Item[];
}

export function dropRarity(drop: ItemDrop): Rarity {
  return drop.rarity ?? (drop.type === 'ship' ? 'rare' : 'common');
}

export function createState(ownedShipNames: string[]): SimulatorState {
  return {
    opened: 0,
    pity: 0,
    owned: new Set(ownedShipNames.map(normalizeShipName)),
    counts: {},
    ships: [],
    loot: {}
  };
}

export function isOwned(item: Item, owned: Set<string>): boolean {
  return owned.has(normalizeShipName(item.name));
}

/** Includes ships whose metadata is not yet available in warships.json. */
export function isShipDrop(drop: ItemDrop): boolean {
  return drop.type === 'ship' || drop.unique === true;
}

/**
 * Drop table adjusted for the player's port: owned ships are removed from the pools, and once a
 * drop marked with conditionalProbability 0 runs out of ships, every drop with a conditional
 * probability switches to it (e.g. Golden Ships replacing the regular Golden Gift ships).
 *
 * A ship group you own completely hands its chance to the groups that still have ships, in
 * proportion to their own chances. Compensation is only given once every ship group is exhausted.
 */
export function effectiveDrops(container: Container, owned: Set<string>): WeightedDrop[] {
  const pools = container.drops.map((drop) => ({
    drop,
    items:
      drop.type === 'ship' || drop.unique
        ? drop.items.filter((item) => !isOwned(item, owned))
        : drop.items
  }));

  const conditionalMode = pools.some(
    ({ drop, items }) => drop.conditionalProbability === 0 && items.length === 0
  );

  const weighted = pools.map(({ drop, items }) => ({
    drop,
    items,
    probability:
      conditionalMode && drop.conditionalProbability !== undefined
        ? drop.conditionalProbability
        : drop.probability
  }));

  const shipPools = weighted.filter(({ drop }) => isShipDrop(drop));
  const available = shipPools.filter(({ items }) => items.length > 0);
  const exhaustedChance = shipPools
    .filter(({ items }) => items.length === 0)
    .reduce((sum, { probability }) => sum + probability, 0);
  const availableChance = available.reduce((sum, { probability }) => sum + probability, 0);

  if (exhaustedChance > 0 && availableChance > 0) {
    for (const pool of shipPools) {
      pool.probability =
        pool.items.length === 0
          ? 0
          : pool.probability + (exhaustedChance * pool.probability) / availableChance;
    }
  }

  return weighted;
}

function pick<T>(entries: T[], weight: (entry: T) => number): T | undefined {
  const total = entries.reduce((sum, entry) => sum + weight(entry), 0);
  let random = Math.random() * total;

  for (const entry of entries) {
    random -= weight(entry);
    if (random < 0) {
      return entry;
    }
  }

  return entries[entries.length - 1];
}

const rarityOrder: Rarity[] = ['legendary', 'epic', 'rare', 'common'];

export function addLoot(loot: Loot, result: RollResult) {
  for (const rewardResult of [result, ...(result.additionalRewards ?? [])]) {
    if (rewardResult.item && isShipDrop(rewardResult.drop)) continue;

    const reward = rewardResult.item ?? rewardResult.compensation;
    if (!reward) continue;
    const { name } = reward;
    const entry = (loot[name] ??= {
      name,
      amount: 0,
      times: 0,
      rarity: dropRarity(rewardResult.drop)
    });
    entry.amount += reward.amount;
    entry.times++;
  }
}

export function sortedLoot(loot: Loot): LootEntry[] {
  return Object.values(loot).sort(
    (a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity) || b.times - a.times
  );
}

// Rebuilding the drop table filters every ship pool, so only do it when it can have changed.
// `owned` only ever grows, which makes its size enough to notice new ships.
function rollableDrops(container: Container, state: SimulatorState): WeightedDrop[] {
  const cache = state.dropsCache;
  if (cache?.container === container && cache.ownedSize === state.owned.size) {
    return cache.drops;
  }
  const drops = effectiveDrops(container, state.owned).filter(({ probability }) => probability > 0);
  state.dropsCache = { container, ownedSize: state.owned.size, drops };
  return drops;
}

/** Opens one container and updates the state in place */
export function roll(container: Container, state: SimulatorState): RollResult {
  const drops = rollableDrops(container, state);

  const guaranteedCandidates =
    container.guaranteedDropAfter && state.pity + 1 >= container.guaranteedDropAfter
      ? drops.filter(
          ({ drop, items }) =>
            container.guaranteedDropType === 'ship' && isShipDrop(drop) && items.length > 0
        )
      : [];
  const guaranteed = guaranteedCandidates.length > 0;

  const chosen = pick(guaranteed ? guaranteedCandidates : drops, ({ probability }) => probability)!;
  const item = chosen.items[Math.floor(Math.random() * chosen.items.length)];

  state.opened++;
  state.counts[chosen.drop.name] = (state.counts[chosen.drop.name] ?? 0) + 1;

  if (item && (chosen.drop.type === 'ship' || chosen.drop.unique)) {
    state.ships.push(item);
    state.owned.add(normalizeShipName(item.name));
  }

  if (isShipDrop(chosen.drop) && item) {
    state.pity = 0;
  } else {
    state.pity++;
  }

  const result: RollResult = {
    drop: chosen.drop,
    item,
    compensation: item ? undefined : chosen.drop.compensation,
    guaranteed,
    additionalRewards: container.additionalSlots?.map((slot) => {
      const drop = pick(slot.drops, (drop) => drop.probability)!;
      const item = drop.items[Math.floor(Math.random() * drop.items.length)];
      state.counts[drop.name] = (state.counts[drop.name] ?? 0) + 1;
      return { drop, item, guaranteed: false };
    })
  };
  addLoot(state.loot, result);

  return result;
}
