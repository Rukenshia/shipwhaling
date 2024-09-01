import { type Ship } from './ship';

export interface Reward {
  festiveTokens: number;
  steel: number;
  baseXPRequired: number;
}

function isTestShip(ship: Ship): boolean {
  return [
    'Niord',
    'Kalmar',
    'Yari',
    'Lugdunum',
    'Teng She',
    'Ipiranga',
    'Los Andes',
    'Libertad',
    'Comodoro',
    'La Pampa',
    'Shinano',
    'Archerfish',
    'Svea',
    'Georg Hoffmann'
  ].includes(ship.name);
}

export function calculateShipReward(ship: Ship): Reward {
  const reward: Reward = {
    festiveTokens: 0,
    steel: 0,
    baseXPRequired: 0
  };

  if (ship.tier < 5) {
    return reward; // No rewards for ships below Tier V
  }

  if (isTestShip(ship)) {
    return reward; // No rewards for test ships
  }

  // Set Base XP required
  switch (ship.tier) {
    case 5:
      reward.baseXPRequired = 200;
      break;
    case 6:
      reward.baseXPRequired = 250;
      break;
    case 7:
      reward.baseXPRequired = 300;
      break;
    case 8:
      reward.baseXPRequired = 400;
      break;
    case 9:
      reward.baseXPRequired = 500;
      break;
    case 10:
      reward.baseXPRequired = 600;
      break;
    default:
      reward.baseXPRequired = 600; // Superships
  }

  // Set Festive Tokens or Steel reward
  if (ship.tier > 10) {
    reward.steel = 200;
  } else {
    switch (ship.tier) {
      case 5:
        reward.festiveTokens = 25;
        break;
      case 6:
        reward.festiveTokens = 35;
        break;
      case 7:
        reward.festiveTokens = 50;
        break;
      case 8:
        reward.festiveTokens = 75;
        break;
      case 9:
        reward.festiveTokens = 100;
        break;
      case 10:
        reward.festiveTokens = 125;
        break;
    }
  }

  return reward;
}

export function getMaxAdditionalRewards(shipsInPort: number): number {
  if (shipsInPort < 25) return 1;
  if (shipsInPort < 50) return 2;
  if (shipsInPort < 100) return 3;
  if (shipsInPort < 200) return 4;
  if (shipsInPort < 400) return 5;
  if (shipsInPort < 600) return 6;
  return 7;
}
