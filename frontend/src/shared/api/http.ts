interface ApiExceptionDto {
  errorGroup?: string;
  ErrorGroup?: string;
  errorMessage?: string;
  ErrorMessage?: string;
}

interface ApiEnvelope<T> {
  data?: T | null;
  Data?: T | null;
  errorMessage?: ApiExceptionDto | string | null;
  ErrorMessage?: ApiExceptionDto | string | null;
  message?: string;
  Message?: string;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly group?: string;

  constructor(message: string, status?: number, group?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.group = group;
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

export function toApiUrl(path: string): string {
  if (!apiBaseUrl) {
    return path;
  }

  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseExceptionPayload(value: unknown): { message: string | null; group: string | null } {
  if (typeof value === 'string') {
    return { message: value, group: null };
  }

  if (!isObjectRecord(value)) {
    return { message: null, group: null };
  }

  const exception = value as ApiExceptionDto;
  const message =
    typeof exception.errorMessage === 'string'
      ? exception.errorMessage
      : typeof exception.ErrorMessage === 'string'
        ? exception.ErrorMessage
        : null;

  const group =
    typeof exception.errorGroup === 'string'
      ? exception.errorGroup
      : typeof exception.ErrorGroup === 'string'
        ? exception.ErrorGroup
        : null;

  return { message, group };
}

export function parseApiError(payload: unknown): { message: string | null; group: string | null } {
  if (!isObjectRecord(payload)) {
    return { message: null, group: null };
  }

  const envelope = payload as ApiEnvelope<unknown>;

  const directError = parseExceptionPayload(envelope.errorMessage);
  if (directError.message) {
    return directError;
  }

  const directPascalError = parseExceptionPayload(envelope.ErrorMessage);
  if (directPascalError.message) {
    return directPascalError;
  }

  if (typeof envelope.message === 'string') {
    return { message: envelope.message, group: null };
  }

  if (typeof envelope.Message === 'string') {
    return { message: envelope.Message, group: null };
  }

  return { message: null, group: null };
}

function getEnvelopeData<T>(payload: unknown): T | null {
  if (!isObjectRecord(payload)) {
    return null;
  }

  const envelope = payload as ApiEnvelope<T>;
  if ('data' in envelope) {
    return envelope.data ?? null;
  }

  if ('Data' in envelope) {
    return envelope.Data ?? null;
  }

  return null;
}

function toApiError(payload: unknown, status?: number): ApiError {
  const parsed = parseApiError(payload);
  return new ApiError(parsed.message ?? 'Не удалось выполнить запрос.', status, parsed.group ?? undefined);
}

async function readJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export interface RequestJsonOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  token?: string | null;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export async function requestJson<T>(path: string, options: RequestJsonOptions = {}): Promise<T> {
  const { method = 'GET', token = null, headers = {}, body, signal } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const hasBody = body !== undefined;
  if (hasBody && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(toApiUrl(path), {
    method,
    headers: requestHeaders,
    body: hasBody ? JSON.stringify(body) : undefined,
    signal
  });

  const payload = await readJsonSafe(response);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  const data = getEnvelopeData<T>(payload);
  if (data === null) {
    throw toApiError(payload, response.status);
  }

  return data;
}

export interface UploadMultipartOptions {
  path: string;
  token: string;
  fileFieldName: string;
  file: File;
  onProgress?: (value: number) => void;
}

export function uploadMultipartWithProgress<T>({
  path,
  token,
  fileFieldName,
  file,
  onProgress
}: UploadMultipartOptions): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', toApiUrl(path));
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }

      const progress = Math.min(100, Math.round((event.loaded / event.total) * 100));
      onProgress(progress);
    };

    xhr.onerror = () => {
      reject(new ApiError('Не удалось выполнить загрузку. Проверьте подключение к сети.'));
    };

    xhr.onload = () => {
      let payload: unknown = null;
      if (xhr.responseText) {
        try {
          payload = JSON.parse(xhr.responseText) as unknown;
        } catch {
          payload = null;
        }
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(toApiError(payload, xhr.status));
        return;
      }

      const data = getEnvelopeData<T>(payload);
      if (data === null) {
        reject(toApiError(payload, xhr.status));
        return;
      }

      resolve(data);
    };

    const formData = new FormData();
    formData.append(fileFieldName, file);
    xhr.send(formData);
  });
}
