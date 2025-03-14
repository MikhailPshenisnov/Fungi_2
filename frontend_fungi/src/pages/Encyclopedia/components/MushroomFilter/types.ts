export interface IMushroom {
    id: number;
    name: string;
    synonymousName: string;
    latinName: string | null;
    family: string;
    redBook: boolean;
    eatable: 'Да' | 'Полусъедобен' | 'Нет';
    hasStem: boolean;
    stemSizeFrom: number | null;
    stemSizeTo: number | null;
    stemType: string | null;
    stemColor: string | null;
    capType: 'Выпуклая' | 'Плоская' | 'Вдавленная';
    capColor: string;
    capUndersideType: string;
    description: string;
    headerPhotoLink: string;
    doppelgangers: IDoppelganger[];
    [key: string]: unknown;
}

export interface IDoppelganger {
    name: string;
}

export interface FilterState {
    edibility: string[];
    capType: string[];
    [key: string]: string[];
}

export interface MushroomFilterProps {
    mushrooms: IMushroom[];
    filters: FilterState;
    searchQuery: string;
}
