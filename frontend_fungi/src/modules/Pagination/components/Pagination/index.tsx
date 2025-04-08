import React from 'react';
import './index.css';
import { usePagination } from '@modules/Pagination/lib/hooks/usePagination/usePagination.ts';
import { ArrowSvg } from '@shared/ui';

interface IPaginationProps<T> {
    data: T[] | undefined;
    card: (item: T) => React.JSX.Element;
    tittle: string;
    itemsPerPage: number;
}

export const Pagination = <T,>({
    data,
    card,
    tittle,
    itemsPerPage,
}: IPaginationProps<T>): React.JSX.Element => {
    const [page, handlePageChange, paginatedItems] = usePagination<T>({
        data,
        itemsPerPage,
    });

    return (
        <section className="pagination__container">
            <h2 className="pagination__title">{tittle}</h2>
            <div className="pagination__cards-row">
                {paginatedItems.map(card)}
            </div>
            <div className="buttons__container">
                <button
                    className="arrow_button"
                    onClick={() => handlePageChange('minus')}
                >
                    <ArrowSvg arrowDirection={'left'} />
                </button>
                <p className="pagination__counter">{page}</p>
                <button
                    className="arrow_button"
                    onClick={() => {
                        handlePageChange('plus');
                    }}
                >
                    <ArrowSvg arrowDirection={'right'} />
                </button>
            </div>
        </section>
    );
};
