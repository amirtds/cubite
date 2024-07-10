import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const Navigation = ({
  courseName,
  totalSections,
  currentSection,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="flex flex-row border border-dashed p-4 mb-2">
      <p className="text-2xl font-black self-center">{courseName}</p>
      <div className="flex flex-row self-center ml-auto">
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={onPrevious}
          disabled={currentSection === 1}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <p className="mx-4 self-center text-sm">
          {currentSection} / {totalSections}
        </p>
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={onNext}
          disabled={currentSection === totalSections}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Navigation;
