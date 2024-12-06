import React, { ReactNode } from "react";
import { Header } from "../Header/header";
import { Footer } from "../Footer/footer";
import "./Layout.css";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="layout__main">
                {children}
            </main>
            <Footer />
        </div>
    );
};
