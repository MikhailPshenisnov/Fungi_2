import React, { ReactNode } from "react";
import { Header } from "../../components/shared/layout/Header/header";
import { Footer } from "../../components/shared/layout/Footer/footer";
import "./index.css";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  );
};
