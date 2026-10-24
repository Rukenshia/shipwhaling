import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/golden-gift-container.png';

export const BattleForgedPremiumContainer2026: Container = {
  icon,
  name: 'Battle Forged Premium Container',

  // NOTE: This container has 3 slots in the game
  // Slot 1: 3x Legendary expendable economic bonuses (always drops)
  // Slot 2 (shown here): Research Points, Steel, or New Jersey BF
  // Slot 3: 3x Legendary expendable economic bonuses (always drops)
  // New Jersey BF is guaranteed on the 3rd opening, which is not simulated while she is an item
  drops: [
    {
      probability: 0.25,
      name: 'Research Points (Slot 2)',
      type: 'item',
      items: [{ name: 'Research Points', amount: 10000 }]
    },
    {
      probability: 0.25,
      name: 'Steel (Slot 2)',
      type: 'item',
      items: [{ name: 'Steel', amount: 5000 }]
    },
    {
      probability: 0.5,
      name: 'New Jersey BF',
      type: 'item', // HACK: New Jersey BF is not in the ship list yet
      condition: 'If you already have New Jersey BF, you will instead receive 2,500 Steel',
      items: [{ name: 'New Jersey BF', amount: 1 }]
    }
  ]
};

verifyContainer(BattleForgedPremiumContainer2026);
