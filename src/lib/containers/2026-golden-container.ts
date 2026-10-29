import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/golden-gift-container.png';

export const GoldenContainer2026: Container = {
  icon,
  name: 'Golden Gift Container',

  guaranteedDropAfter: 10,
  guaranteedDropType: 'ship',

  drops: [
    {
      probability: 0.15 * 4,
      name: 'Epic Expendable Economic Bonus',
      type: 'item',
      items: [
        { name: 'Epic Credit Boosters', amount: 7 },
        { name: 'Epic Ship XP Boosters', amount: 7 },
        { name: 'Epic Commander XP Boosters', amount: 7 },
        { name: 'Epic Free XP Boosters', amount: 7 }
      ]
    },
    {
      probability: 0.2,
      name: 'Research Points',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Research Points', amount: 3750 }]
    },
    {
      probability: 0.1,
      name: 'Steel',
      rarity: 'rare',
      type: 'item',
      items: [{ name: 'Steel', amount: 3000 }]
    },
    {
      probability: 0.09999,
      name: 'Ship (regular)',
      rarity: 'epic',
      type: 'ship',
      conditionalProbability: 0,
      condition:
        'If you have all ships from this list, you will instead receive a Golden Ship or Tywysog Cymru',
      items: [
        { name: 'Latouche-Tréville', amount: 1 },
        { name: 'Rodina', amount: 1 },
        { name: 'Tōgasa', amount: 1 }
      ]
    },
    {
      probability: 0.00001,
      name: 'Golden Ship or Tywysog Cymru',
      rarity: 'legendary',
      type: 'item', // HACK: because they don't exist yet
      unique: true,
      compensation: { name: 'Battle Forged Premium Container', amount: 1 },
      conditionalProbability: 0.1,
      condition:
        'If you have all ships from the normal Ship list, you will instead receive a Golden Ship or Tywysog Cymru. If you own all of them, you receive a Battle Forged Premium Container instead.',
      items: [
        { name: 'Rodina G', amount: 1 },
        { name: 'Tōgasa G', amount: 1 },
        { name: 'Somers G', amount: 1 },
        { name: 'Tywysog Cymru', amount: 1 }
      ]
    }
  ]
};

verifyContainer(GoldenContainer2026);
