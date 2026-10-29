import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createServer } from 'vite';
import axios from 'axios';

let server, User, Realm, restoreLogin, errors;
const accountId = '503857807';
let responsePayload, calls, stored;
const originalAdapter = axios.defaults.adapter;
const originalWindow = globalThis.window;

before(async () => {
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] }
  });
  ({ User, Realm, restoreLogin } = await server.ssrLoadModule('/src/lib/store.ts'));
  errors = await server.ssrLoadModule('/src/lib/wargamingApi.ts');
  globalThis.window = {
    localStorage: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
      removeItem: (key) => stored.delete(key)
    }
  };
  axios.defaults.adapter = async (config) => {
    calls++;
    if (responsePayload instanceof Error) throw responsePayload;
    return { data: responsePayload, status: 200, statusText: 'OK', headers: {}, config };
  };
});
beforeEach(() => {
  calls = 0;
  stored = new Map();
  responsePayload = undefined;
});
after(async () => {
  axios.defaults.adapter = originalAdapter;
  globalThis.window = originalWindow;
  await server?.close();
});
const user = () =>
  new User(Realm.EU, 'test-token', Math.floor(Date.now() / 1000) + 3600, accountId, 'Test');
const ok = (data) => ({ status: 'ok', data: { [accountId]: data } });

test('HTTP 200 API errors never become undefined account-ID crashes', async () => {
  for (const method of ['getShipsInPort', 'getPreviouslyOwnedShipIds', 'getBattleLifeTime']) {
    responsePayload = { status: 'error', error: { code: 407, message: 'INVALID_ACCESS_TOKEN' } };
    await assert.rejects(
      user()[method](),
      (e) =>
        e instanceof errors.WargamingApiError && e.requiresLogin && !e.message.includes(accountId)
    );
  }
});
test('local expiry prevents any API requests', async () => {
  const expired = new User(Realm.EU, 'test-token', 1, accountId, 'Test');
  await assert.rejects(expired.getShipsInPort(), (e) => e.requiresLogin);
  assert.equal(calls, 0);
});
test('rate limits and network failures do not tell users to log in again', async () => {
  responsePayload = { status: 'error', error: { message: 'REQUEST_LIMIT_EXCEEDED' } };
  await assert.rejects(
    user().getShipsInPort(),
    (e) => !e.requiresLogin && /too many requests/.test(e.message)
  );
  responsePayload = new Error('Network failed; access_token=secret');
  await assert.rejects(
    user().getShipsInPort(),
    (e) => !e.requiresLogin && !e.message.includes('secret') && /connection/.test(e.message)
  );
});
test('missing account data never silently becomes an empty fleet', async () => {
  for (const payload of [
    undefined,
    {},
    { status: 'ok' },
    { status: 'ok', data: {} },
    ok(null),
    ok({ private: null })
  ]) {
    responsePayload = payload;
    await assert.rejects(user().getShipsInPort(), errors.WargamingApiError);
    await assert.rejects(user().getPreviouslyOwnedShipIds(), errors.WargamingApiError);
  }
});
test('valid empty fleets and zero playtime are allowed', async () => {
  responsePayload = ok({ private: { port: [], battle_life_time: 0 } });
  assert.deepEqual(await user().getShipsInPort(), []);
  assert.equal(await user().getBattleLifeTime(), 0);
  responsePayload = ok([]);
  assert.deepEqual(await user().getPreviouslyOwnedShipIds(), []);
});
test('valid ships and playtime pass through unchanged', async () => {
  responsePayload = ok({ private: { port: [123, 456], battle_life_time: 900 } });
  assert.deepEqual(await user().getShipsInPort(), [123, 456]);
  assert.equal(await user().getBattleLifeTime(), 900);
  responsePayload = ok([{ ship_id: 123 }, { ship_id: 456 }]);
  assert.deepEqual(await user().getPreviouslyOwnedShipIds(), [123, 456]);
});
test('malformed ship lists are rejected rather than producing wrong totals', async () => {
  responsePayload = ok({ private: { port: [123, '456'] } });
  await assert.rejects(user().getShipsInPort(), errors.WargamingApiError);
  responsePayload = ok([{ ship_id: 123 }, {}]);
  await assert.rejects(user().getPreviouslyOwnedShipIds(), errors.WargamingApiError);
});
test('expired and corrupted saved sessions are cleared and never restored', () => {
  const valid = {
    realm: 'eu',
    token: 'test-token',
    account_id: accountId,
    username: 'Test',
    expires_at: Math.floor(Date.now() / 1000) + 3600
  };
  for (const saved of [
    '{bad',
    JSON.stringify({ ...valid, expires_at: 1 }),
    JSON.stringify({ ...valid, expires_at: 'invalid' }),
    JSON.stringify({ ...valid, realm: 'invalid' }),
    JSON.stringify(null)
  ]) {
    stored.set('user', saved);
    assert.equal(restoreLogin(), undefined);
    assert.equal(stored.has('user'), false);
  }
  stored.set('user', JSON.stringify(valid));
  assert.equal(restoreLogin().account_id, accountId);
  assert.equal(stored.has('user'), true);
});
