import SitesLayout from "./layout";
import { Image } from "@/app/components/Image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BsTwitterX } from "react-icons/bs";
import Alert from "@/app/components/Alert";
import EditorHeader from "@/app/components/editorjsToReact/EditorHeader";
import EditorParagraph from "@/app/components/editorjsToReact/EditorParagraph";
import EditorList from "@/app/components/editorjsToReact/EditorList";
import EditorTable from "@/app/components/editorjsToReact/EditorTable";
import EditorChecklist from "@/app/components/editorjsToReact/EditorChecklist";
import EditorAlert from "@/app/components/editorjsToReact/EditorAlert";
import EditorQuote from "@/app/components/editorjsToReact/EditorQuote";
import EditorImage from "@/app/components/editorjsToReact/EditorImage";
import EditorYoutube from "@/app/components/editorjsToReact/EditorYoutube";

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

async function pageContent(pageId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/content/page/${pageId}`
    );
    const result = await response.json();
    if (result.status === 200) {
      return result.contents.content;
    }
    return null;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return null;
  }
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

  const indexPageId = site.pages.find((page) => page.title === "Index")?.id;
  const pageContentData = indexPageId ? await pageContent(indexPageId) : null;
  const pageBlocks = pageContentData ? pageContentData.blocks : [];

  return (
    <SitesLayout params={site}>
      <div>
        {site ? (
          <div className="">
            <div className="bg-base-200">
              <div className="navbar mx-auto max-w-7xl p-6 lg:px-8">
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
                      src={
                        site.logo ? site.logo : "courseCovers/600x400_er61hk"
                      }
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
                          <li key={link.url}>
                            <a href={link.url}>{link.text}</a>
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
            </div>
            {/* page content */}
            <div className="mx-auto max-w-7xl p-6 lg:px-8">
              {pageBlocks.length > 0 ? (
                pageBlocks.map((block) => {
                  if (block.type === "header") {
                    return (
                      <EditorHeader
                        key={block.id}
                        text={block.data.text}
                        alignment={block.data.alignment}
                        level={block.data.level}
                      />
                    );
                  }
                  if (block.type === "paragraph") {
                    return (
                      <EditorParagraph
                        key={block.id}
                        text={block.data.text}
                        alignment={block.data.alignment}
                      />
                    );
                  }
                  if (block.type === "list") {
                    return (
                      <EditorList
                        key={block.id}
                        items={block.data.items}
                        style={block.data.style}
                      />
                    );
                  }
                  if (block.type === "delimiter") {
                    return <div className="ce-delimiter cdx-block"></div>;
                  }
                  if (block.type === "table") {
                    return (
                      <EditorTable
                        key={block.id}
                        withHeadings={block.data.withHeadings}
                        content={block.data.content}
                      />
                    );
                  }
                  if (block.type === "checklist") {
                    return (
                      <EditorChecklist
                        key={block.id}
                        items={block.data.items}
                      />
                    );
                  }
                  if (block.type === "alert") {
                    return (
                      <EditorAlert
                        key={block.id}
                        type={block.data.type}
                        align={block.data.align}
                        message={block.data.message}
                      />
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <EditorQuote
                        key={block.id}
                        text={block.data.text}
                        caption={block.data.caption}
                        alignment={block.data.alignment}
                      />
                    );
                  }
                  if (block.type === "image") {
                    return (
                      <EditorImage
                        key={block.id}
                        src={block.data.src}
                        caption={block.data.caption}
                      />
                    );
                  }
                  if (block.type === "youtube") {
                    return (
                      <EditorYoutube
                        key={block.id}
                        youtubeId={block.data.youtubeId}
                      />
                    );
                  }
                  if (block.type === "courses") {
                    const visibleCourses = block.data.courses.filter(
                      (course) => !course.hide
                    );

                    const sortedCourses = [...visibleCourses]
                      .sort((a, b) => {
                        if (block.data.sortBy === "name_asc")
                          return a.name.localeCompare(b.name);
                        if (block.data.sortBy === "name_desc")
                          return b.name.localeCompare(a.name);
                        if (block.data.sortBy === "level")
                          return (a.level || "").localeCompare(b.level || "");
                        if (block.data.sortBy === "start_date")
                          return (
                            new Date(a.startDate || 0) -
                            new Date(b.startDate || 0)
                          );
                        return 0;
                      })
                      .slice(0, block.data.limitCourses || 3);

                    return (
                      <div
                        key={block.id}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-3"
                      >
                        {sortedCourses.map((course) => (
                          <div
                            key={course.id}
                            className="card bg-base-100 shadow-xl"
                          >
                            <figure>
                              <Image
                                src={
                                  course.coverImage
                                    ? course.coverImage
                                    : "photo-1715967635831-f5a1f9658880_mhlqwu"
                                }
                                width={500}
                                height={250}
                                alt="Course cover"
                                sizes="100vw"
                              />
                            </figure>
                            <div className="card-body">
                              <div className="card-actions justify-start">
                                {course.topics.map((topic) => (
                                  <div
                                    key={topic.id}
                                    className="badge badge-outline"
                                  >
                                    {topic.name}
                                  </div>
                                ))}
                              </div>
                              <h2 className="card-title">
                                {course.name}
                                {course.featured && (
                                  <div className="badge badge-secondary">
                                    FEATURED
                                  </div>
                                )}
                              </h2>
                              <p>
                                {course.description
                                  ? course.description
                                  : "Click on enroll now to see the course"}
                              </p>
                              <div className="card-actions justify-end">
                                <button className="btn btn-primary">
                                  Enroll Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  if (block.type === "cta") {
                    return (
                      <div className="overflow-hidden py-12">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="flex flex-col justify-center">
                              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl !mt-3 !mb-0">
                                {block.data.title}
                              </h2>
                              <p className="mt-6 text-base leading-7">
                                {block.data.description}
                              </p>
                              <div className="mt-4 flex">
                                <a
                                  className="btn btn-outline btn-ghost"
                                  href={block.data.buttonUrl}
                                >
                                  {block.data.buttonText}
                                </a>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="mt-4 flex text-sm leading-6">
                                <Image
                                  src={block.data.image}
                                  width={500}
                                  height={500}
                                  alt="test"
                                  sizes="100vw"
                                  className="rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <div>No content available</div>
              )}
            </div>
            <div className="bg-base-200">
              <div className="mx-auto max-w-7xl">
                <footer className="footer p-10 text-base-content">
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
                <footer className="footer px-10 py-4 border-t text-base-content border-base-300">
                  <aside className="items-center grid-flow-col">
                    <Image
                      src={
                        site.logo ? site.logo : "courseCovers/600x400_er61hk"
                      }
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
          </div>
        ) : (
          <p>Site not found</p>
        )}
      </div>
    </SitesLayout>
  );
}
