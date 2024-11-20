"use client";

import React, { useState } from "react";
import LiftedTab from "@/app/components/admin/sites/LiftedTab";

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
  admins: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  siteRoles?: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
}

function ImportExportTab({ site }: { site: Site }) {
  const [openEdXURL, setOpenEdXURL] = useState<string>("");
  const [openEdxCourses, setOpenEdxCourses] = useState<any[]>([]);
  const [status, setStatus] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const handleSyncCourses = async () => {
    try {
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
        setMessage(`${data.result.message}`);
        setStatus(200);
      } else {
        setMessage(data.message || "Failed to sync courses");
        setStatus(data.status || 500);
      }
    } catch (error) {
      setMessage(`Error syncing courses`);
      setStatus(500);
    }
  };

  const handleOpenEdXURL = (e) => {
    try {
      const url = e.target.value;

      if (!url.includes("http://") && !url.includes("https://")) {
        setOpenEdXURL("https://" + url);
      } else {
        setOpenEdXURL(url);
      }
    } catch (error) {
      setMessage("Invalid URL format");
      setStatus(400);
    }
  };

  return (
    <>
      <LiftedTab tabName="Import and Export">
        <h3 className="text-2xl font-bold uppercase">Open edX</h3>
        <div className="mt-4 flex gap-x-2">

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
                {status === 0 && (
                  <span className="label-text-alt">
                    Please make sure the site is accessible
                  </span>
                )}
                {status === 400 && (
                  <span className="label-text-alt text-error">{message}</span>
                )}
                {status === 500 && (
                  <span className="label-text-alt text-error">{message}</span>
                )}
                {status === 200 && (
                  <span className="label-text-alt text-green-600">{message}</span>
                )}
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
