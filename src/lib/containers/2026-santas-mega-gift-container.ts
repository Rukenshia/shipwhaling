import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/christmas2026/santas-mega-gift-container.png';
import { GoodShips2026, GreatShips2026, OkayShips2026 } from './2026-santas-ship-lists';

export const SantasMegaGiftContainer2026: Container = {
  icon,
  name: "Santa's Mega Gift Container",

  guaranteedDropAfter: 15,
  guaranteedDropType: 'ship',

  drops: [
    {
      probability: 0.05,
      name: 'Doubloons',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Doubloons', amount: 2500 }]
    },
    {
      probability: 0.08,
      name: 'Coal',
      type: 'item',
      items: [{ name: 'Coal', amount: 12500 }]
    },
    {
      probability: 0.1,
      name: 'Golden Gift Container',
      rarity: 'epic',
      type: 'item',
      items: [{ name: '1x Golden Gift Container', amount: 1 }]
    },
    {
      probability: 0.01,
      name: 'WoWs Premium account',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Days of WoWs Premium Account', amount: 180 }]
    },
    {
      probability: 0.1,
      name: 'Elite Commander XP',
      type: 'item',
      items: [{ name: 'Elite Commander XP', amount: 100000 }]
    },
    {
      probability: 0.1,
      name: 'Credits',
      type: 'item',
      items: [{ name: 'Credits', amount: 2250000 }]
    },
    {
      name: 'Rare Expendable Economic Bonus',
      type: 'item',
      probability: 0.08 * 4,
      items: [
        { name: 'Rare Credit Boosters', amount: 20 },
        { name: 'Rare Ship XP Boosters', amount: 20 },
        { name: 'Rare Commander XP Boosters', amount: 20 },
        { name: 'Rare Free XP Boosters', amount: 20 }
      ]
    },
    {
      name: 'Epic Expendable Economic Bonus',
      rarity: 'rare',
      type: 'item',
      probability: 0.02 * 4,
      items: [
        { name: 'Epic Credit Boosters', amount: 7 },
        { name: 'Epic Ship XP Boosters', amount: 7 },
        { name: 'Epic Commander XP Boosters', amount: 7 },
        { name: 'Epic Free XP Boosters', amount: 7 }
      ]
    },
    {
      probability: 0.01,
      name: 'Ship (great)',
      rarity: 'legendary',
      type: 'ship',
      compensation: { name: 'Steel', amount: 1250 },
      items: GreatShips2026
    },
    {
      probability: 0.03,
      name: 'Ship (good)',
      rarity: 'epic',
      type: 'ship',
      compensation: { name: 'Steel', amount: 1250 },
      items: GoodShips2026
    },
    {
      probability: 0.12,
      name: 'Ship (okay)',
      rarity: 'rare',
      type: 'ship',
      compensation: { name: 'Steel', amount: 1250 },
      items: OkayShips2026
    }
  ]
};

verifyContainer(SantasMegaGiftContainer2026);
