import { Image } from "@/app/components/Image";
import EditorHeader from "@/app/components/editorjsToReact/EditorHeader";
import EditorParagraph from "@/app/components/editorjsToReact/EditorParagraph";
import EditorList from "@/app/components/editorjsToReact/EditorList";
import EditorTable from "@/app/components/editorjsToReact/EditorTable";
import EditorChecklist from "@/app/components/editorjsToReact/EditorChecklist";
import EditorAlert from "@/app/components/editorjsToReact/EditorAlert";
import EditorQuote from "@/app/components/editorjsToReact/EditorQuote";
import EditorImage from "@/app/components/editorjsToReact/EditorImage";
import EditorYoutube from "@/app/components/editorjsToReact/EditorYoutube";
import CourseCard from "@/app/components/CourseCard";
import Link from "next/link";

interface Props {
  params: {
    domain: string;
  };
}

async function pageContent(pageId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/content/page/${pageId}`,
      { cache: "no-store", next: { revalidate: 0 } }
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

async function getSites() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
    { cache: "no-store" }
  );
  const result = await response.json();
  return result;
}

export default async function Home({ params }: Props) {
  const result = await getSites();
  let site;
  if (result.status === 200) {
    site = result.sites.find(
      (s) =>
        s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === params.domain
    );
  }
  const indexPageId = site?.pages.find((page) => page.title === "Index")?.id;
  const pageContentData = indexPageId ? await pageContent(indexPageId) : null;
  const pageBlocks = pageContentData ? pageContentData.blocks : [];

  return (
    <div className="">
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
              return <div className="ce-delimiter cdx-block" key={block.id}></div>;
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
                <EditorChecklist key={block.id} items={block.data.items} />
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
                      new Date(a.startDate || 0) - new Date(b.startDate || 0)
                    );
                  return 0;
                })
                .slice(0, block.data.limitCourses || 3);

              return (
                <div className="" key={block.id}>
                  <Link
                    href={"/courses"}
                    className="text-right my-4 font-semibold text-lg block hover:text-primary"
                  >
                    View All
                  </Link>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-3"
                  >
                    {sortedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} site={site} />
                    ))}
                  </div>
                </div>
              );
            }
            if (block.type === "cta") {
              return (
                <div className="overflow-hidden py-12" key={block.id}>
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
            return null;
          })
        ) : (
          <div>Welcome to {site.name}</div>
        )}
      </div>
    </div>
  );
}
