import React from "react";

interface Props {
  params: {
    domainName: string;
  };
}

const SitePage = ({ params: { domainName } }: Props) => {
  return <h1>Welcome to {domainName}</h1>;
};

export default SitePage;
