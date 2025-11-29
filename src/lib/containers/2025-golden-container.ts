import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/golden-gift-container.png';

export const GoldenContainer2025: Container = {
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
      type: 'item',
      items: [{ name: 'Research Points', amount: 3750 }]
    },
    {
      probability: 0.1,
      name: 'Steel',
      type: 'item',
      items: [{ name: 'Steel', amount: 3000 }]
    },
    {
      probability: 0.09999,
      name: 'Ship (regular)',
      type: 'ship',
      conditionalProbability: 0,
      condition:
        'If you have all ships from this list, you will instead receive a Golden Ship or Roma Aeterna',
      items: [
        { name: 'Bremen', amount: 1 },
        { name: 'Hawaii', amount: 1 },
        { name: 'Aki', amount: 1 }
      ]
    },
    {
      probability: 0.00001,
      name: 'Golden Ship or Roma Aeterna',
      type: 'item', // HACK: because they don't exist yet
      conditionalProbability: 0.1,
      condition:
        'If you have all ships from the normal Ship list, you will instead receive a Golden Ship or Roma Aeterna',
      items: [
        { name: 'Bremen Golden', amount: 1 },
        { name: 'Hawaii Golden', amount: 1 },
        { name: 'Aki Golden', amount: 1 },
        { name: 'Roma Aeterna', amount: 1 }
      ]
    }
  ]
};

verifyContainer(GoldenContainer2025);
