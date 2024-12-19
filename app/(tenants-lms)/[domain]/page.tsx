import EditorHeader from "@/app/components/editorjsToReact/EditorHeader";
import EditorParagraph from "@/app/components/editorjsToReact/EditorParagraph";
import EditorList from "@/app/components/editorjsToReact/EditorList";
import EditorTable from "@/app/components/editorjsToReact/EditorTable";
import EditorChecklist from "@/app/components/editorjsToReact/EditorChecklist";
import EditorAlert from "@/app/components/editorjsToReact/EditorAlert";
import EditorQuote from "@/app/components/editorjsToReact/EditorQuote";
import EditorImage from "@/app/components/editorjsToReact/EditorImage";
import EditorHero from "@/app/components/editorjsToReact/EditorHero";
import EditorCTANoImage from "@/app/components/editorjsToReact/EditorCTANoImage";
import EditorYoutube from "@/app/components/editorjsToReact/EditorYoutube";
import CourseCard from "@/app/components/CourseCard";
import Link from "next/link";
import CtaRender from "@/app/components/CtaRender";

interface Props {
  params: {
    domain: string;
  };
}

async function pageContent(pageId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/content/page/${pageId}`,
      { cache: "no-store" }
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
      <div className="mx-auto">
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
            if (block.type === "hero") {
              return (
                <EditorHero
                  key={block.id}
                  data={block.data}
                />
              );
            }
            if (block.type === "callToActionNoImage") {
              return (
                <EditorCTANoImage
                  key={block.id}
                  data={block.data}
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
                <div className="border-t border-primary-200 p-4" key={block.id}>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl !mt-3 !mb-0">
                    {block.data.title}
                  </h2>
                  <p className="mt-6 text-base leading-7">
                    {block.data.description}
                  </p>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-3"
                  >
                    {sortedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} site={site} />
                    ))}
                  </div>
                  <Link
                    href={"/courses"}
                    className="text-center my-6 font-semibold text-xl block border border-primary-200 rounded-md p-2 hover:bg-primary hover:text-white"
                  >
                    View All
                  </Link>
                </div>
              );
            }
            if (block.type === "cta") {
              return (
                <CtaRender block={block} />
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
