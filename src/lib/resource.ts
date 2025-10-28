/* eslint-disable @typescript-eslint/no-explicit-any */
import coal from './assets/coal.svg';
import steel from './assets/steel.svg';
import festiveToken from './assets/festive-token.png';
import festiveCertificate from './assets/festive-certificate.png';
import baseXP from './assets/base-xp.svg';
import { SantasGiftContainer2025 } from './containers/2025-santas-gift-container';
import { SantasMegaGiftContainer2025 } from './containers/2025-santas-mega-gift-container';

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
      container: SantasGiftContainer2025,
      cost: 1,
      returns: 1
    },
    {
      container: SantasMegaGiftContainer2025,
      cost: 5,
      returns: 1
    }
  ]
};

export const BaseXP: Resource = {
  name: 'Base XP',
  image: baseXP
};
