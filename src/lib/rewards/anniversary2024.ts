import { BaseXP, FestiveTokens, Steel, type Resource } from '$lib/resource';
import type { Reward } from '$lib/reward';
import type { Ship } from '$lib/ship';

export class Anniversary2024 {
  constructor() {}

  private isTestShip(ship: Ship): boolean {
    return ship.hasDemoProfile;
  }

  public possibleResources: Resource[] = [FestiveTokens, Steel];

  public calculateShipReward(ship: Ship): Reward | undefined {
    if (ship.tier < 5) {
      return; // No rewards for ships below Tier V
    }

    if (this.isTestShip(ship)) {
      return; // No rewards for test ships
    }

    const reward = {
      resource: FestiveTokens,
      requirement: {
        type: BaseXP,
        amount: 0
      },
      amount: 0
    };

    // Set Base XP required
    switch (ship.tier) {
      case 5:
        reward.requirement.amount = 200;
        break;
      case 6:
        reward.requirement.amount = 250;
        break;
      case 7:
        reward.requirement.amount = 300;
        break;
      case 8:
        reward.requirement.amount = 400;
        break;
      case 9:
        reward.requirement.amount = 500;
        break;
      case 10:
        reward.requirement.amount = 600;
        break;
      default:
        reward.requirement.amount = 600; // Superships
    }

    // Set Festive Tokens or Steel reward
    if (ship.tier > 10) {
      reward.resource = Steel;
    } else {
      switch (ship.tier) {
        case 5:
          reward.amount = 25;
          break;
        case 6:
          reward.amount = 35;
          break;
        case 7:
          reward.amount = 50;
          break;
        case 8:
          reward.amount = 75;
          break;
        case 9:
          reward.amount = 100;
          break;
        case 10:
          reward.amount = 125;
          break;
      }
    }

    return reward;
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
}
