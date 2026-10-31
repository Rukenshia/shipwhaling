import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/christmas2026/battle-forged-premium-container.png';

export const BattleForgedPremiumContainer2026: Container = {
  icon,
  name: 'Battle Forged Premium Container',

  guaranteedDropAfter: 3,
  guaranteedDropType: 'ship',

  // Slot 2 is the main drop; slots 1 and 3 each independently award a bonus type.
  mainSlotName: 'Slot 2',
  additionalSlots: [1, 3].map((slot) => ({
    name: `Slot ${slot}`,
    drops: [
      {
        name: `Legendary Expendable Economic Bonus (Slot ${slot})`,
        probability: 1,
        rarity: 'legendary',
        type: 'item',
        items: [
          { name: 'Legendary Credit Boosters', amount: 3 },
          { name: 'Legendary Ship XP Boosters', amount: 3 },
          { name: 'Legendary Commander XP Boosters', amount: 3 },
          { name: 'Legendary Free XP Boosters', amount: 3 }
        ]
      }
    ]
  })),
  drops: [
    {
      probability: 0.25,
      name: 'Research Points (Slot 2)',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Research Points', amount: 10000 }]
    },
    {
      probability: 0.25,
      name: 'Steel (Slot 2)',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Steel', amount: 5000 }]
    },
    {
      probability: 0.5,
      name: 'New Jersey BF',
      rarity: 'legendary',
      type: 'item', // HACK: New Jersey BF is not in the ship list yet
      unique: true,
      compensation: { name: 'Steel', amount: 2500 },
      condition: 'If you already have New Jersey BF, you will instead receive 2,500 Steel',
      items: [{ name: 'New Jersey BF', amount: 1 }]
    }
  ]
};

verifyContainer(BattleForgedPremiumContainer2026);
