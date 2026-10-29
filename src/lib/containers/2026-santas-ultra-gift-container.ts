import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/christmas2026/santas-ultra-gift-container.png';
import { GoodShips2026, GreatShips2026, OkayShips2026 } from './2026-santas-ship-lists';

export const SantasUltraGiftContainer2026: Container = {
  icon,
  name: "Santa's Ultra Gift Container",

  guaranteedDropAfter: 7,
  guaranteedDropType: 'ship',

  // Update 15.11: one reward from each of three independent slots.
  additionalSlots: [
    {
      name: 'Slot 2',
      drops: [
        {
          name: 'Epic Expendable Economic Bonus (Slot 2)',
          probability: 1,
          type: 'item',
          items: [
            { name: 'Epic Credit Boosters', amount: 6 },
            { name: 'Epic Ship XP Boosters', amount: 6 },
            { name: 'Epic Commander XP Boosters', amount: 6 },
            { name: 'Epic Free XP Boosters', amount: 6 }
          ]
        }
      ]
    },
    {
      name: 'Slot 3',
      drops: [
        {
          name: 'Doubloons (Slot 3)',
          probability: 0.05,
          type: 'item',
          rarity: 'rare',
          items: [{ name: 'Doubloons', amount: 2500 }]
        },
        {
          name: 'Elite Commander XP (Slot 3)',
          probability: 0.81,
          type: 'item',
          items: [{ name: 'Elite Commander XP', amount: 37500 }]
        },
        {
          name: 'Coal (Slot 3)',
          probability: 0.14,
          type: 'item',
          items: [{ name: 'Coal', amount: 6000 }]
        }
      ]
    }
  ],
  drops: [
    {
      probability: 0.05,
      name: 'Doubloons (Slot 1)',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Doubloons', amount: 2500 }]
    },
    {
      probability: 0.4,
      name: 'Coal (Slot 1)',
      type: 'item',
      items: [{ name: 'Coal', amount: 6000 }]
    },
    {
      probability: 0.2,
      name: 'Golden Gift Container',
      rarity: 'epic',
      type: 'item',
      items: [{ name: '1x Golden Gift Container', amount: 1 }]
    },
    {
      probability: 0.03,
      name: 'WoWs Premium account',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Days of WoWs Premium Account', amount: 180 }]
    },
    {
      probability: 0.03,
      name: 'Ship (great)',
      rarity: 'legendary',
      type: 'ship',
      compensation: { name: 'Steel', amount: 1250 },
      items: GreatShips2026
    },
    {
      probability: 0.09,
      name: 'Ship (good)',
      rarity: 'epic',
      type: 'ship',
      compensation: { name: 'Steel', amount: 1250 },
      items: GoodShips2026
    },
    {
      probability: 0.2,
      name: 'Ship (okay)',
      rarity: 'rare',
      type: 'ship',
      compensation: { name: 'Steel', amount: 1250 },
      items: OkayShips2026
    }
  ]
};

verifyContainer(SantasUltraGiftContainer2026);
