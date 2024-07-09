import React from "react";
import CoursesHero from "@/app/components/courses/Hero";
import CoursesFilter from "@/app/components/courses/Filter";

interface Props {
  params: {
    domain: string;
  };
}

async function getSites() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
    { cache: "no-store" }
  );
  const result = await response.json();
  return result;
}

const Courses = async ({ params }: Props) => {
  const result = await getSites();
  let site;
  if (result.status === 200) {
    site = result.sites.find(
      (s) =>
        s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === params.domain
    );
  }
  return (
    <>
      <CoursesHero />
      <CoursesFilter courses={site.courses} site={site} />
    </>
  );
};

export default Courses;
