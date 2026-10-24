import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/santas-gift-container.png';
import { GoodShips2026, GreatShips2026, OkayShips2026 } from './2026-santas-ship-lists';

export const SantasGiftContainer2026: Container = {
  icon,
  name: "Santa's Gift Container",

  guaranteedDropAfter: 100,
  guaranteedDropType: 'ship',

  drops: [
    {
      probability: 0.05,
      name: 'Doubloons',
      type: 'item',
      items: [{ name: 'Doubloons', amount: 500 }]
    },
    {
      probability: 0.01,
      name: 'Golden Gift Container',
      type: 'item',
      items: [{ name: '1x Golden Gift Container', amount: 1 }]
    },
    {
      probability: 0.07,
      name: 'Coal',
      type: 'item',
      items: [{ name: 'Coal', amount: 2500 }]
    },
    {
      probability: 0.01,
      name: 'WoWs Premium account',
      type: 'item',
      items: [{ name: 'Days of WoWs Premium Account', amount: 30 }]
    },
    {
      probability: 0.1,
      name: 'Elite Commander XP',
      type: 'item',
      items: [{ name: 'Elite Commander XP', amount: 20000 }]
    },
    {
      probability: 0.1,
      name: 'Credits',
      type: 'item',
      items: [{ name: 'Credits', amount: 400000 }]
    },
    {
      probability: 0.055,
      name: 'Port Slot',
      type: 'item',
      items: [{ name: 'Port Slot', amount: 1 }]
    },
    {
      name: 'Rare Expendable Economic Bonus',
      type: 'item',
      probability: 0.025 * 4,
      items: [
        { name: 'Rare Credit Boosters', amount: 3 },
        { name: 'Rare Ship XP Boosters', amount: 3 },
        { name: 'Rare Commander XP Boosters', amount: 3 },
        { name: 'Rare Free XP Boosters', amount: 3 }
      ]
    },
    {
      name: 'Uncommon Expendable Economic Bonus',
      type: 'item',
      probability: 0.06 * 4,
      items: [
        { name: 'Uncommon Credit Boosters', amount: 12 },
        { name: 'Uncommon Ship XP Boosters', amount: 12 },
        { name: 'Uncommon Commander XP Boosters', amount: 12 },
        { name: 'Uncommon Free XP Boosters', amount: 12 }
      ]
    },
    {
      probability: 0.04 * 6,
      name: 'Signals',
      type: 'item',
      items: [
        { name: 'India Delta Signals', amount: 25 },
        { name: 'Sierra Mike Signals', amount: 25 },
        { name: 'Victor Lima Signals', amount: 25 },
        { name: 'India X-Ray Signals', amount: 25 },
        { name: 'X-Ray Papa Unaone Signals', amount: 25 },
        { name: 'Sierra Bravo Signals', amount: 25 }
      ]
    },
    {
      probability: 0.001,
      name: 'Ship (great)',
      type: 'ship',
      items: GreatShips2026
    },
    {
      probability: 0.004,
      name: 'Ship (good)',
      type: 'ship',
      items: GoodShips2026
    },
    {
      probability: 0.02,
      name: 'Ship (okay)',
      type: 'ship',
      items: OkayShips2026
    }
  ]
};

verifyContainer(SantasGiftContainer2026);
