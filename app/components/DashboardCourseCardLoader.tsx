import React from "react";

const DashboardCourseCardLoader = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-2 border-2 border-ghost p-8">
        <div className="col-span-1 ">
          <div className="skeleton h-full w-full"></div>
        </div>
        <div className="col-span-2">
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-28 my-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-2 border-ghost p-8">
        <div className="col-span-1 ">
          <div className="skeleton h-full w-full"></div>
        </div>
        <div className="col-span-2">
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-28 my-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-2 border-ghost p-8">
        <div className="col-span-1 ">
          <div className="skeleton h-full w-full"></div>
        </div>
        <div className="col-span-2">
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-28 my-2"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseCardLoader;
