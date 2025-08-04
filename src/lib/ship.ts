export interface Ship {
  id: number;
  tier: number;
  name: string;
  type: string;
  image: string;
  hasDemoProfile: boolean;
  isExperimental?: boolean;

  inPort?: boolean;
}
