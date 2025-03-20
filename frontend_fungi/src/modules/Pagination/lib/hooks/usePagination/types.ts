export interface IUsePaginationProps<T> {
    data: T[];
    itemsPerPage: number;
}

export type ThandlePageChange = (change: 'plus' | 'minus') => void;

export type TUsePaginationReturn<T> = [number, ThandlePageChange, T[]];