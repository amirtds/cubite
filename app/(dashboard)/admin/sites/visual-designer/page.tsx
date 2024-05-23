import React from "react";

const page = () => {
  return (
    <>
      <div className="navbar bg-base-100 mb-8">
        <div className="navbar-start"></div>
        <div className="navbar-end">
          <button className="btn btn-outline">Preview</button>
          <button className="mx-2 btn btn-primary">Publish</button>
        </div>
      </div>
      <div className="mockup-window border bg-base-300">
        <div className="flex justify-center px-4 py-16 bg-base-200">
          <p className="font-bold text-2xl">Welcome to the Visual Designer</p>
        </div>
      </div>
    </>
  );
};

export default page;
