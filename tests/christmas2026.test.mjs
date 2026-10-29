import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

// Source snapshot: October 29, 2026 closed-test 15.11 announcement (preliminary).
const fixture = JSON.parse(
  await readFile(new URL('./fixtures/christmas2026-blog.json', import.meta.url))
);
let server, gift, mega, ultra, golden, battleForged, simulator, event, token, calculators, stores;

before(async () => {
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false, watch: null },
    appType: 'custom',
    resolve: { alias: { $lib: fileURLToPath(new URL('../src/lib', import.meta.url)) } },
    optimizeDeps: { noDiscovery: true, include: [] }
  });
  const load = (path) => server.ssrLoadModule(`/src/lib/${path}.ts`);
  gift = (await load('containers/2026-santas-gift-container')).SantasGiftContainer2026;
  mega = (await load('containers/2026-santas-mega-gift-container')).SantasMegaGiftContainer2026;
  ultra = (await load('containers/2026-santas-ultra-gift-container')).SantasUltraGiftContainer2026;
  golden = (await load('containers/2026-golden-container')).GoldenContainer2026;
  battleForged = (await load('containers/2026-battle-forged-premium-container'))
    .BattleForgedPremiumContainer2026;
  simulator = await load('containerSimulator');
  event = new (await load('rewards/christmas2026')).Christmas2026();
  token = (await load('resources/christmas2026')).FestiveToken;
  calculators = await load('rewardCalculator');
  stores = await server.ssrLoadModule('svelte/store');
});

after(async () => {
  await server?.close();
});

function withRandom(values, callback) {
  const original = Math.random;
  let index = 0;
  Math.random = () => values[index++ % values.length];
  try {
    return callback();
  } finally {
    Math.random = original;
  }
}

test('Snowflake rewards, cumulative Base XP, and all fleet-size boundaries match the announcement', () => {
  const expected = [
    [5, 'Coal', 700, 200],
    [6, 'Coal', 750, 250],
    [7, 'Coal', 800, 300],
    [8, 'Steel', 70, 400],
    [9, 'Steel', 80, 500],
    [10, 'Festive Token', 1, 600],
    [11, 'Steel', 200, 600]
  ];
  for (const [tier, resource, amount, xp] of expected) {
    const reward = event.calculateShipReward({ tier });
    assert.equal(reward.resource.name, resource);
    assert.equal(reward.amount, amount);
    assert.equal(reward.requiredXP, xp);
  }
  for (const tier of [1, 2, 3, 4]) assert.equal(event.calculateShipReward({ tier }), undefined);
  assert.equal(event.calculateShipReward({ tier: 10, isExperimental: true }), undefined);
  assert.equal(event.calculateShipReward({ tier: 10, hasDemoProfile: true }), undefined);
  for (const [size, bonus] of [
    [0, 1],
    [24, 1],
    [25, 2],
    [49, 2],
    [50, 3],
    [99, 3],
    [100, 4],
    [199, 4],
    [200, 5],
    [399, 5],
    [400, 6],
    [599, 6],
    [600, 7],
    [1000, 7]
  ]) {
    assert.equal(event.getMaxAdditionalRewards(size), bonus);
  }
  assert.equal(event.getAdditionalRewardXPRequirement(), 1000);
});

test('All 143 Santa ships match the three published probability pools', () => {
  const normalize = (name) => name.replace(/[’']/g, '').replace(/\s/g, '');
  for (const container of [gift, mega, ultra]) {
    const pools = container.drops.filter((drop) => drop.type === 'ship');
    assert.equal(pools.length, 3);
    pools.forEach((drop, index) => {
      assert.deepEqual(
        drop.items.map((item) => normalize(item.name)).sort(),
        fixture.shipPools[index].ships.map(normalize).sort()
      );
    });
  }
});

test('Every main drop rate and the listed reward amounts match the published tables', () => {
  const cases = [
    [
      gift,
      [0.05, 0.01, 0.07, 0.01, 0.1, 0.1, 0.055, 0.1, 0.24, 0.24, 0.001, 0.004, 0.02],
      [500, 1, 2500, 30, 20000, 400000, 1, 3, 12, 25]
    ],
    [
      mega,
      [0.05, 0.08, 0.1, 0.01, 0.1, 0.1, 0.32, 0.08, 0.01, 0.03, 0.12],
      [2500, 12500, 1, 180, 100000, 2250000, 20, 7]
    ],
    [ultra, [0.05, 0.4, 0.2, 0.03, 0.03, 0.09, 0.2], [2500, 6000, 1, 180]],
    [golden, [0.6, 0.2, 0.1, 0.09999, 0.00001], [7, 3750, 3000]],
    [battleForged, [0.25, 0.25, 0.5], [10000, 5000, 1]]
  ];
  for (const [container, rates, amounts] of cases) {
    container.drops.forEach((drop, index) => {
      assert.ok(
        Math.abs(drop.probability - rates[index]) < 1e-12,
        `${container.name}: ${drop.name}`
      );
      if (index < amounts.length)
        for (const item of drop.items) assert.equal(item.amount, amounts[index]);
    });
    assert.equal(container.drops.length, rates.length);
  }
  for (const [container, steel] of [
    [gift, 250],
    [mega, 1250],
    [ultra, 1250]
  ]) {
    for (const drop of container.drops.filter((drop) => drop.type === 'ship')) {
      assert.deepEqual(drop.compensation, { name: 'Steel', amount: steel });
    }
  }
});

test('Ultra awards all three slots, with independent bonus types and complete bulk totals', () => {
  const [bonuses, resources] = ultra.additionalSlots;
  assert.equal(bonuses.drops[0].items.length, 4);
  assert.ok(bonuses.drops[0].items.every((item) => item.amount === 6));
  assert.deepEqual(
    resources.drops.map((drop) => [drop.probability, drop.items[0].amount]),
    [
      [0.05, 2500],
      [0.81, 37500],
      [0.14, 6000]
    ]
  );
  const state = simulator.createState([]);
  const bulkLoot = {};
  for (let i = 0; i < 3; i++) {
    const result = withRandom([0.1, 0, 0, 0.3, 0.1, 0], () => simulator.roll(ultra, state));
    assert.equal(result.additionalRewards.length, 2);
    assert.equal(result.item.name, 'Coal');
    assert.equal(result.additionalRewards[0].item.name, 'Epic Ship XP Boosters');
    assert.equal(result.additionalRewards[1].item.name, 'Elite Commander XP');
    simulator.addLoot(bulkLoot, result);
  }
  assert.deepEqual(bulkLoot, state.loot);
  assert.equal(state.loot['Coal'].amount, 18000);
  assert.equal(state.loot['Epic Ship XP Boosters'].amount, 18);
  assert.equal(state.loot['Elite Commander XP'].amount, 112500);
  assert.equal(state.opened, 3);
});

test('Battle Forged guarantees New Jersey BF by opening three and awards both bonus slots', () => {
  const state = simulator.createState([]);
  withRandom([0], () => {
    assert.equal(simulator.roll(battleForged, state).item.name, 'Research Points');
    assert.equal(simulator.roll(battleForged, state).item.name, 'Research Points');
    const third = simulator.roll(battleForged, state);
    assert.equal(third.item.name, 'New Jersey BF');
    assert.equal(third.guaranteed, true);
    assert.equal(third.additionalRewards.length, 2);
    assert.equal(state.pity, 0);
    assert.equal(state.ships.length, 1);
    assert.equal(state.loot['Legendary Credit Boosters'].amount, 18);
    assert.equal(state.loot['Legendary Credit Boosters'].times, 6);
  });
  const duplicate = withRandom([0.9], () => simulator.roll(battleForged, state));
  assert.equal(duplicate.item, undefined);
  assert.deepEqual(duplicate.compensation, { name: 'Steel', amount: 2500 });
  assert.equal(state.ships.length, 1);
});

test('Golden Gift switches to 10% rare ships, then Battle Forged compensation when all are owned', () => {
  const regular = golden.drops.find((drop) => drop.type === 'ship');
  const rare = golden.drops.find((drop) => drop.unique);
  assert.deepEqual(
    rare.items.map((item) => item.name),
    ['Rodina G', 'Tōgasa G', 'Somers G', 'Tywysog Cymru']
  );
  const state = simulator.createState(regular.items.map((item) => item.name));
  let drops = simulator.effectiveDrops(golden, state.owned);
  assert.equal(drops.find(({ drop }) => drop === regular).probability, 0);
  assert.equal(drops.find(({ drop }) => drop === rare).probability, 0.1);
  state.pity = golden.guaranteedDropAfter - 1;
  const result = withRandom([0], () => simulator.roll(golden, state));
  assert.equal(result.item.name, 'Rodina G');
  assert.equal(result.guaranteed, true);
  assert.equal(state.pity, 0);
  for (const item of rare.items) state.owned.add(item.name);
  const exhausted = withRandom([0.99], () => simulator.roll(golden, state));
  assert.deepEqual(exhausted.compensation, { name: 'Battle Forged Premium Container', amount: 1 });
});

test('All three token exchanges reach the reward summary as alternatives, without rounding Credits down', async () => {
  assert.deepEqual(
    token.convertsTo.map((c) => [(c.container ?? c.resource).name, c.cost, c.returns]),
    [
      ["Santa's Gift Container", 1, 1],
      ["Santa's Mega Gift Container", 5, 1],
      ['Credits', 1, 375000]
    ]
  );
  const rewards = stores.readable(
    Promise.resolve([{ resource: token, amount: 6, requiredXP: 600 }])
  );
  const result = await stores.get(calculators.createEventStatsStore(rewards, event));
  assert.equal(result.conversions["Santa's Gift Container"].total, 6);
  assert.equal(result.conversions["Santa's Mega Gift Container"].total, 1);
  assert.equal(result.conversions.Credits.total, 2250000);
  assert.equal(result.conversions.Credits.target.name, 'Credits');
});
