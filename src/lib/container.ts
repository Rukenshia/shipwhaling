/* eslint-disable @typescript-eslint/no-explicit-any */
import warships from './assets/warships.json';
import type { Ship } from './ship';

export interface Container {
  icon: any;
  name: string;
  drops: ItemDrop[];
  /** Each additional slot awards a separate drop on every opening. */
  additionalSlots?: { name: string; drops: ItemDrop[] }[];

  guaranteedDropAfter?: number;

  /**
   * @deprecated Use guaranteedDrop with type 'ship' instead
   */
  guaranteedDrop?: ItemDrop;
  guaranteedDropType?: 'ship';
}

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ItemDrop {
  probability: number;
  rarity?: Rarity;
  /** Item drops that are really ships missing from warships.json: each can only be received once */
  unique?: boolean;
  /** What you get instead when you already own everything in this drop */
  compensation?: Item;

  conditionalProbability?: number;
  condition?: string;

  name: string;
  items: Item[];

  type: 'item' | 'ship';
}

export interface Item {
  name: string;
  amount: number;

  ship?: Ship;
}

export function normalizeShipName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

export function verifyContainer(container: Container) {
  // check that the probabilities sum to 1
  const slots = [
    { name: 'Main slot', drops: container.drops },
    ...(container.additionalSlots ?? [])
  ];
  for (const slot of slots) {
    const sum = slot.drops.reduce((acc, drop) => acc + drop.probability, 0);
    if (Math.abs(sum - 1) > 1e-12) {
      throw new Error(
        `Probabilities do not sum to 1 for ${container.name}, ${slot.name}. Got ${sum}`
      );
    }
  }
  const allDrops = slots.flatMap((slot) => slot.drops);
  // check that all ships exist
  const unknownShips = allDrops
    .filter((drop) => drop.type === 'ship')
    .flatMap((drop) => drop.items.map((item) => item.name.replace(/\s/g, '')))
    .filter((name) => !warships.data.some((ship) => ship.name.replace(/\s/g, '') === name));
  // find closest match
  if (unknownShips.length > 0) {
    throw new Error(`Unknown ships in container ${container.name}: ${unknownShips.join(', ')}`);
  }
  // map ships to their data
  allDrops
    .filter((drop) => drop.type === 'ship')
    .flatMap((drop) => drop.items)
    .forEach((item) => {
      item.ship = warships.data.find(
        (ship) => normalizeShipName(ship.name) === normalizeShipName(item.name)
      );
    });
}
