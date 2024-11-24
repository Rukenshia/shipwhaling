import { verifyProbabilities, type Container } from '$lib/container';
import icon from '$lib/assets/santas-mega-gift-container.png';

export const SantasMegaGiftContainer: Container = {
  icon,
  name: "Santa's Mega Gift Container",

  guaranteedDropAfter: 15,
  guaranteedDrop: {
    probability: 1,
    name: 'Ship (any)',
    items: [{ name: 'Any ship the container can drop', amount: 1 }]
  },

  drops: [
    {
      probability: 0.05,
      name: 'Dubloons',
      items: [{ name: 'Dubloons', amount: 2500 }]
    },
    {
      probability: 0.08,
      name: 'Coal',
      items: [{ name: 'Coal', amount: 12500 }]
    },
    {
      probability: 0.1,
      name: 'Golden Container',
      items: [{ name: 'Golden Container', amount: 1 }]
    },
    {
      probability: 0.01,
      name: 'WoWs Premium account',
      items: [{ name: 'Days of WoWs Premium Account', amount: 180 }]
    },
    {
      probability: 0.1,
      name: 'Elite Commander XP',
      items: [{ name: 'Elite Commander XP', amount: 100000 }]
    },
    {
      probability: 0.1,
      name: 'Credits',
      items: [{ name: 'Credits', amount: 2250000 }]
    },
    {
      probability: 0.08 * 4,
      name: 'Rare Expendable Economic Bonus',
      items: [
        { name: 'Rare Credit Boosters', amount: 20 },
        { name: 'Rare Ship XP Boosters', amount: 20 },
        { name: 'Rare Commander XP Boosters', amount: 20 },
        { name: 'Rare Free XP Boosters', amount: 20 }
      ]
    },
    {
      probability: 0.02 * 4,
      name: 'Unique Expendable Economic Bonus',
      items: [
        { name: 'Unique Credit Boosters', amount: 7 },
        { name: 'Unique Ship XP Boosters', amount: 7 },
        { name: 'Unique Commander XP Boosters', amount: 7 },
        { name: 'Unique Free XP Boosters', amount: 7 }
      ]
    },
    {
      probability: 0.12,
      name: 'Ship (okay)',
      items: [
        { name: 'Ise', amount: 1 },
        { name: 'Weimar', amount: 1 },
        { name: 'Hill', amount: 1 },
        { name: 'California', amount: 1 },
        { name: 'Rio de Janeiro', amount: 1 },
        { name: 'Jupiter', amount: 1 },
        { name: 'Picardie', amount: 1 },
        { name: "Orion '44", amount: 1 },
        { name: 'Rodney', amount: 1 },
        { name: 'Theseus', amount: 1 },
        { name: "Xin Zhong Guo '14", amount: 1 },
        { name: 'Hyūga', amount: 1 },
        { name: 'Yūdachi', amount: 1 },
        { name: 'Tokachi', amount: 1 },
        { name: 'Maya', amount: 1 },
        { name: 'Bearn', amount: 1 },
        { name: 'Florida', amount: 1 },
        { name: 'Huron', amount: 1 },
        { name: 'Elli', amount: 1 },
        { name: 'Exeter', amount: 1 },
        { name: 'München', amount: 1 },
        { name: 'F. Ferruccio', amount: 1 },
        { name: 'Nueve de Julio', amount: 1 },
        { name: 'Monaghan', amount: 1 },
        { name: 'Boise', amount: 1 },
        { name: 'Abruzzi', amount: 1 },
        { name: 'Agincourt', amount: 1 },
        { name: 'De Grasse', amount: 1 },
        { name: 'Ashitaka', amount: 1 },
        { name: 'Siroco', amount: 1 },
        { name: 'FR25', amount: 1 },
        { name: 'Poltava', amount: 1 },
        { name: 'Hood', amount: 1 },
        { name: 'Juruá', amount: 1 },
        { name: 'Mikoyan', amount: 1 },
        { name: 'Gorizia', amount: 1 },
        { name: 'Montcalm', amount: 1 },
        { name: 'Dunkerque', amount: 1 },
        { name: 'Mutsu', amount: 1 },
        { name: 'London', amount: 1 },
        { name: 'Strasbourg', amount: 1 },
        { name: 'Yukon', amount: 1 },
        { name: 'Karl von Schönberg', amount: 1 },
        { name: 'Admiral Makarov', amount: 1 },
        { name: 'Leningrad', amount: 1 },
        { name: 'Mysore', amount: 1 },
        { name: 'Perth', amount: 1 },
        { name: 'Scharnhorst', amount: 1 },
        { name: 'Toulon', amount: 1 },
        { name: 'Leipzig', amount: 1 },
        { name: 'Collingwood', amount: 1 },
        { name: 'Krasny Krym', amount: 1 },
        { name: 'Gallant', amount: 1 },
        { name: 'Okhotnik', amount: 1 },
        { name: "W.Virginia '44", amount: 1 },
        { name: 'Molotov', amount: 1 }
      ]
    },
    {
      probability: 0.03,
      name: 'Ship (good)',
      items: [
        { name: 'Minegumo', amount: 1 },
        { name: 'Tirpitz', amount: 1 },
        { name: 'Navarin', amount: 1 },
        { name: 'Wiesbaden', amount: 1 },
        { name: 'Kidd', amount: 1 },
        { name: 'Tsurugi', amount: 1 },
        { name: 'Atago', amount: 1 },
        { name: 'Tianjin', amount: 1 },
        { name: 'Hornet', amount: 1 },
        { name: 'Indomitable', amount: 1 },
        { name: 'Jäger', amount: 1 },
        { name: 'Chkalov', amount: 1 },
        { name: 'I-56', amount: 1 },
        { name: 'Victoria', amount: 1 },
        { name: 'Wichita', amount: 1 },
        { name: 'Z-44', amount: 1 },
        { name: 'Rochester', amount: 1 },
        { name: 'Orkan', amount: 1 },
        { name: 'Borodino', amount: 1 },
        { name: 'Cheshire', amount: 1 },
        { name: 'Flandre', amount: 1 },
        { name: 'Siliwangi', amount: 1 },
        { name: 'Constellation', amount: 1 },
        { name: 'Ochakov', amount: 1 },
        { name: 'Congress', amount: 1 },
        { name: 'Giuseppe Verdi', amount: 1 },
        { name: 'Petr Bagration', amount: 1 },
        { name: 'Carnot', amount: 1 },
        { name: 'S-189', amount: 1 },
        { name: 'Anhalt', amount: 1 },
        { name: 'Dalian', amount: 1 },
        { name: 'Schill', amount: 1 },
        { name: 'Tone', amount: 1 },
        { name: 'Hampshire', amount: 1 },
        { name: 'Aquila', amount: 1 },
        { name: 'Z-35', amount: 1 },
        { name: 'Fenyang', amount: 1 },
        { name: 'Sun Yat-sen', amount: 1 },
        { name: "Tiger '59", amount: 1 },
        { name: 'Tulsa', amount: 1 },
        { name: 'Halford', amount: 1 },
        { name: 'Scarlet Thunder', amount: 1 },
        { name: 'Almirante Grau', amount: 1 },
        { name: 'Alliance', amount: 1 },
        { name: 'Numancia', amount: 1 },
        { name: 'Karl XIV Johan', amount: 1 },
        { name: 'Velos', amount: 1 },
        { name: 'Nottingham', amount: 1 },
        { name: 'Ägir', amount: 1 }
      ]
    },
    {
      probability: 0.01,
      name: 'Ship (great)',
      items: [
        { name: 'Rhode Island', amount: 1 },
        { name: 'Malta', amount: 1 },
        { name: 'Johnston', amount: 1 },
        { name: 'Georgia', amount: 1 },
        { name: 'Defence', amount: 1 },
        { name: 'Brisbane', amount: 1 },
        { name: 'Admiral Graf Spee', amount: 1 },
        { name: 'Thunderer', amount: 1 },
        { name: 'Tromp', amount: 1 },
        { name: 'Massachusetts', amount: 1 },
        { name: 'Jean Bart', amount: 1 },
        { name: 'Smolensk', amount: 1 },
        { name: 'Álvaro de Bazán', amount: 1 },
        { name: 'Lenin', amount: 1 },
        { name: 'T-61', amount: 1 },
        { name: 'Asashio', amount: 1 },
        { name: 'Z-39', amount: 1 },
        { name: 'Haida', amount: 1 },
        { name: 'Anchorage', amount: 1 },
        { name: 'Odin', amount: 1 },
        { name: 'Erich Loewenhardt', amount: 1 },
        { name: 'Hizen', amount: 1 },
        { name: 'Mikhail Kutuzov', amount: 1 },
        { name: 'Cesare', amount: 1 },
        { name: 'Belfast', amount: 1 },
        { name: 'Colossus', amount: 1 },
        { name: 'Benham', amount: 1 },
        { name: "Tashkent '39", amount: 1 },
        { name: 'Kamikaze', amount: 1 },
        { name: 'Kamikaze R', amount: 1 },
        { name: 'Fūjin', amount: 1 },
        { name: 'Gremyashchy', amount: 1 },
        { name: 'Enterprise', amount: 1 },
        { name: 'Missouri', amount: 1 },
        { name: 'Kronshtadt', amount: 1 },
        { name: 'Musashi', amount: 1 },
        { name: 'Småland', amount: 1 },
        { name: 'Alaska', amount: 1 },
        { name: 'Friesland', amount: 1 },
        { name: 'Nelson', amount: 1 }
      ]
    }
  ]
};

verifyProbabilities(SantasMegaGiftContainer);
