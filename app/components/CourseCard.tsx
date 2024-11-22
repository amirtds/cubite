"use client";

import React from "react";
import Enrollment from "@/app/components/Enrollment";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

const CourseCard = ({ course, site }) => {
  return (
    <div className="flex flex-col border border-primary-200 shadow-md rounded-sm bg-base-200">
      <Link key={course.id} className="" href={`/course/${course.id}/about/`}>
        <div className="relative h-52 w-42">
          {course.externalImageUrl ? (
            <Image
              src={course.externalImageUrl}
              fill
              alt={`${course.name} cover`}
            />
          ) : (
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
          )}
          <div className="absolute bottom-0 left-0 m-4">
            <div className="">
              {course.topics?.map((topic) => (
                <div key={topic.id} className="badge bg-base-100 mx-1">
                  {topic.name}
                </div>
              ))}
            </div>
            <div className="">
              {course.featured && (
                <span className="badge badge-secondary mx-2">FEATURED</span>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-8 border-b">
          <span className="text-lg font-semibold text-accent-content">
            {course.name}
          </span>
          <p className="text-md text-base-content">
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
