import React from "react";

interface Props {
  params: {
    courseId: string;
  };
}

const Courseware = ({ params: { courseId } }: Props) => {
  return <div>Welcome to {courseId}</div>;
};

export default Courseware;
