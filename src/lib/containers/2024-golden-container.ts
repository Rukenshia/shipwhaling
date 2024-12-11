import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/golden-gift-container.png';

export const GoldenContainer: Container = {
  icon,
  name: 'Golden Gift Container',

  guaranteedDropAfter: 10,
  guaranteedDrop: {
    probability: 1,
    name: 'Ship (any)',
    type: 'item', // HACK: compensation
    items: [{ name: 'Any ship the container can drop', amount: 1 }]
  },

  drops: [
    {
      probability: 0.15 * 4,
      name: 'Unique Expendable Economic Bonus',
      type: 'item',
      items: [
        { name: 'Unique Credit Boosters', amount: 7 },
        { name: 'Unique Ship XP Boosters', amount: 7 },
        { name: 'Unique Commander XP Boosters', amount: 7 },
        { name: 'Unique Free XP Boosters', amount: 7 }
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
      name: 'Ship',
      type: 'ship',
      conditionalProbability: 0,
      condition: 'If you have all ships from this list, you will instead receive a Golden Ship',
      items: [
        { name: 'Georg Hoffmann', amount: 1 },
        { name: 'Prins van Oranje', amount: 1 },
        { name: 'Chikuma II', amount: 1 }
      ]
    },
    {
      probability: 0.00001,
      name: 'Golden Ship',
      type: 'item', // HACK: because they don't exist yet
      conditionalProbability: 0.1,
      condition:
        'If you have all ships from the normal Ship list, you will instead receive a Golden Ship',
      items: [
        { name: 'Georg Hoffman Gold', amount: 1 },
        { name: 'Prins van Oranje Gold', amount: 1 },
        { name: 'Chikuma II Gold', amount: 1 }
      ]
    }
  ]
};

verifyContainer(GoldenContainer);
