import React from "react";
import type { ReactNode } from "react";
import SwrInitor from "@/app/components/swr-initor";
import Header from "@/app/components/header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SwrInitor>
        <Header />
        {children}
      </SwrInitor>
    </>
  );
};

export const metadata = {
  title: "Sheng",
};

export default Layout;
