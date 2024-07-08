import React from "react";

interface Props {
  params: {
    courseId: string;
  };
}

const About = ({ params: { courseId } }: Props) => {
  return <div>Welcome to {courseId} about page</div>;
};

export default About;
