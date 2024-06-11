"use client";

import React, { useEffect, useState, useCallback } from "react";
import Editor from "@/app/components/Editor";
import Alert from "@/app/components/Alert";
import { useSession } from "next-auth/react";
import { formatDateTime } from "@/app/utils/formatDateTime";

interface Props {
  params: {
    id: string;
  };
}

interface Content {
  time: number;
  blocks: [];
  version: number;
}

const CourseAuthoring = ({ params: { id } }: Props) => {
  const [alertStatus, setStatus] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [content, setContent] = useState<Content | null>(null);
  const [changedContent, setChangedContent] = useState<Content | null>(null);
  const [courseContentVersions, setCourseContentVersions] = useState([]);
  const { status, data: session } = useSession();
  const [userId, setUserId] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const handleContentChange = useCallback((content: Content) => {
    setChangedContent(content);
    setHasUnsavedChanges(true);
  }, []);

  const handleContentSave = useCallback(async () => {
    try {
      const response = await fetch(`/api/course-content/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: id,
          authorId: userId,
          content: changedContent ? changedContent : content,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      setStatus(result.status);
      setHasUnsavedChanges(false); // Reset unsaved changes flag after saving
    } catch (err) {
      console.log(err);
    }
  }, [changedContent, content, id, userId]);

  useEffect(() => {
    const getCourseContent = async (courseId: string) => {
      const response = await fetch(`/api/course-content/${courseId}`);
      const result = await response.json();
      setStatus(result.status);
      setMessage(result.message);
      if (result.status === 200) {
        setContent(result.contents.content);
      }
      if (result.status === 404) {
        setStatus(0);
        setMessage("");
      }
    };

    const getUserId = async () => {
      const response = await fetch("/api/getUserById");
      const result = await response.json();
      if (result.status === 200) {
        setUserId(result.id);
      }
    };

    const getCourseContentVersions = async () => {
      const response = await fetch(`/api/course-content-versions/${id}`);
      const result = await response.json();
      if (result.status === 200) {
        setCourseContentVersions(result.changeLog);
      }
    };

    getCourseContent(id);
    getUserId();
    getCourseContentVersions();
  }, [id]);

  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        handleContentSave();
      }
    }, 180000); // Autosave every 3 minutes

    return () => clearInterval(autosaveInterval); // Cleanup interval on unmount
  }, [hasUnsavedChanges, handleContentSave]);

  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{id}</h1>
            <p className="mt-2">Write and Edit the course content</p>
          </div>
          <div className="flex items-end">
            <button
              className="btn btn-outline btn-primary px-6"
              onClick={handleContentSave}
              disabled={!hasUnsavedChanges} // Disable save button if there are no unsaved changes
            >
              Save
            </button>
            <div className="drawer drawer-end">
              <input
                id="my-drawer-4"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content mx-2">
                {/* Page content here */}
                <label
                  htmlFor="my-drawer-4"
                  className="drawer-button btn btn-outline btn-secondary"
                >
                  Change Log
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer-4"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu w-80 min-h-full bg-base-200 text-base-content p-0 list-disc">
                  <div className="text-xl font-bold bg-primary px-4 py-8  text-gray-50">
                    Detail of Course Change
                    <p className="text-lg font-semibold text-gray-100 underline underline-offset-4">
                      #{courseContentVersions.length}
                      <span className="text-sm font-thin"> changes found</span>
                    </p>
                  </div>
                  <div className="p-2 m-4">
                    <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                      {courseContentVersions.map((version, index) => (
                        <div className="mb-8" key={index}>
                          <p className="border-b border-gray-300 text-md font-semibold">
                            #{courseContentVersions.length - index}
                          </p>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500 text-xs">
                              Updated by
                            </dt>
                            <dd className="text-gray-700">
                              {version.author.name}
                            </dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium border-b border-gray-300">
                            <dt className="text-gray-500 text-xs">
                              Updated at
                            </dt>
                            <dd className="text-gray-700">
                              {formatDateTime(version.createdAt)}
                            </dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <Alert
        status={alertStatus}
        message={message}
        onClose={() => {
          setStatus(0), setMessage("");
        }}
      />
      <Editor savedContent={content} onChange={handleContentChange} />
    </>
  );
};

export default CourseAuthoring;
