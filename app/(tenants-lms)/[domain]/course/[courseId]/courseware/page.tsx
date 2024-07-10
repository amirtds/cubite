"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/app/components/courseware/Navigation";
import SideBar from "@/app/components/courseware/SideBar";
import Unit from "@/app/components/courseware/Unit";

interface Props {
  params: {
    courseId: string;
  };
}

const Courseware = ({ params: { courseId } }: Props) => {
  const [blocks, setBlocks] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [totalSections, setTotalSections] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    async function fetchCourseContent() {
      const response = await fetch(`/api/course/${courseId}`);
      const result = await response.json();
      if (result.status === 200) {
        const latestContent = result.course.contents[0]?.content?.blocks || [];
        setBlocks(latestContent);
        setCourseName(result.course.name);

        const sectionCount = latestContent.filter(
          (block) => block.type === "header" && block.data.level === 2
        ).length;
        setTotalSections(sectionCount);

        // Set the initial selected unit based on the current section
        const initialUnit = getUnitContent(latestContent, 1);
        setSelectedUnit(initialUnit);
      }
    }
    fetchCourseContent();
  }, [courseId]);

  const getUnitContent = (blocks, sectionIndex) => {
    const headers = blocks.filter(
      (block) => block.type === "header" && block.data.level === 2
    );
    const section = headers[sectionIndex - 1];
    if (!section) return [];

    const sectionIndexInBlocks = blocks.indexOf(section);
    const nextSectionIndexInBlocks = headers[sectionIndex]?.id
      ? blocks.indexOf(headers[sectionIndex])
      : blocks.length;

    // Filter out the section header and include only subsections and their content
    const sectionContent = blocks.slice(
      sectionIndexInBlocks,
      nextSectionIndexInBlocks
    );
    return sectionContent.filter(
      (block) => !(block.type === "header" && block.data.level === 2)
    );
  };

  const handleNext = () => {
    setCurrentSection((prevSection) => {
      const newSection = Math.min(prevSection + 1, totalSections);
      setSelectedUnit(getUnitContent(blocks, newSection));
      return newSection;
    });
  };

  const handlePrevious = () => {
    setCurrentSection((prevSection) => {
      const newSection = Math.max(prevSection - 1, 1);
      setSelectedUnit(getUnitContent(blocks, newSection));
      return newSection;
    });
  };

  const handleSelectUnit = (unitBlocks, sectionIndex) => {
    setSelectedUnit(unitBlocks);
    setCurrentSection(sectionIndex);
  };

  return (
    <div className="m-12">
      <Navigation
        courseName={courseName}
        totalSections={totalSections}
        currentSection={currentSection}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      <div className="grid grid-cols-6 space-x-12">
        <div className="col-span-1">
          <SideBar blocks={blocks} onSelectUnit={handleSelectUnit} />
        </div>
        <div className="col-span-5 border border-dashed p-8">
          <Unit blocks={selectedUnit} />
        </div>
      </div>
    </div>
  );
};

export default Courseware;
