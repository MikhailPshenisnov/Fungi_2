export interface MushroomDoppelganger {
  id: string;
  mushroomId: string;
  doppelgangerName: string;
  isContainedInDatabase: boolean;
}

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

export interface MushroomLikeState {
  mushroomId: string;
  likesCount: number;
  isLiked: boolean;
}

