import React, { ReactNode } from "react";
import "../../globals.css";

interface Props {
  children: ReactNode;
  params: {
    name: string;
    domainName: string;
    customDomain: string;
    themeName: string;
    frontendConfig: {};
  };
}

const SitesLayout = ({ children, params }: Props) => {
  return (
    <html data-theme={params.themeName}>
      <body className="mx-auto max-w-7xl p-6 lg:px-8">{children}</body>
    </html>
  );
};

export default SitesLayout;
