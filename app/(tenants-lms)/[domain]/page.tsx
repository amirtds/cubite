import SitesLayout from "./layout";
import { Image } from "@/app/components/Image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BsTwitterX } from "react-icons/bs";

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
  let footerColumns = [];
  let facebook, instagram, tiktok, youtube, x;
  if (result.status === 200) {
    site = result.sites.find(
      (s) => s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === domain
    );
  }

  const headerLinks = site.layout.header.headerLinks;

  if (site.layout.footer) {
    ({ x, tiktok, youtube, facebook, instagram } =
      site.layout.footer.socialMedia);
    // Calculate the number of columns and distribute footer links across columns
    const footerLinks = site.layout.footer.footerLinks;
    const columns = Math.ceil(footerLinks.length / 3);
    footerColumns = Array.from({ length: columns }, (_, index) =>
      footerLinks.slice(index * 3, index * 3 + 3)
    );
  }

  return (
    <SitesLayout params={site}>
      <div>
        {site ? (
          <div className="">
            <div className="navbar bg-base-100 mx-auto max-w-7xl p-6 lg:px-8">
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
                    src={site.logo ? site.logo : "courseCovers/600x400_er61hk"}
                    width={100}
                    height={100}
                    alt="test"
                    sizes="100vw"
                  />
                </Link>
              </div>
              <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                  {headerLinks.map(
                    (link) =>
                      (link.type === "internal" ||
                        link.type === "external") && (
                        <li>
                          <a key={link.url} href={link.url}>
                            {link.text}
                          </a>
                        </li>
                      )
                  )}
                </ul>
              </div>
              <div className="navbar-end">
                {headerLinks.map(
                  (link) =>
                    link.type === "neutral-button" && (
                      <a
                        key={link.url}
                        className="btn btn-ghost btn-outline mx-2"
                        href={link.url}
                      >
                        {link.text}
                      </a>
                    )
                )}
                {headerLinks.map(
                  (link) =>
                    link.type === "primary-button" && (
                      <a
                        key={link.url}
                        className="btn btn-primary mx-2"
                        href={link.url}
                      >
                        {link.text}
                      </a>
                    )
                )}
              </div>
            </div>
            <div className="">
              <footer className="footer p-10 bg-base-200 text-base-content">
                <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {footerColumns.map((column, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      {column.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          className="link link-hover"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  ))}
                </nav>
                <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                  <form>
                    <fieldset className="form-control w-80">
                      <label className="label">
                        <span className="label-text">
                          Enter your email address
                        </span>
                      </label>
                      <div className="join">
                        <input
                          type="text"
                          placeholder="username@site.com"
                          className="input input-bordered join-item"
                        />
                        <button className="btn btn-primary join-item">
                          Subscribe
                        </button>
                      </div>
                    </fieldset>
                  </form>
                </nav>
              </footer>
              <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
                <aside className="items-center grid-flow-col">
                  <Image
                    src={site.logo ? site.logo : "courseCovers/600x400_er61hk"}
                    width={50}
                    height={50}
                    alt="test"
                    sizes="100vw"
                  />
                  <p className="mx-2">
                    {site.layout.footer.copyrightText &&
                      site.layout.footer.copyrightText}
                  </p>
                </aside>
                <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                  {facebook && (
                    <a href={facebook}>
                      <FaFacebookF className="w-6 h-6" />
                    </a>
                  )}
                  {instagram && (
                    <a href={instagram}>
                      <BsInstagram className="w-6 h-6" />
                    </a>
                  )}
                  {tiktok && (
                    <a href={tiktok}>
                      <FaTiktok className="w-6 h-6" />
                    </a>
                  )}
                  {youtube && (
                    <a href={youtube}>
                      <IoLogoYoutube className="w-8 h-8" />
                    </a>
                  )}
                  {x && (
                    <a href={x}>
                      <BsTwitterX className="w-6 h-6" />
                    </a>
                  )}
                </nav>
              </footer>
            </div>
          </div>
        ) : (
          <p>Site not found</p>
        )}
      </div>
    </SitesLayout>
  );
}
