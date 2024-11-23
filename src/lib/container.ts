/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Container {
  icon: any;
  name: string;
  drops: ItemDrop[];
}

export interface ItemDrop {
  probability: number;

  name: string;
  items: Item[];
}

export interface Item {
  name: string;
  amount: number;
}

export function verifyProbabilities(container: Container) {
  const sum = container.drops.reduce((acc, drop) => acc + drop.probability, 0);

  if (sum !== 1) {
    throw new Error(`Probabilities do not sum to 1 for container ${container.name}. Got ${sum}`);
  }
}
