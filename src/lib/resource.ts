/* eslint-disable @typescript-eslint/no-explicit-any */
import coal from './assets/coal.svg';
import steel from './assets/steel.svg';
import festiveToken from './assets/festive-token.png';
import festiveCertificate from './assets/festive-certificate.png';
import baseXP from './assets/base-xp.svg';
import { SantasGiftContainer } from './containers/2024-santas-gift-container';
import { SantasMegaGiftContainer } from './containers/2024-santas-mega-gift-container';

export interface Resource {
  name: string;
  image: any;

  convertsTo?: Conversion[];
}

export interface Conversion {
  container?: any;
  cost: number;
  returns: number;
}

export const Coal: Resource = {
  name: 'Coal',
  image: coal
};

export const Steel: Resource = {
  name: 'Steel',
  image: steel
};

export const FestiveTokens: Resource = {
  name: 'Festive Tokens',
  image: festiveToken
};

export const FestiveCertificate: Resource = {
  name: 'Festive Certificate',
  image: festiveCertificate,

  convertsTo: [
    {
      container: SantasGiftContainer,
      cost: 1,
      returns: 1
    },
    {
      container: SantasMegaGiftContainer,
      cost: 5,
      returns: 1
    }
  ]
};

export const BaseXP: Resource = {
  name: 'Base XP',
  image: baseXP
};
