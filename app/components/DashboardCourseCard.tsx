"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EmptyDashboard from "./EmptyDashboard";
import { CldImage } from "next-cloudinary";
import DashboardCourseCardLoader from "./DashboardCourseCardLoader";
import Link from "next/link";
import { useTranslations } from "next-intl";

const DashboardCourseCard = () => {
  const { status, data: session } = useSession();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("DashboardCourseCard");

  useEffect(() => {
    const getEnrollments = async () => {
      if (session) {
        const response = await fetch("/api/enrollments");
        const result = await response.json();
        setEnrollments(result.enrollments);
        setLoading(false);
      }
    };
    getEnrollments();
  }, [session]);

  if (loading) {
    return <DashboardCourseCardLoader />;
  }

  return (
    <div className="flex flex-col space-y-8">
      {enrollments.length > 0 ? (
        enrollments.map((enrollment) => (
          <div
            key={enrollment.course.id}
            className="relative divide-y overflow-hidden rounded-md border-2 border-ghost"
          >
            <div className="grid grid-cols-3">
              <div className="col-span-1 relative">
                <CldImage
                  height={250}
                  width={250}
                  sizes="100vw"
                  src={enrollment.course.coverImage}
                  alt={enrollment.course.name}
                  className="relative"
                />
                <div className="absolute top-2 right-6">
                  <div
                    className="radial-progress text-base-300 text-xs"
                    style={{
                      "--value": `${
                        enrollment.course.CourseProgress.length > 0
                          ? enrollment.course.CourseProgress[0]
                              .progressPercentage
                          : 0
                      }`,
                      "--size": "3rem",
                      "--thickness": "0.2rem",
                    }}
                    role="progressbar"
                  >
                    {enrollment.course.CourseProgress.length > 0
                      ? enrollment.course.CourseProgress[0].progressPercentage
                      : 0}
                    %
                  </div>
                </div>
              </div>
              <div className="col-span-2 py-4">
                <div className="flex flex-col gap-4">
                  <p className="text-xl font-bold">{enrollment.course.name}</p>
                  <p>{enrollment.course.description}</p>
                  <Link
                    href={`/course/${enrollment.course.id}/courseware/`}
                    className="btn btn-outline btn-secondary flex-none w-40 justify-self-end"
                  >
                    {t("resume_course_button")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
};

export default DashboardCourseCard;
