/* eslint-disable @typescript-eslint/no-explicit-any */
import coal from './assets/coal.svg';
import steel from './assets/steel.svg';
import festiveToken from './assets/festive-token.png';
import baseXP from './assets/base-xp.svg';

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

export const BaseXP: Resource = {
  name: 'Base XP',
  image: baseXP
};
