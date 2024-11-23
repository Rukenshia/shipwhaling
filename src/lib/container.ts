export interface Container {
  items: ItemDrop[];
}

export interface ItemDrop {
  probability: number;

  items: Item[];
}

export interface Item {
  name: string;
  amount: number;
}
