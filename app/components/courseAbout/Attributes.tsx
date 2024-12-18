import React from "react";
import Enrollment from "../Enrollment";

const Attributes = ({ courseId, siteId, level, topics, xp, course, site }) => {
  return (
    <div className="flex flex-row m-12 py-4">
      <div className="flex-1 justify-self-start">
        {level && (
          <span className="text-md mx-2">
            Level: <span className="font-semibold badge badge-lg">{level}</span>
          </span>
        )}

        {xp && (
          <span className="text-md mx-2">
            XP: <span className="font-semibold badge badge-lg">{xp}</span>
          </span>
        )}
        {topics.length > 0 && (
          <span className="text-md mx-2">
            Topics:{" "}
            {topics.map((topic) => (
              <span key={topic.name} className="font-semibold badge badge-lg">{topic.name}</span>
            ))}
          </span>
        )}
      </div>
      <div className="flex-none">
        <Enrollment
          courseId={courseId}
          siteId={siteId}
          course={course}
          site={site}
        />
      </div>
    </div>
  );
};

export default Attributes;
