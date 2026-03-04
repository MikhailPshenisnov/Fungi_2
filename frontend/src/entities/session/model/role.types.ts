export interface RoleDtoApi {
  id: string;
  name: string;
  accessLevel: number;
  permissions?: string[] | null;
}

export function normalizePermissionCodes(codes: string[] | null | undefined): string[] {
  if (!Array.isArray(codes)) {
    return [];
  }

  const normalized = codes
    .map((code) => (typeof code === 'string' ? code.trim().toLowerCase() : ''))
    .filter((code) => code.length > 0);

  return Array.from(new Set(normalized));
}
