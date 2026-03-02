import { useMatches } from 'react-router-dom';
import { useDocumentHead } from '@shared/lib/document-head';

interface RouteHeadHandle {
  title?: string;
  description?: string;
  iconHref?: string;
}

function isRouteHeadHandle(value: unknown): value is RouteHeadHandle {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.title === 'string' ||
    typeof candidate.description === 'string' ||
    typeof candidate.iconHref === 'string'
  );
}

export function RouteHead() {
  const matches = useMatches();
  const activeHead = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(isRouteHeadHandle);

  useDocumentHead({
    title: activeHead?.title,
    description: activeHead?.description,
    iconHref: activeHead?.iconHref
  });

  return null;
}
