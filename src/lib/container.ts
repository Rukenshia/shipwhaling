/* eslint-disable @typescript-eslint/no-explicit-any */
import warships from './assets/warships.json';
import type { Ship } from './ship';

export interface Container {
  icon: any;
  name: string;
  drops: ItemDrop[];

  guaranteedDropAfter?: number;
  guaranteedDrop?: ItemDrop;
}

export interface ItemDrop {
  probability: number;

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

export function verifyContainer(container: Container) {
  // check that the probabilities sum to 1
  const sum = container.drops.reduce((acc, drop) => acc + drop.probability, 0);
  if (sum !== 1) {
    throw new Error(`Probabilities do not sum to 1 for container ${container.name}. Got ${sum}`);
  }
  // check that all ships exist
  const unknownShips = container.drops
    .filter((drop) => drop.type === 'ship')
    .flatMap((drop) => drop.items.map((item) => item.name.replace(/\s/g, '')))
    .filter((name) => !warships.data.some((ship) => ship.name.replace(/\s/g, '') === name));
  // find closest match
  if (unknownShips.length > 0) {
    throw new Error(`Unknown ships in container ${container.name}: ${unknownShips.join(', ')}`);
  }
  // map ships to their data
  container.drops
    .filter((drop) => drop.type === 'ship')
    .flatMap((drop) => drop.items)
    .forEach((item) => {
      item.ship = warships.data.find((ship) => ship.name === item.name);
    });
}
