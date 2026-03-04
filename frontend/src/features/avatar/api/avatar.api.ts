import { requestJson, uploadMultipartWithProgress } from '@shared/api';
import type { RoleDtoApi } from '@entities/session';
import { normalizeAvatarUrl } from '@shared/lib/normalizeAvatarUrl';

export interface CurrentUserApi {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  role: RoleDtoApi;
}

export interface CurrentUserProfileResult {
  user: CurrentUserApi;
}

export interface UploadAvatarResult {
  avatarUrl?: string | null;
}

export interface RemoveAvatarResult {
  isDeleted: boolean;
  avatarUrl?: string | null;
}

export async function getCurrentUserProfile(token: string): Promise<CurrentUserProfileResult> {
  const result = await requestJson<CurrentUserProfileResult>('/Users/GetCurrentUserProfile', {
    method: 'GET',
    token
  });

  return {
    ...result,
    user: {
      ...result.user,
      avatarUrl: normalizeAvatarUrl(result.user.avatarUrl)
    }
  };
}

export async function uploadAvatar(
  file: File,
  token: string,
  onProgress?: (value: number) => void
): Promise<UploadAvatarResult> {
  const result = await uploadMultipartWithProgress<UploadAvatarResult>({
    path: '/Users/UploadMyAvatar',
    token,
    fileFieldName: 'avatar',
    file,
    onProgress
  });

  return {
    ...result,
    avatarUrl: normalizeAvatarUrl(result.avatarUrl)
  };
}

export async function removeAvatar(token: string): Promise<RemoveAvatarResult> {
  const result = await requestJson<RemoveAvatarResult>('/Users/DeleteMyAvatar', {
    method: 'DELETE',
    token
  });

  return {
    ...result,
    avatarUrl: normalizeAvatarUrl(result.avatarUrl)
  };
}
