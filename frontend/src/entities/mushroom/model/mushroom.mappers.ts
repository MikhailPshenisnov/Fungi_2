import type { Mushroom, MushroomDoppelganger } from './mushroom.types';

interface MushroomDoppelgangerApi {
  id: string;
  mushroomId: string;
  doppelgangerName: string;
  isContainedInDatabase: boolean;
}

interface MushroomApi {
  id: string;
  name: string;
  synonymousName?: string | null;
  latinName?: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom?: number | null;
  stemSizeTo?: number | null;
  stemType?: string | null;
  stemColor?: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string;
  extraPhotoLinks?: string[] | null;
  doppelgangers?: MushroomDoppelgangerApi[] | null;
}

function mapDoppelganger(apiValue: MushroomDoppelgangerApi): MushroomDoppelganger {
  return {
    id: apiValue.id,
    mushroomId: apiValue.mushroomId,
    doppelgangerName: apiValue.doppelgangerName,
    isContainedInDatabase: Boolean(apiValue.isContainedInDatabase)
  };
}

export function mapMushroom(apiValue: MushroomApi): Mushroom {
  return {
    id: apiValue.id,
    name: apiValue.name,
    synonymousName: apiValue.synonymousName ?? null,
    latinName: apiValue.latinName ?? null,
    family: apiValue.family,
    redBook: Boolean(apiValue.redBook),
    eatable: apiValue.eatable,
    hasStem: Boolean(apiValue.hasStem),
    stemSizeFrom: apiValue.stemSizeFrom ?? null,
    stemSizeTo: apiValue.stemSizeTo ?? null,
    stemType: apiValue.stemType ?? null,
    stemColor: apiValue.stemColor ?? null,
    capType: apiValue.capType,
    capColor: apiValue.capColor,
    capUndersideType: apiValue.capUndersideType,
    description: apiValue.description,
    headerPhotoLink: apiValue.headerPhotoLink,
    extraPhotoLinks: Array.isArray(apiValue.extraPhotoLinks) ? apiValue.extraPhotoLinks.filter(Boolean) : [],
    doppelgangers: Array.isArray(apiValue.doppelgangers) ? apiValue.doppelgangers.map(mapDoppelganger) : []
  };
}

export function mapMushrooms(apiValues: MushroomApi[]): Mushroom[] {
  return apiValues.map(mapMushroom);
}

