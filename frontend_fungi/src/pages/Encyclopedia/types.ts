export type TMushroomCard = {
    id: number;
    name: string;
    synonymousName: string;
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
    doppelgangers: TDoppelganger[];
};

export type TDoppelganger = {
    name: string;
};
