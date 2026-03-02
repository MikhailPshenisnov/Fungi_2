export const APP_NAME = 'Fungi';
export const DEFAULT_DESCRIPTION = 'Fungi — безопасный справочник по грибам, статьи и рекомендации.';
export const DEFAULT_FAVICON = '/images/branding/fungi-logo.svg';

export interface DocumentHeadPayload {
  title?: string;
  description?: string;
  iconHref?: string;
}

export function buildDocumentTitle(pageTitle?: string) {
  if (!pageTitle || pageTitle.trim().length === 0) {
    return APP_NAME;
  }

  if (pageTitle.includes('|')) {
    return pageTitle;
  }

  return `${pageTitle} | ${APP_NAME}`;
}

function upsertMetaDescription(content: string) {
  const selector = 'meta[name="description"]';
  let meta = document.head.querySelector<HTMLMetaElement>(selector);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

function upsertFavicon(href: string) {
  const selector = 'link[rel="icon"]';
  let link = document.head.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
  if (href.endsWith('.svg')) {
    link.setAttribute('type', 'image/svg+xml');
  }
}

export function applyDocumentHead(payload: DocumentHeadPayload) {
  document.title = buildDocumentTitle(payload.title);
  upsertMetaDescription(payload.description ?? DEFAULT_DESCRIPTION);
  upsertFavicon(payload.iconHref ?? DEFAULT_FAVICON);
}
