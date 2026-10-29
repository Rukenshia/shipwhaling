export class WargamingApiError extends Error {
  constructor(
    message: string,
    public readonly requiresLogin = false
  ) {
    super(message);
    this.name = 'WargamingApiError';
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sessionExpiredError(): WargamingApiError {
  return new WargamingApiError(
    'Your Wargaming session has expired or is no longer valid. Please sign in again.',
    true
  );
}

export function readAccountData(payload: unknown, accountId: string): unknown {
  if (!isRecord(payload)) {
    throw new WargamingApiError('Wargaming returned an incomplete response. Please try again.');
  }
  if (payload.status === 'error') {
    const message = isRecord(payload.error) ? payload.error.message : undefined;
    if (
      message === 'INVALID_ACCESS_TOKEN' ||
      message === 'ACCESS_TOKEN_EXPIRED' ||
      message === 'TOKEN_EXPIRED'
    ) {
      throw sessionExpiredError();
    }
    if (message === 'REQUEST_LIMIT_EXCEEDED') {
      throw new WargamingApiError(
        'Wargaming is receiving too many requests. Please wait a moment and try again.'
      );
    }
    throw new WargamingApiError(
      'Wargaming could not load your account data. Please try again in a moment.'
    );
  }
  if (payload.status !== 'ok' || !isRecord(payload.data) || payload.data[accountId] == null) {
    throw new WargamingApiError('Wargaming did not return your account data. Please try again.');
  }
  return payload.data[accountId];
}
