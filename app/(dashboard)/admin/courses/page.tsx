"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
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

const Courses = () => {
  const [courses, setCourses] = useState<Site[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { status, data: session } = useSession();

  if (loading) {
    return (
      <div>
        <div className="flex-1 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Courses</h1>
              <p className="mt-2">
                In the following you can see all the sites you can manage.
              </p>
            </div>
          </div>
        </div>
        <div className="border-b mb-24">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sites</h1>
            <p className="mt-2">
              In the following you can see all the sites you can manage.
            </p>
          </div>
          {courses.length > 0 && (
            <Link
              href="/admin/sites/new"
              className="h-10 w-auto btn btn-primary"
            >
              Create a Site
            </Link>
          )}
        </div>
      </div>
      <div className="border-b mb-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>

      {!error ? (
        courses.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
            {courses.map((course) => (
              <div key={course.id} className="border-2">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium capitalize">
                        {course.name}
                      </h3>
                      <a
                        className="text-sm text-secondary link"
                        href={`https://${course.domainName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {course.domainName}
                      </a>
                      {process.env.NODE_ENV === "development" && (
                        <div>
                          <a
                            className="text-sm text-ghost link"
                            href={`http://${
                              course.domainName.split(".cubite.io")[0]
                            }.localhost:3000`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${
                              course.domainName.split(".cubite.io")[0]
                            }.localhost:3000`}
                          </a>
                        </div>
                      )}
                    </div>
                    {course.isActive ? (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-ping" />
                        <span className="text-sm font-medium text-green-500">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-red-500">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      className="inline-flex items-center btn btn-outline"
                      href={`/admin/sites/${course.domainName}`}
                    >
                      <Cog6ToothIcon className="h-6 w-6" />
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold">No courses</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any course. Create new one.
            </p>
            <div className="mt-6">
              <Link
                href={"/admin/courses/new"}
                type="button"
                className="inline-flex items-center btn btn-primary"
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                New Course
              </Link>
            </div>
          </div>
        )
      ) : (
        "No site"
      )}
    </div>
  );
};

export default Courses;
