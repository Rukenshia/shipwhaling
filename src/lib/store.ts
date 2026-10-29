import axios from 'axios';
import { writable, type Writable } from 'svelte/store';
import { isRecord, readAccountData, sessionExpiredError, WargamingApiError } from './wargamingApi';

export enum Realm {
  EU = 'eu',
  NA = 'com',
  ASIA = 'asia'
}

export class User {
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
    return !Number.isFinite(this.expires_at) || Date.now() >= this.expires_at * 1000;
  }

  private getQueryParams() {
    return {
      application_id: import.meta.env.VITE_WARGAMING_APP_ID,
      account_id: this.account_id,
      access_token: this.token
    };
  }

  private async requestAccountData(path: string, params: Record<string, string | number> = {}) {
    if (this.isTokenExpired()) {
      throw sessionExpiredError();
    }
    let payload: unknown;
    try {
      const response = await axios.get(`https://api.worldofwarships.${this.realm}/wows/${path}/`, {
        params: { ...this.getQueryParams(), ...params },
        timeout: 15000
      });
      payload = response.data;
    } catch {
      // Axios errors include request URLs and tokens: do not log or expose them.
      throw new WargamingApiError(
        'Could not reach Wargaming. Please check your connection and try again.'
      );
    }
    return readAccountData(payload, this.account_id);
  }

  public async fetchPlayerData() {
    return this.requestAccountData('account/info');
  }

  public async getShipsInPort(): Promise<number[]> {
    const account = await this.requestAccountData('account/info', {
      fields: 'private.port',
      extra: 'private.port'
    });
    const port = isRecord(account) && isRecord(account.private) ? account.private.port : undefined;
    if (!Array.isArray(port) || !port.every((id) => Number.isInteger(id) && id > 0)) {
      throw new WargamingApiError(
        'Your port data is unavailable. Please try again, or sign in again if the problem continues.'
      );
    }
    return port;
  }

  public async getBattleLifeTime(): Promise<number> {
    const account = await this.requestAccountData('account/info', {
      fields: 'private.battle_life_time'
    });
    const lifetime =
      isRecord(account) && isRecord(account.private) ? account.private.battle_life_time : undefined;
    if (typeof lifetime !== 'number' || !Number.isFinite(lifetime) || lifetime < 0) {
      throw new WargamingApiError('Your battle lifetime is unavailable. Please try again.');
    }
    return lifetime;
  }

  public async getPreviouslyOwnedShipIds(): Promise<number[]> {
    const ships = await this.requestAccountData('ships/stats', { in_garage: 0, fields: 'ship_id' });
    if (
      !Array.isArray(ships) ||
      !ships.every(
        (ship) => isRecord(ship) && Number.isInteger(ship.ship_id) && Number(ship.ship_id) > 0
      )
    ) {
      throw new WargamingApiError('Your previously owned ships are unavailable. Please try again.');
    }
    return ships.map((ship) => ship.ship_id as number);
  }
}

export const user: Writable<User> = writable();

export function login({
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

// Reject malformed or expired saved sessions before notifying any data subscribers.
export function restoreLogin(): User | undefined {
  const stored = window.localStorage.getItem('user');
  if (!stored) return;
  let saved: unknown;
  try {
    saved = JSON.parse(stored);
  } catch {
    window.localStorage.removeItem('user');
    return;
  }
  if (
    !isRecord(saved) ||
    !Object.values(Realm).includes(saved.realm as Realm) ||
    typeof saved.token !== 'string' ||
    !saved.token ||
    typeof saved.account_id !== 'string' ||
    !/^\d+$/.test(saved.account_id) ||
    typeof saved.username !== 'string' ||
    typeof saved.expires_at !== 'number' ||
    !Number.isFinite(saved.expires_at) ||
    saved.expires_at * 1000 <= Date.now()
  ) {
    window.localStorage.removeItem('user');
    return;
  }
  const restored = new User(
    saved.realm as Realm,
    saved.token,
    saved.expires_at,
    saved.account_id,
    saved.username
  );
  user.set(restored);
  return restored;
}
