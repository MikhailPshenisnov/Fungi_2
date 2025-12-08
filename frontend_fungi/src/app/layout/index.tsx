import React, { ReactNode, useEffect } from 'react';

import { Footer } from '@modules/footer.tsx';
import './index.css';
import { Header } from '@modules/Header/header/header.tsx';
import { useAppDispatch, useAppSelector } from '../../redux/Hooks.tsx';
import { GetCurrentUser } from '../../api/AppApi.ts';
import {
    setAccessLvl,
    setEmail,
    setIsLoggedIn,
    setToken,
    setUserId,
} from '../../redux/UserSlice.tsx';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await GetCurrentUser();
            console.log(res.data.data);
            if (res.data.data.email) {
                dispatch(setIsLoggedIn(true));
            } else {
                dispatch(setIsLoggedIn(false));
            }

            dispatch(setEmail(res.data.data.email || ""));
            dispatch(setAccessLvl(res.data.data.asseccLvl ?? -1));
            dispatch(setToken(res.data.data.token || ""));
            dispatch(setUserId(res.data.data.userId || ""));
        }

        fetchUser();
    }, [dispatch, user.update]);

    return (
        <div className="layout">
            <Header />
            <main className="layout__main">{children}</main>
            <Footer />
        </div>
    );
};
