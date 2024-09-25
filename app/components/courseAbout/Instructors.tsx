import React from "react";
import { CldImage } from "next-cloudinary";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Instructors = ({ instructors }) => {
  return (
    <div className="m-12">
      <h2 className="text-3xl font-semibold mb-8">Instructors</h2>
      <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-12">
        {instructors.map((instructor) => (
          <div className="flex flex-col border-dashed border-2 px-12 py-6" key={instructor.id}>
            {instructor.user.image ? (
              <div className="avatar">
                <div className="w-24 h-24 rounded-xl mx-auto">
                  <CldImage
                    width={150}
                    height={150}
                    className="rounded-full"
                    src={instructor.user.image}
                    sizes="100vw"
                    alt={instructor.user.name}
                  />
                </div>
              </div>
            ) : (
              <UserCircleIcon className="w-24 h-24 self-center" />
            )}
            <p className="self-center text-xl font-semibold capitalize m-4">
              {instructor.user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;
