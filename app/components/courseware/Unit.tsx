import React from "react";
import EditorHeader from "@/app/components/editorjsToReact/EditorHeader";
import EditorParagraph from "@/app/components/editorjsToReact/EditorParagraph";
import EditorList from "@/app/components/editorjsToReact/EditorList";
import EditorTable from "@/app/components/editorjsToReact/EditorTable";
import EditorChecklist from "@/app/components/editorjsToReact/EditorChecklist";
import EditorAlert from "@/app/components/editorjsToReact/EditorAlert";
import EditorQuote from "@/app/components/editorjsToReact/EditorQuote";
import EditorImage from "@/app/components/editorjsToReact/EditorImage";
import EditorYoutube from "@/app/components/editorjsToReact/EditorYoutube";
import EditorMultipleChoice from "@/app/components/editorjsToReact/EditorMultipleChoice";
import CourseCard from "@/app/components/CourseCard";
import Link from "next/link";
import CtaRender from "@/app/components/CtaRender";

const Unit = ({ blocks }) => {
  return (
    <div>
      {blocks.length > 0 ? (
        blocks.map((block) => {
          switch (block.type) {
            case "header":
              return (
                <EditorHeader
                  key={block.id}
                  text={block.data.text}
                  alignment={block.data.alignment}
                  level={block.data.level}
                />
              );
            case "paragraph":
              return (
                <EditorParagraph
                  key={block.id}
                  text={block.data.text}
                  alignment={block.data.alignment}
                />
              );
            case "list":
              return (
                <EditorList
                  key={block.id}
                  items={block.data.items}
                  style={block.data.style}
                />
              );
            case "delimiter":
              return (
                <div key={block.id} className="ce-delimiter cdx-block"></div>
              );
            case "table":
              return (
                <EditorTable
                  key={block.id}
                  withHeadings={block.data.withHeadings}
                  content={block.data.content}
                />
              );
            case "checklist":
              return (
                <EditorChecklist key={block.id} items={block.data.items} />
              );
            case "alert":
              return (
                <EditorAlert
                  key={block.id}
                  type={block.data.type}
                  align={block.data.align}
                  message={block.data.message}
                />
              );
            case "quote":
              return (
                <EditorQuote
                  key={block.id}
                  text={block.data.text}
                  caption={block.data.caption}
                  alignment={block.data.alignment}
                />
              );
            case "image":
              return (
                <EditorImage
                  key={block.id}
                  src={block.data.src}
                  caption={block.data.caption}
                />
              );
            case "youtube":
              return (
                <EditorYoutube
                  key={block.id}
                  youtubeId={block.data.youtubeId}
                />
              );
            case "multipleChoice":
              return (
                <EditorMultipleChoice
                  key={block.id}
                  data={block.data}
                />
              );
            case "courses":
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
                <div key={block.id}>
                  <Link
                    href={"/courses"}
                    className="text-right my-4 font-semibold text-lg block hover:text-primary"
                  >
                    View All
                  </Link>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-3">
                    {sortedCourses.map((course) => (
                      <CourseCard course={course} site={site} key={course.id} />
                    ))}
                  </div>
                </div>
              );
            case "cta":
              return (
                <CtaRender block={block}/>
              );
            default:
              return null;
          }
        })
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
};

export default Unit;
