"use client";

import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import Attributes from "./Attributes";
import Syllabus from "./Syllabus";
import Instructors from "./Instructors";
import RelatedCourses from "./RelatedCourses";

const CourseAbout = ({ courseId, site, courses }) => {
  const [course, setCourse] = useState({
    coverImage: "",
    externalImageUrl: "",
    description: "",
    name: "",
    contents: [],
    level: "",
    topics: [],
    instructors: [],
    xp: "",
  });

  useEffect(() => {
    async function getCourse(courseId) {
      const response = await fetch(`/api/course/${courseId}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setCourse(result.course);
      }
    }
    getCourse(courseId);
  }, [courseId]);

  const getRelatedCourses = () => {
    const courseTopics = course.topics.map((topic) => topic.name);
    return courses.filter(
      (c) =>
        c.topics.some((topic) => courseTopics.includes(topic.name)) &&
        c.id !== courseId
    );
  };

  return (
    <>
      <Hero
        coverImage={course.coverImage}
        externalImageUrl={course.externalImageUrl}
        description={course.description}
        name={course.name}
      />
      <Attributes
        courseId={courseId}
        siteId={site.id}
        level={course.level}
        topics={course.topics}
        xp={course.xp}
        course={course}
        site={site}
      />
      {course.contents.length > 0 && (
        <Syllabus blocks={course.contents[0].content.blocks} />
      )}
      <Instructors instructors={course.instructors} />
      <RelatedCourses courses={getRelatedCourses()} site={site} />
    </>
  );
};

export default CourseAbout;
