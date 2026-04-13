import React from "react";
import "./AppLayout.css";
import { Header } from "../Header";
import { Footer } from "../Footer";


type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-layout__body">
       
        <main className="app-layout__content">
          {children}
        </main>
        
      </div>

      <Footer />
    </div>
  );
}
