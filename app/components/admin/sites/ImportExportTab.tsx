"use client";

import React, { useState } from "react";
import LiftedTab from "@/app/components/admin/sites/LiftedTab";
import { useAlert } from "@/app/utils/useAlert";

function ImportExportTab() {
  const [openEdXURL, setOpenEdXURL] = useState<string>("");
  const [openEdxCourses, setOpenEdxCourses] = useState<any[]>([]);

  const {
    message: syncCoursesMessage,
    status: syncCoursesStatus,
    setMessage: setSyncCoursesMessage,
    setStatus: setSyncCoursesStatus,
  } = useAlert();

  const {
    message: openEdXMessage,
    status: openEdXStatus,
    setMessage: setOpenEdXMessage,
    setStatus: setOpenEdXStatus,
  } = useAlert();

  const handleSyncCourses = async () => {
    try {
      if (!openEdXURL) {
        setSyncCoursesMessage("OpenEdX URL is required");
        setSyncCoursesStatus(400);
        return;
      }

      if (!site?.id) {
        setSyncCoursesMessage("Site ID is required");
        setSyncCoursesStatus(400);
        return;
      }

      // Encode the URL parameters
      const encodedUrl = encodeURIComponent(openEdXURL);
      const encodedSiteId = encodeURIComponent(site.id);

      const response = await fetch(
        `/api/upsertOpenedxCourses?openedxUrl=${encodedUrl}&siteId=${encodedSiteId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setOpenEdxCourses(data.result.results || []);
        setSyncCoursesMessage(`${data.result.message}`);
        setSyncCoursesStatus(200);
      } else {
        setSyncCoursesMessage(data.message || "Failed to sync courses");
        setSyncCoursesStatus(data.status || 500);
      }
    } catch (error) {
      console.error("Error syncing courses:", error);
      setSyncCoursesMessage(`Error syncing courses: ${error.message}`);
      setSyncCoursesStatus(500);
    }
  };

  const handleOpenEdXURL = (e) => {
    try {
      const url = e.target.value;
      if (!url) {
        setOpenEdXMessage("URL is required");
        setOpenEdXStatus(400);
        return;
      }

      if (!url.includes("http://") && !url.includes("https://")) {
        setOpenEdXURL("https://" + url);
        setOpenEdXMessage("Protocol added to URL");
        setOpenEdXStatus(200);
      } else {
        setOpenEdXURL(url);
        setOpenEdXMessage("URL updated successfully");
        setOpenEdXStatus(200);
      }
    } catch (error) {
      setOpenEdXMessage("Invalid URL format");
      setOpenEdXStatus(400);
    }
  };

  return (
    <>
      <LiftedTab tabName="Import and Export">
        <h3 className="text-2xl font-bold uppercase">Open edX</h3>
        <div className="mt-4 flex gap-x-2">
          {/* Display Sync Courses alert */}
          {syncCoursesMessage && (
            <div
              className={`sm:col-span-6 alert ${
                syncCoursesStatus === 200 ? "alert-success" : "alert-error"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                {syncCoursesStatus === 200 ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <span>{syncCoursesMessage}</span>
            </div>
          )}

          {/* Open edX URL input */}
          <div className="">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">
                  What is your existing Open edX site URL?
                </span>
              </div>
              <input
                type="text"
                placeholder="edx.org"
                className="input input-bordered w-full max-w-xs"
                name="openEdXURL"
                onChange={handleOpenEdXURL}
                value={openEdXURL || ""}
              />
              <div className="label">
                <span className="label-text-alt">
                  Please make sure the site is accessible
                </span>
              </div>
            </label>
          </div>

          <div className="mt-5">
            <button
              className={`btn btn-outline btn-primary mt-4 ${
                !openEdXURL ? "btn-disabled" : ""
              }`}
              onClick={handleSyncCourses}
              disabled={!openEdXURL}
            >
              Sync Courses
            </button>
          </div>
        </div>
      </LiftedTab>
    </>
  );
}

export default ImportExportTab;
