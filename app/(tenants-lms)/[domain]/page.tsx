import SitesLayout from "./layout";

interface Props {
  params: {
    domain: string;
  };
}

async function getSites() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
    { cache: "no-store" }
  );
  const result = await response.json();
  return result;
}

export default async function Home({ params: { domain } }: Props) {
  const result = await getSites();
  let site;

  if (result.status === 200) {
    site = result.sites.find(
      (s) => s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === domain
    );
  }

  return (
    <SitesLayout params={site}>
      <div>
        {site ? (
          <>
            <h1>{site.name}</h1>
          </>
        ) : (
          <p>Site not found</p>
        )}
      </div>
    </SitesLayout>
  );
}
