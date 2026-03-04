import { toApiUrl } from '@shared/api';

const PROTOCOL_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SCHEME_RELATIVE_URL_PATTERN = /^\/\//;

export function normalizeAvatarUrl(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (PROTOCOL_URL_PATTERN.test(trimmed) || SCHEME_RELATIVE_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return toApiUrl(trimmed);
  }

  return toApiUrl(`/${trimmed}`);
}
