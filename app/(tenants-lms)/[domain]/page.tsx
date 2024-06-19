import SitesLayout from "./layout";
import { Image } from "@/app/components/Image";
import Link from "next/link";

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
  console.log(result);
  if (result.status === 200) {
    site = result.sites.find(
      (s) => s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === domain
    );
  }

  return (
    <SitesLayout params={site}>
      <div>
        {site ? (
          <div className="">
            <div className="navbar bg-base-100">
              <div className="navbar-start">
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost lg:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Parent</a>
                      <ul className="p-2">
                        <li>
                          <a>Submenu 1</a>
                        </li>
                        <li>
                          <a>Submenu 2</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a>Item 3</a>
                    </li>
                  </ul>
                </div>
                <Link
                  href={"/"}
                  className="btn btn-ghost text-xl hover:bg-transparent"
                >
                  <Image
                    src={site.logo}
                    width={100}
                    height={100}
                    alt="test"
                    sizes="100vw"
                  />
                </Link>
              </div>
              <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <details>
                      <summary>Parent</summary>
                      <ul className="p-2">
                        <li>
                          <a>Submenu 1</a>
                        </li>
                        <li>
                          <a>Submenu 2</a>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <a>Item 3</a>
                  </li>
                </ul>
              </div>
              <div className="navbar-end">
                <a className="btn">Button</a>
              </div>
            </div>
          </div>
        ) : (
          <p>Site not found</p>
        )}
      </div>
    </SitesLayout>
  );
}
