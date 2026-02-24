import { useEffect } from 'react';
import { applyDocumentHead, DocumentHeadPayload } from './utils';

export function useDocumentHead(payload: DocumentHeadPayload) {
  const { title, description, iconHref } = payload;

  useEffect(() => {
    applyDocumentHead({ title, description, iconHref });
  }, [description, iconHref, title]);
}
