import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: {
    domain: string;
  };
}

const sites = [
  { name: "Site 1", subdomain: "site1", theme: "dark" },
  { name: "Site 2", subdomain: "site2", theme: "retro" },
  { name: "Site 3", subdomain: "site3", theme: "coffee" },
];

const SitesLayout = ({ children, params: { domain } }: Props) => {
  const siteData = sites.find((site) => site.subdomain === domain);
  return (
    <html lang="en" data-theme={siteData!.theme}>
      <body className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</body>
    </html>
  );
};

export default SitesLayout;
