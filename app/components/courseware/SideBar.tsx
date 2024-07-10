import React from "react";

const SideBar = ({ blocks, onSelectUnit }) => {
  const handleClick = (sectionIndex, subsectionIndex) => {
    const headers = blocks.filter(
      (block) => block.type === "header" && block.data.level === 2
    );
    const section = headers[sectionIndex];
    const sectionIndexInBlocks = blocks.indexOf(section);

    const nextSectionIndexInBlocks = headers[sectionIndex + 1]
      ? blocks.indexOf(headers[sectionIndex + 1])
      : blocks.length;

    const sectionContent = blocks.slice(
      sectionIndexInBlocks,
      nextSectionIndexInBlocks
    );

    const subsections = sectionContent.filter(
      (block) => block.type === "header" && block.data.level === 3
    );

    const subsection = subsections[subsectionIndex];
    const subsectionIndexInBlocks = sectionContent.indexOf(subsection);

    const nextSubsectionIndexInBlocks = subsections[subsectionIndex + 1]
      ? sectionContent.indexOf(subsections[subsectionIndex + 1])
      : sectionContent.length;

    const subsectionContent = sectionContent.slice(
      subsectionIndexInBlocks,
      nextSubsectionIndexInBlocks
    );

    onSelectUnit(subsectionContent, sectionIndex + 1);
  };

  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      {blocks
        .filter((block) => block.type === "header" && block.data.level === 2)
        .map((section, sectionIndex) => (
          <li key={section.id}>
            <details>
              <summary>{section.data.text}</summary>
              <ul>
                {blocks
                  .slice(
                    blocks.indexOf(section) + 1,
                    blocks.indexOf(
                      blocks.find(
                        (block, index) =>
                          index > blocks.indexOf(section) &&
                          block.type === "header" &&
                          block.data.level === 2
                      )
                    )
                  )
                  .filter(
                    (block) => block.type === "header" && block.data.level === 3
                  )
                  .map((subsection, subsectionIndex) => (
                    <li key={subsection.id}>
                      <a
                        onClick={() =>
                          handleClick(sectionIndex, subsectionIndex)
                        }
                      >
                        {subsection.data.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </details>
          </li>
        ))}
    </ul>
  );
};

export default SideBar;
