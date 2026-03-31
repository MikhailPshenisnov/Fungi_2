export interface MushroomDoppelganger {
  id: string;
  mushroomId: string;
  doppelgangerName: string;
  isContainedInDatabase: boolean;
}

export type MushroomRevisionStatus = 'Draft' | 'InReview' | 'Published' | 'Rejected' | 'Archived';

export type MushroomModerationDecision = 'Approve' | 'Reject';

export interface Mushroom {
  id: string;
  name: string;
  synonymousName: string | null;
  latinName: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom: number | null;
  stemSizeTo: number | null;
  stemType: string | null;
  stemColor: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string;
  extraPhotoLinks: string[];
  doppelgangers: MushroomDoppelganger[];
}

export interface MushroomRevision {
  revisionId: string;
  sourceMushroomId: string | null;
  name: string;
  synonymousName: string | null;
  latinName: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom: number | null;
  stemSizeTo: number | null;
  stemType: string | null;
  stemColor: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string | null;
  extraPhotoLinks: string[];
  doppelgangerNames: string[];
  status: MushroomRevisionStatus;
  createdByUserId: string;
  updatedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  reviewNote: string | null;
  archivedAt: string | null;
  likesCount: number;
}

export interface MushroomEditorPayload {
  name: string;
  synonymousName: string | null;
  latinName: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom: number | null;
  stemSizeTo: number | null;
  stemType: string | null;
  stemColor: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string | null;
  extraPhotoLinks: string[];
  doppelgangers: string[];
}

export interface MushroomLikeState {
  mushroomId: string;
  likesCount: number;
  isLiked: boolean;
}
