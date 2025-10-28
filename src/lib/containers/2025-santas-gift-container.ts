import { verifyContainer, type Container } from '$lib/container';
import icon from '$lib/assets/santas-gift-container.png';

export const SantasGiftContainer2025: Container = {
  icon,
  name: "Santa's Gift Container",

  guaranteedDropAfter: 100,
  guaranteedDrop: {
    probability: 1,
    name: 'Ship (any)',
    type: 'item', // HACK: compensation
    items: [{ name: 'Any ship the container can drop', amount: 1 }]
  },

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
      items: [
        { name: 'La Pampa', amount: 1 },
        { name: 'Incheon', amount: 1 },
        { name: 'Monmouth', amount: 1 },
        { name: 'Sibir', amount: 1 },
        { name: 'Hildebrand', amount: 1 },
        { name: 'Taihang', amount: 1 },
        { name: 'Rhode Island', amount: 1 },
        { name: 'Defence', amount: 1 },
        { name: 'Thunderer', amount: 1 },
        { name: 'Smolensk', amount: 1 },
        { name: 'Álvaro de Bazán', amount: 1 },
        { name: 'Lenin', amount: 1 },
        { name: 'Anchorage', amount: 1 },
        { name: 'Odin', amount: 1 },
        { name: 'Hizen', amount: 1 },
        { name: 'Giulio Cesare', amount: 1 },
        { name: 'Belfast', amount: 1 },
        { name: 'Benham', amount: 1 },
        { name: 'Kamikaze', amount: 1 },
        { name: 'Kamikaze R', amount: 1 },
        { name: 'Fūjin', amount: 1 },
        { name: 'Gremyashchy', amount: 1 },
        { name: 'Enterprise', amount: 1 },
        { name: 'Missouri', amount: 1 },
        { name: 'Kronshtadt', amount: 1 },
        { name: 'Musashi', amount: 1 },
        { name: 'Småland', amount: 1 },
        { name: 'Johnston', amount: 1 },
        { name: 'Georgia', amount: 1 },
        { name: 'Admiral Graf Spee', amount: 1 },
        { name: 'Massachusetts', amount: 1 },
        { name: 'Jean Bart', amount: 1 },
        { name: 'T-61', amount: 1 },
        { name: 'Asashio', amount: 1 },
        { name: 'Z-39', amount: 1 },
        { name: 'Haida', amount: 1 },
        { name: 'Erich Loewenhardt', amount: 1 },
        { name: 'Mikhail Kutuzov', amount: 1 },
        { name: 'Colossus', amount: 1 },
        { name: 'Alaska', amount: 1 },
        { name: 'Friesland', amount: 1 },
        { name: 'Nelson', amount: 1 }
      ]
    },
    {
      probability: 0.004,
      name: 'Ship (good)',
      type: 'ship',
      items: [
        { name: 'Kozma Minin', amount: 1 },
        { name: 'Suzuya', amount: 1 },
        { name: 'Cambridge', amount: 1 },
        { name: 'Wiesbaden', amount: 1 },
        { name: 'Tsurugi', amount: 1 },
        { name: 'Victoria', amount: 1 },
        { name: 'Cheshire', amount: 1 },
        { name: 'Schill', amount: 1 },
        { name: 'Scarlet Thunder', amount: 1 },
        { name: 'Almirante Grau', amount: 1 },
        { name: 'Ferrante Gonzaga', amount: 1 },
        { name: 'Eskimo', amount: 1 },
        { name: 'Provorny', amount: 1 },
        { name: 'Minegumo', amount: 1 },
        { name: 'Tirpitz', amount: 1 },
        { name: 'Navarin', amount: 1 },
        { name: 'Kidd', amount: 1 },
        { name: 'Tianjin', amount: 1 },
        { name: 'Hornet', amount: 1 },
        { name: 'Indomitable', amount: 1 },
        { name: 'Jäger', amount: 1 },
        { name: 'Chkalov', amount: 1 },
        { name: 'I-56', amount: 1 },
        { name: 'Wichita', amount: 1 },
        { name: 'Z-44', amount: 1 },
        { name: 'Orkan', amount: 1 },
        { name: 'Borodino', amount: 1 },
        { name: 'Flandre', amount: 1 },
        { name: 'Siliwangi', amount: 1 },
        { name: 'Constellation', amount: 1 },
        { name: 'Ochakov', amount: 1 },
        { name: 'Congress', amount: 1 },
        { name: 'Giuseppe Verdi', amount: 1 },
        { name: 'Pyotr Bagration', amount: 1 },
        { name: 'Carnot', amount: 1 },
        { name: 'S-189', amount: 1 },
        { name: 'Anhalt', amount: 1 },
        { name: 'Dalian', amount: 1 },
        { name: 'Tone', amount: 1 },
        { name: 'Hampshire', amount: 1 },
        { name: 'Aquila', amount: 1 },
        { name: 'Z-35', amount: 1 },
        { name: 'Fenyang', amount: 1 },
        { name: 'Sun Yat-Sen', amount: 1 },
        { name: "Tiger '59", amount: 1 },
        { name: 'Tulsa', amount: 1 },
        { name: 'Halford', amount: 1 },
        { name: 'Alliance', amount: 1 },
        { name: 'Numancia', amount: 1 },
        { name: 'Karl XIV Johan', amount: 1 },
        { name: 'Velos', amount: 1 },
        { name: 'Nottingham', amount: 1 },
        { name: 'Ägir', amount: 1 }
      ]
    },
    {
      probability: 0.02,
      name: 'Ship (okay)',
      type: 'ship',
      items: [
        { name: "Orion '44", amount: 1 },
        { name: 'Rodney', amount: 1 },
        { name: 'Theseus', amount: 1 },
        { name: 'Tokachi', amount: 1 },
        { name: 'Elli', amount: 1 },
        { name: 'Francesco Ferruccio', amount: 1 },
        { name: 'Poltava', amount: 1 },
        { name: 'Gorizia', amount: 1 },
        { name: 'Montcalm', amount: 1 },
        { name: 'Admiral Makarov', amount: 1 },
        { name: 'Royal Sovereign', amount: 1 },
        { name: 'Arkhangelsk', amount: 1 },
        { name: 'Ise', amount: 1 },
        { name: "Tashkent '39", amount: 1 },
        { name: 'Weimar', amount: 1 },
        { name: 'Hill', amount: 1 },
        { name: 'California', amount: 1 },
        { name: 'Rio de Janeiro', amount: 1 },
        { name: "Jupiter '42", amount: 1 },
        { name: 'Picardie', amount: 1 },
        { name: 'Xin Zhong Guo 14', amount: 1 },
        { name: 'Hyūga', amount: 1 },
        { name: 'Maya', amount: 1 },
        { name: 'Béarn', amount: 1 },
        { name: 'Florida', amount: 1 },
        { name: 'Exeter', amount: 1 },
        { name: 'München', amount: 1 },
        { name: 'Nueve de Julio', amount: 1 },
        { name: 'Monaghan', amount: 1 },
        { name: 'Boise', amount: 1 },
        { name: 'Duca degli Abruzzi', amount: 1 },
        { name: 'De Grasse', amount: 1 },
        { name: 'Ashitaka', amount: 1 },
        { name: 'FR25', amount: 1 },
        { name: 'Hood', amount: 1 },
        { name: 'Juruá', amount: 1 },
        { name: 'Mutsu', amount: 1 },
        { name: 'London', amount: 1 },
        { name: 'Strasbourg', amount: 1 },
        { name: 'Yukon', amount: 1 },
        { name: 'Leningrad', amount: 1 },
        { name: 'Mysore', amount: 1 },
        { name: 'Scharnhorst', amount: 1 },
        { name: 'Toulon', amount: 1 },
        { name: 'Collingwood', amount: 1 },
        { name: 'Krasny Krym', amount: 1 },
        { name: 'Gallant', amount: 1 },
        { name: 'Okhotnik', amount: 1 }
      ]
    }
  ]
};

verifyContainer(SantasGiftContainer2025);
