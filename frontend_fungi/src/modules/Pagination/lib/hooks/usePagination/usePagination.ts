import { useState } from 'react';
import {
    IUsePaginationProps,
    ThandlePageChange,
    TUsePaginationReturn,
} from './types';

export const usePagination = <T>({
    data,
    itemsPerPage,
}: IUsePaginationProps<T>): TUsePaginationReturn<T> => {
    const [page, setPage] = useState<number>(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const maxPage = Math.ceil(data.length / itemsPerPage);

    const handlePageChange: ThandlePageChange = (change) => {
        setPage((prev) => {
            if (change === 'minus') return prev > 1 ? prev - 1 : prev;
            return prev < maxPage ? prev + 1 : prev;
        });
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const paginatedItems: T[] = data.slice(
        itemsPerPage * (page - 1),
        itemsPerPage * page
    );

    return [page, handlePageChange, paginatedItems];
};
