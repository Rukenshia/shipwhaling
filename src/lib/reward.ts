import type { Resource } from './resource';

export interface Reward {
  requiredXP: number;
  resource: Resource;
  amount: number;
}
