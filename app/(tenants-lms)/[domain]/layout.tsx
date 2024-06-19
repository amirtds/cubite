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
      <body className="">{children}</body>
    </html>
  );
};

export default SitesLayout;
