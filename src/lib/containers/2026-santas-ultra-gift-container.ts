import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/santas-ultra-gift-container.png';
import { GoodShips2026, GreatShips2026, OkayShips2026 } from './2026-santas-ship-lists';

export const SantasUltraGiftContainer2026: Container = {
  icon,
  name: "Santa's Ultra Gift Container",

  guaranteedDropAfter: 7,
  guaranteedDropType: 'ship',

  // NOTE: This container has 3 slots in the game
  // Slot 1 (shown here): Doubloons, Coal, Golden Gift, Premium, Ships
  // Slot 2: Epic expendable economic bonuses (always drops)
  // Slot 3: Doubloons, Elite Commander XP, or Coal
  drops: [
    {
      probability: 0.05,
      name: 'Doubloons (Slot 1)',
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
      type: 'item',
      items: [{ name: '1x Golden Gift Container', amount: 1 }]
    },
    {
      probability: 0.03,
      name: 'WoWs Premium account',
      type: 'item',
      items: [{ name: 'Days of WoWs Premium Account', amount: 180 }]
    },
    {
      probability: 0.03,
      name: 'Ship (great)',
      type: 'ship',
      items: GreatShips2026
    },
    {
      probability: 0.09,
      name: 'Ship (good)',
      type: 'ship',
      items: GoodShips2026
    },
    {
      probability: 0.2,
      name: 'Ship (okay)',
      type: 'ship',
      items: OkayShips2026
    }
  ]
};

verifyContainer(SantasUltraGiftContainer2026);
