interface Props {
  params: {
    domain: string;
  };
}

const sites = [
  { name: "Site 1", subdomain: "site1", theme: "dark" },
  { name: "Site 2", subdomain: "site2", theme: "retro" },
  { name: "Site 3", subdomain: "site3", theme: "coffee" },
];

export default function Home({ params: { domain } }: Props) {
  const siteData = sites.find((site) => site.subdomain === domain);
  if (siteData) {
    return (
      <div>
        <h1>Welcome to the {siteData.name}</h1>
        <button className="btn btn-neutral">Neutral</button>
      </div>
    );
  }
  return <h1> No site found </h1>;
}
