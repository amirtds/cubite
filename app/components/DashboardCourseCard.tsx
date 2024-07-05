"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EmptyDashboard from "./EmptyDashboard";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

const DashboardCourseCard = () => {
  const { status, data: session } = useSession();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const getEnrollments = async () => {
      if (session) {
        const response = await fetch("/api/enrollments");
        const result = await response.json();
        setEnrollments(result.enrollments);
      }
    };
    getEnrollments();
  }, [session]);

  return (
    <div className="flex flex-col space-y-4">
      {enrollments.length > 0 ? (
        enrollments.map((enrollment) => (
          <div className="divide-y overflow-hidden rounded-md border-2 border-ghost">
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <CldImage
                  height={250}
                  width={250}
                  sizes="100vw"
                  src={enrollment.course.coverImage}
                  alt={enrollment.course.name}
                />
              </div>
              <div className="col-span-2 py-4">
                <div className="flex flex-col gap-4">
                  <p className="text-xl font-bold">{enrollment.course.name}</p>
                  <p>{enrollment.course.description}</p>
                  <Link
                    href={`/courseware/${enrollment.course.id}`}
                    className="btn btn-outline btn-secondary flex-none w-40 justify-self-end"
                  >
                    Go to the Course
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
