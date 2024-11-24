import { Coal, Steel, type Resource } from './resource';

export interface Modifier {
  resource: Resource;

  rate: number;
}

export interface ClanBuilding {
  name: string;
  resource: Resource;
  modifiers: number[];
}

export const CoalPort: ClanBuilding = {
  name: 'Coal Port',
  resource: Coal,
  modifiers: [1.0, 1.05, 1.07, 1.1]
};

export const SteelPort: ClanBuilding = {
  name: 'Steel Port',
  resource: Steel,
  modifiers: [1.0, 1.05, 1.07, 1.1]
};
