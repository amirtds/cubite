"use client";

import React from "react";
import Enrollment from "@/app/components/Enrollment";
import Link from "next/link";
import { Image } from "@/app/components/Image";
import { CldImage } from "next-cloudinary";

const CourseCard = ({ course, site }) => {
  return (
    <div className="flex flex-col border border-base-200">
      <Link
        key={course.id}
        className=""
        href={`/course/${course.id}/about/`}
      >
        <div className="relative h-52 w-42">
          <CldImage
            src={
              course.coverImage
                ? course.coverImage
                : "photo-1715967635831-f5a1f9658880_mhlqwu"
            }
            fill
            alt="Course cover"
            sizes="100vw"
            className=""
          />
          <div className="absolute bottom-0 left-0 m-4">
            <div className="">
              {course.topics?.map((topic) => (
                <div key={topic.id} className="badge bg-base-100 mx-1">
                  {topic.name}
                </div>
              ))}
            </div>
            <div className="">
              <span className="text-lg font-semibold text-base-200">
                {course.name}
              </span>
              {course.featured && (
                <span className="badge badge-secondary mx-2">FEATURED</span>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-8 border-b">
          <p className="text-md">
            {course.description
              ? course.description
              : "Click on enroll now to see the course"}
          </p>
        </div>
      </Link>

      <div className="flex flex-row  px-4 py-8 gap-2 place-items-center">
        {course.xp ? <p className="w-1/3">XP {course.xp}</p> : null}
        {course.level ? (
          <p className="w-2/3">
            Level <span className="font-medium">{course.level}</span>
          </p>
        ) : null}
        <Enrollment
          siteId={site.id}
          courseId={course.id}
          course={course}
          site={site}
        />
      </div>
    </div>
  );
};

export default CourseCard;
