import { verifyProbabilities, type Container } from '$lib/container';

export const GoldenContainer: Container = {
  icon: '',
  name: 'Golden Container',

  drops: [
    {
      probability: 0.15 * 4,
      name: 'Unique Expendable Economic Bonus',
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
      items: [{ name: 'Research Points', amount: 3750 }]
    },
    {
      probability: 0.1,
      name: 'Steel',
      items: [{ name: 'Steel', amount: 3000 }]
    },
    {
      probability: 0.099, // FIXME: is this true?
      name: 'Ship',
      items: [
        { name: 'Georg Hoffman', amount: 1 },
        { name: 'Prins van Oranje', amount: 1 },
        { name: 'Chikuma II', amount: 1 }
      ]
    },
    {
      probability: 0.001,
      name: 'Golden Ship',
      items: [
        { name: 'Georg Hoffman Gold', amount: 1 },
        { name: 'Prins van Oranje Gold', amount: 1 },
        { name: 'Chikuma II Gold', amount: 1 }
      ]
    }
  ]
};

verifyProbabilities(GoldenContainer);
