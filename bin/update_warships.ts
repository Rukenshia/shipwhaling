/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import fs from 'fs';

import { Ship } from '../src/lib/ship';

interface Page {
  ships: Ship[];
  next?: number;
}

async function getShips() {
  const getPage = async (page: number): Promise<Page> => {
    const data = (
      await axios.get(`https://api.worldofwarships.eu/wows/encyclopedia/ships/`, {
        params: {
          page_no: page,
          application_id: process.env.WOWS_APP_ID,
          fields: 'ship_id,name,nation,type,tier,images.small,has_demo_profile'
        }
      })
    ).data;

    return {
      ships: Object.values(data.data).map((ship: any) => ({
        id: ship.ship_id,
        name: ship.name,
        nation: ship.nation,
        type: ship.type,
        tier: ship.tier,
        image: ship.images.small,
        hasDemoProfile: ship.has_demo_profile
      })),
      next: data.meta.page_total > page ? page + 1 : undefined
    };
  };

  let page = await getPage(1);
  const ships: Ship[] = [...page.ships];
  while (page.next) {
    page = await getPage(page.next);

    ships.push(...page.ships);
  }

  return ships;
}

(async () => {
  const ships = await getShips();

  fs.writeFileSync('src/lib/assets/warships.json', JSON.stringify({ data: ships }));
})();
