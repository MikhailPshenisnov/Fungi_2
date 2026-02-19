import React, { ReactNode, useEffect } from 'react';

import { Footer } from '@modules/footer.tsx';
import './index.css';
import { Header } from '@modules/Header/header/header.tsx';
import { useAppDispatch } from '../../redux/Hooks.tsx';
import { fetchCurrentUser } from '../../redux/UserSlice.tsx';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <div className="layout">
            <Header />
            <main className="layout__main">{children}</main>
            <Footer />
        </div>
    );
};
