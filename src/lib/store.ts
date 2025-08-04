import axios from 'axios';
import { writable, type Writable } from 'svelte/store';

export enum Realm {
  EU = 'eu',
  NA = 'com',
  ASIA = 'asia'
}

class User {
  public realm: Realm;
  public token: string;
  public expires_at: number;
  public account_id: string;

  public username: string;

  constructor(
    realm: Realm,
    token: string,
    expires_at: number,
    account_id: string,
    username: string
  ) {
    this.realm = realm;
    this.token = token;
    this.expires_at = expires_at;
    this.account_id = account_id;
    this.username = username;
  }

  private isTokenExpired() {
    return Date.now() > this.expires_at * 1000;
  }

  private getQueryParams() {
    return {
      application_id: import.meta.env.VITE_WARGAMING_APP_ID,
      account_id: this.account_id,
      access_token: this.token
    };
  }

  public async fetchPlayerData() {
    if (this.isTokenExpired()) {
      throw new Error('Token expired');
    }

    const response = await axios.get(`https://api.worldoftanks.${this.realm}/wows/account/info/`, {
      params: {
        ...this.getQueryParams()
      }
    });
  }

  public async getShipsInPort() {
    if (this.isTokenExpired()) {
      throw new Error('Token expired');
    }

    const response = await axios.get(
      `https://api.worldofwarships.${this.realm}/wows/account/info/`,
      {
        params: {
          ...this.getQueryParams(),
          fields: 'private.port',
          extra: 'private.port'
        }
      }
    );

    return response.data.data[this.account_id].private.port;
  }

  public async getPreviouslyOwnedShipIds(): Promise<number[]> {
    if (this.isTokenExpired()) {
      throw new Error('Token expired');
    }

    const response = await axios.get(
      `https://api.worldofwarships.${this.realm}/wows/ships/stats/`,
      {
        params: {
          ...this.getQueryParams(),
          fields: 'ship_id',
          extra: 'images'
        }
      }
    );

    return (response.data.data[this.account_id] || []).map((ship: any) => ship.ship_id);
  }
}

export const user: Writable<User> = writable();

export async function login({
  realm,
  token,
  account_id,
  username,
  expires_at
}: {
  realm: Realm;
  token: string;
  account_id: string;
  username: string;
  expires_at: number;
}) {
  user.set(new User(realm, token, expires_at, account_id, username));
  window.localStorage.setItem(
    'user',
    JSON.stringify({ realm, token, account_id, username, expires_at })
  );
}
