import { BaseXP, FestiveTokens, Steel, type Resource } from '$lib/resource';
import type { Reward } from '$lib/reward';
import type { Ship } from '$lib/ship';

export class Anniversary2025 {
  constructor() {}

  private isTestShip(ship: Ship): boolean {
    return ship.hasDemoProfile;
  }

  private isExperimentalShip(ship: Ship): boolean {
    return ship.isExperimental ?? false;
  }

  public possibleResources: Resource[] = [FestiveTokens, Steel];

  public calculateShipReward(ship: Ship): Reward | undefined {
    if (ship.tier < 5) {
      return; // No rewards for ships below Tier V
    }

    if (this.isExperimentalShip(ship)) {
      return;
    }

    if (this.isTestShip(ship)) {
      return; // No rewards for test ships
    }

    const reward = {
      resource: FestiveTokens,
      requiredXP: this.getBaseXPRequirement(ship.tier),
      amount: 0
    };

    // Set Festive Tokens or Steel reward
    return this.getRewardForTier(ship.tier);
  }

  public getMaxAdditionalRewards(shipsInPort: number): number {
    if (shipsInPort < 25) return 1;
    if (shipsInPort < 50) return 2;
    if (shipsInPort < 100) return 3;
    if (shipsInPort < 200) return 4;
    if (shipsInPort < 400) return 5;
    if (shipsInPort < 600) return 6;
    return 7;
  }

  public getRewardForTier(tier: number): Reward | undefined {
    if (tier < 5) return; // No rewards for ships below Tier V

    const requiredXP = this.getBaseXPRequirement(tier);

    switch (tier) {
      case 1:
      case 2:
      case 3:
      case 4:
        return { resource: BaseXP, requiredXP, amount: 0 };
      case 5:
        return { resource: FestiveTokens, requiredXP, amount: 25 };
      case 6:
        return { resource: FestiveTokens, requiredXP, amount: 35 };
      case 7:
        return { resource: FestiveTokens, requiredXP, amount: 50 };
      case 8:
        return { resource: FestiveTokens, requiredXP, amount: 75 };
      case 9:
        return { resource: FestiveTokens, requiredXP, amount: 100 };
      case 10:
        return { resource: FestiveTokens, requiredXP, amount: 125 };
      default:
        return { resource: Steel, requiredXP, amount: 200 }; // Superships
    }

    return undefined; // Fallback
  }

  public getBaseXPRequirement(tier: number): number {
    switch (tier) {
      case 5:
        return 200;
      case 6:
        return 250;
      case 7:
        return 300;
      case 8:
        return 400;
      case 9:
        return 500;
      case 10:
        return 600;
      default:
        return 600; // Superships
    }
  }

  public getAdditionalRewardXPRequirement(): number {
    return 1000;
  }
}
