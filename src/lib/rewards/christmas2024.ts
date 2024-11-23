import { Coal, SantasGiftCertificate, Steel, type Resource } from '$lib/resource';
import type { Reward } from '$lib/reward';
import type { Ship } from '$lib/ship';

export class Christmas2024 {
  constructor() {}

  private isTestShip(ship: Ship): boolean {
    return ship.hasDemoProfile;
  }

  public possibleResources: Resource[] = [SantasGiftCertificate, Steel, Coal];

  public calculateShipReward(ship: Ship): Reward | undefined {
    if (ship.tier < 5) {
      return; // No rewards for ships below Tier V
    }

    if (this.isTestShip(ship)) {
      return; // No rewards for test ships
    }

    const reward = {
      resource: Coal,
      requiredXP: 0,
      amount: 0
    };

    // Set Base XP required
    switch (ship.tier) {
      case 5:
        reward.requiredXP = 200;
        reward.resource = Coal;
        reward.amount = 700;
        break;
      case 6:
        reward.requiredXP = 250;
        reward.resource = Coal;
        reward.amount = 750;
        break;
      case 7:
        reward.requiredXP = 300;
        reward.resource = Coal;
        reward.amount = 800;
        break;
      case 8:
        reward.requiredXP = 400;
        reward.resource = Steel;
        reward.amount = 70;
        break;
      case 9:
        reward.requiredXP = 500;
        reward.resource = Steel;
        reward.amount = 80;
        break;
      case 10:
        reward.requiredXP = 600;
        reward.resource = SantasGiftCertificate;
        reward.amount = 1;
        break;
      case 11:
        reward.requiredXP = 600; // Superships
        reward.resource = Steel;
        reward.amount = 200;
        break;
      default:
        console.warn('Unknown ship tier:', ship.tier, ship.name);
        return;
    }

    return reward;
  }

  public getMaxAdditionalRewards(ships: Ship[]): number {
    const shipsInPort = ships.filter((ship) => !this.isTestShip(ship)).length;

    if (shipsInPort < 25) return 1;
    if (shipsInPort < 50) return 2;
    if (shipsInPort < 100) return 3;
    if (shipsInPort < 200) return 4;
    if (shipsInPort < 400) return 5;
    if (shipsInPort < 600) return 6;
    return 7;
  }
}
