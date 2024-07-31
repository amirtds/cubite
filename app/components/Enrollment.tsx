"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Props {
  courseId: string;
  siteId: string;
  course: {};
  site: {};
}

const Enrollment = ({ courseId, siteId, course, site }: Props) => {
  const { status, data: session } = useSession();
  const [enrollments, setEnrollments] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);

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

  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      setIsEnrolled(
        enrollments.some((enrollment) => enrollment.courseId === courseId)
      );
    }
  }, [enrollments, courseId]);

  const handleEnrollment = async () => {
    if (session) {
      if (isEnrolled) {
        window.location.href = `/course/${courseId}/courseware/`;
      } else {
        const enrollmentData = {
          courseId: courseId,
          name: session?.user.name,
          email: session?.user?.email,
          username: session?.user.username,
          siteId: siteId,
        };
        const response = await fetch(`/api/enrollments/${courseId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enrollmentData),
        });

        const result = await response.json();
        if (result.status === 201) {
          // Assuming the enrollment is created successfully, update the enrollments state
          setEnrollments((prevEnrollments) => [
            ...prevEnrollments,
            { courseId: courseId, siteId: siteId, userId: session?.user.id },
          ]);
          setIsEnrolled(true);
          window.location.href = `/course/${courseId}/courseware/`;
          // send enrollment email
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              site,
              course,
              userFirstname: session?.user.name,
              to: session?.user?.email,
              subject: `You are enrolled into ${course?.name}`,
              type: "enrollment",
            }),
          });
        }
      }
    } else {
      window.location.href = "/auth/signin";
    }
  };

  return (
    <div className="flex-none justify-self-end">
      <button onClick={handleEnrollment} className="btn btn-primary">
        {isEnrolled ? "Continue" : "Enroll Now"}
      </button>
    </div>
  );
};

export default Enrollment;
