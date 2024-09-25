"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import MultiInput from "@/app/components/MultiInput";
import MultiSelect from "@/app/components/MultiSelect";
import { useSession } from "next-auth/react";
import Alert from "@/app/components/Alert";
import { formatDateTime } from "@/app/utils/formatDateTime";
import DateTimeInput from "@/app/components/DateTimeInput";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Course {
  name: string;
  id: string;
  instructors: {
    user: {
      id: string;
      name: string;
    };
  };
}

interface Instructor {
  id: string;
  name: string;
}

const Course = ({ params: { id } }: Props) => {
  const [course, setCourse] = useState<Course>();
  const [message, setMessage] = useState("");
  const [alertStatus, setStatus] = useState(0);
  const [instructors, setInstructors] = useState<Instructor[]>();
  const [enrollments, setEnrollments] = useState([]);
  const [possibleInstructors, setPossibleInstructors] = useState<Instructor[]>(
    []
  );
  const [addEnrollmentStatus, setAddEnrollmentStatus] = useState(0);
  const [addEnrollmentMessage, setAddEnrollmentMessage] = useState("");
  const [enrollmentExpiration, setEnrollmentExpiration] = useState();
  const { status, data: session } = useSession();
  const [sites, setSites] = useState([]);

  useEffect(() => {
    if (!session) return;
    const getCourseData = async (id: string) => {
      const response = await fetch(`/api/course/${id}`);
      if (response.status === 200) {
        const { course } = await response.json();
        const instructors = course.instructors.map((instructor) => ({
          name: instructor.user.name,
          id: instructor.user.id,
        }));
        course.instructors = instructors;
        setCourse(course);
        setInstructors(instructors);
      }
    };
    async function getInstructor() {
      const response = await fetch("/api/instructors");
      if (response.status === 200) {
        const result = await response.json();
        const possibleInstructors = await result.instructors;
        setPossibleInstructors(possibleInstructors);
      }
    }
    async function getMysites(email: string) {
      try {
        const response = await fetch("/api/site/mysites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setSites(result.sites);
        }
      } catch (err) {
        console.log(err);
      }
    }
    async function fetchEnrollments(courseId: string) {
      const response = await fetch(`/api/enrollments/${courseId}`);
      const result = await response.json();
      if (result.status == 200) {
        setEnrollments(result.enrollments);
      } else {
        setMessage(result.message);
        setStatus(result.status);
      }
    }
    getCourseData(id);
    getInstructor();
    getMysites(session?.user?.email);
    fetchEnrollments(id);
  }, [id, session]);

  const handleCourseImage = useCallback((imageSrc: string) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      coverImage: imageSrc,
    }));
  }, []);

  const handleCourseName = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      name: e.target.value,
    }));
  }, []);

  const handleCourseDescription = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      description: e.target.value,
    }));
  }, []);

  const handleSubjects = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      subjects: options,
    }));
  }, []);

  const handleTopics = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      topics: options,
    }));
  }, []);

  const handleInstructors = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      instructors: options,
    }));
  }, []);

  const handleSites = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      sites: options,
    }));
  }, []);

  const handleLevel = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      level: e.target.value,
    }));
  }, []);

  const handlePrice = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      price: parseFloat(e.target.value),
    }));
  }, []);

  const handleXp = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      xp: parseFloat(e.target.value),
    }));
  }, []);

  const handleStartDate = useCallback((startDate) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      startDate,
    }));
  }, []);

  const handleEndDate = useCallback((endDate) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      endDate,
    }));
  }, []);

  const handleCertificateTitle = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      certificateTitle: e.target.value,
    }));
  }, []);

  const handleCertificateDescription = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      certificateDescription: e.target.value,
    }));
  }, []);

  const handleCertificateBackground = useCallback(
    (certificateBackgroundSrc) => {
      setCourse((prevCourse) => ({
        ...prevCourse,
        certificateBackground: certificateBackgroundSrc,
      }));
    },
    []
  );

  const handleAddEnrollmentSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const enrollmentData = {
      courseId: course.id,
      name: formData.get("name"),
      email: formData.get("email"),
      username: formData.get("username"),
      siteId: formData.get("siteId"),
      expiresAt: enrollmentExpiration,
    };
    const response = await fetch(`/api/enrollments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollmentData),
    });

    const result = await response.json();
    if (result.status === 201) {
      setEnrollments([...enrollments, result.enrollment]);
      document.getElementById("add_enrollment").close();
    }
    setAddEnrollmentStatus(result.status);
    setAddEnrollmentMessage(result.message);
  };

  const handleEnrollmentExpiration = useCallback((expirationDate) => {
    setEnrollmentExpiration(expirationDate);
  }, []);

  const handleUpdateEnrollmentExpiration = async (enrollment, expiresAt) => {
    const response = await fetch(`/api/enrollments/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        siteId: enrollment.siteId,
        expiresAt: expiresAt,
      }),
    });

    const result = await response.json();
    setStatus(result.status);
    setMessage(result.message);
  };

  const handleCourseSave = async () => {
    if (!course) return;

    const response = await fetch(`/api/course/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    });
    const result = await response.json();
    setStatus(result.status);
    setMessage(result.message);
  };

  const handleDeleteEnrollment = async (selectedEnrollment) => {
    const response = await fetch(`/api/enrollments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: selectedEnrollment.courseId,
        userId: selectedEnrollment.userId,
        siteId: selectedEnrollment.siteId,
      }),
    });

    const result = await response.json();

    if (result.status === 200) {
      setEnrollments(
        enrollments.filter(
          (enrollment) => enrollment.userId !== selectedEnrollment.userId
        )
      );
    } else {
      console.error(result.message);
    }
    setStatus(result.status);
    setMessage(result.message);
  };

  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course?.name}</h1>
            <p className="text-sm text-gray-500">
              Created at{" "}
              {course?.createdAt && formatDateTime(course?.createdAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated at{" "}
              {course?.updatedAt && formatDateTime(course?.updatedAt)}
            </p>

            <p className="mt-2">
              Fill the following information to create a new course.
            </p>
          </div>
          <div>
            <Link
              className="btn mx-2 btn-outline btn-ghost"
              href={`/admin/content-authoring/course/${id}`}
            >
              Content Authoring
            </Link>
            <button className="btn btn-primary" onClick={handleCourseSave}>
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <Alert
        status={alertStatus}
        message={message}
        onClose={() => {
          setStatus(0), setMessage("");
        }}
      />
      {course && (
        <div className="">
          <div role="tablist" className="tabs tabs-boxed mt-8">
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Details"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6 mb-8"
            >
              <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8  sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Course Name</span>
                    </div>
                    <input
                      type="text"
                      id="courseName"
                      name="courseName"
                      placeholder={course?.name}
                      defaultValue={course?.name}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleCourseName}
                    />
                    <div className="label">
                      <span className="label-text-alt">Change Course Name</span>
                    </div>
                  </label>
                </div>
                <DateTimeInput
                  title="Course Start Date"
                  onChange={handleStartDate}
                  defaultValue={course?.startDate}
                />
                <DateTimeInput
                  title="Course End Date"
                  onChange={handleEndDate}
                  defaultValue={course?.endDate}
                />

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                    <div className="text-center">
                      <CldImage
                        width={500}
                        height={500}
                        src={
                          course?.coverImage
                            ? course.coverImage
                            : "photo-1715967635831-f5a1f9658880_mhlqwu"
                        }
                        alt="Description of my image"
                      />
                      <div className="mt-4 flex text-sm leading-6">
                        <CldUploadWidget
                          uploadPreset="dtskghsx"
                          options={{
                            multiple: false,
                          }}
                          onSuccess={(results, options) => {
                            handleCourseImage(results.info?.public_id);
                          }}
                        >
                          {({ open }) => {
                            return (
                              <button
                                className="btn btn-outline btn-secondary"
                                onClick={() => open()}
                              >
                                Upload an Image
                              </button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Course Description</span>
                    </div>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="This course is about ...."
                      defaultValue={course?.description}
                      onChange={handleCourseDescription}
                    ></textarea>
                    <div className="label">
                      <span className="label-text-alt">
                        Write some description about this course
                      </span>
                    </div>
                  </label>
                </div>

                <MultiInput
                  title={"Subjects"}
                  onChange={handleSubjects}
                  preSelectedOptions={course?.subjects}
                />
                <MultiInput
                  title={"Topics"}
                  onChange={handleTopics}
                  preSelectedOptions={course?.topics}
                />
                <MultiSelect
                  title={"Instructors"}
                  onChange={handleInstructors}
                  options={possibleInstructors}
                  preSelectedOptions={instructors}
                />
                <MultiSelect
                  title={"Sites"}
                  onChange={handleSites}
                  options={sites}
                  preSelectedOptions={course?.sites}
                />
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Level</span>
                    </div>
                    <select
                      className="select select-bordered"
                      onChange={handleLevel}
                      defaultValue={course.level ? course.level : ""}
                    >
                      <option>Beginner</option>
                      <option>Intermidiate</option>
                      <option>Advanced</option>
                    </select>
                    <div className="label">
                      <span className="label-text-alt">
                        Change Course Level
                      </span>
                    </div>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Price</span>
                    </div>
                    <input
                      type="text"
                      id="courseName"
                      name="courseName"
                      placeholder={course?.price}
                      defaultValue={course?.price}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handlePrice}
                    />
                    <div className="label">
                      <span className="label-text-alt">
                        Change Course Price
                      </span>
                    </div>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">XP</span>
                    </div>
                    <input
                      type="text"
                      id="courseXp"
                      name="courseXp"
                      placeholder={course?.xp}
                      defaultValue={course?.xp}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleXp}
                    />
                    <div className="label">
                      <span className="label-text-alt">Change XP</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Certificates"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8  sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Certificate Title</span>
                    </div>
                    <input
                      type="text"
                      id="certificateTitle"
                      name="certificateTitle"
                      placeholder={course?.certificateTitle}
                      defaultValue={course?.certificateTitle}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleCertificateTitle}
                    />
                    <div className="label">
                      <span className="label-text-alt">
                        Title to show in the certificate
                      </span>
                    </div>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
                        Certificate Description
                      </span>
                    </div>
                    <input
                      type="text"
                      id="certificateDescription"
                      name="certificateDescription"
                      placeholder={course?.certificateDescription}
                      defaultValue={course?.certificateDescription}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleCertificateDescription}
                    />
                    <div className="label">
                      <span className="label-text-alt">
                        Certification Description and Details
                      </span>
                    </div>
                  </label>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6"
                  >
                    Certificate Background
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                    <div className="text-center">
                      {course?.certificateBackground && (
                        <CldImage
                          width={500}
                          height={500}
                          src={course?.certificateBackground}
                          alt="Description of my image"
                        />
                      )}
                      <div className="mt-4 flex text-sm leading-6">
                        <CldUploadWidget
                          uploadPreset="dtskghsx"
                          options={{
                            multiple: false,
                          }}
                          onSuccess={(results, options) => {
                            handleCertificateBackground(
                              results.info?.public_id
                            );
                          }}
                        >
                          {({ open }) => {
                            return (
                              <button
                                className="btn btn-outline btn-secondary"
                                onClick={() => open()}
                              >
                                Upload an Image
                              </button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Enrollments"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="overflow-x-auto">
                {/* enrollment modal */}
                <dialog id="add_enrollment" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Add Enrollment</h3>
                    {addEnrollmentStatus === 201 ? (
                      <div role="alert" className="alert alert-success my-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{addEnrollmentMessage}</span>
                      </div>
                    ) : addEnrollmentStatus === 0 ? (
                      <p className="py-4">
                        Please fill the following form to add a new enrollment
                        to your course.
                      </p>
                    ) : (
                      <div role="alert" className="alert alert-error my-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{addEnrollmentMessage}</span>
                      </div>
                    )}
                    <div className="">
                      <form
                        method="dialog"
                        onSubmit={handleAddEnrollmentSubmit}
                      >
                        <DateTimeInput
                          title="Enrollment Expiration"
                          onChange={handleEnrollmentExpiration}
                          defaultValue={"2050-01-01T00:00"}
                        />
                        <label className="input input-bordered flex items-center gap-2 my-4">
                          Name:
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="grow"
                            placeholder="John Doe"
                            required
                            minLength={6}
                          />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 my-4">
                          Email:
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className="grow"
                            placeholder="john@example.com"
                            required
                          />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 my-4">
                          Username:
                          <input
                            type="text"
                            className="grow"
                            placeholder="john.doe"
                            id="username"
                            name="username"
                            required
                            minLength={3}
                          />
                        </label>
                        <select
                          className="select select-bordered w-full max-w-xs"
                          id="siteId"
                          name="siteId"
                        >
                          <option disabled value="Select the site">
                            Select the site
                          </option>
                          {course.sites.map((site) => (
                            <option key={site.id} value={site.id}>
                              {site.name}
                            </option>
                          ))}
                        </select>
                        <div className="modal-action">
                          <button className="btn btn-primary">Save</button>
                          <div
                            className="btn btn-outline"
                            onClick={() =>
                              document.getElementById("add_enrollment").close()
                            }
                          >
                            Cancel
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </dialog>
                {/* end of enrollment modal */}
                {enrollments.length === 0 ? (
                  <div className="mx-auto max-w-md sm:max-w-3xl">
                    <div>
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <h2 className="mt-2 text-base font-semibold leading-6">
                          Add Students
                        </h2>
                        <p className="mt-1 text-sm ">
                          This course doesn&apos;t have any students yet.
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline btn-ghost mt-4"
                          onClick={() =>
                            document
                              .getElementById("add_enrollment")
                              .showModal()
                          }
                        >
                          <PlusIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          Add Students
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="my-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="btn btn-outline btn-ghost"
                        onClick={() =>
                          document.getElementById("add_enrollment").showModal()
                        }
                      >
                        <PlusIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        Add Enrollment
                      </button>
                    </div>{" "}
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Enrollment Date</th>
                          <th>Expires at</th>
                          <></>
                        </tr>
                      </thead>

                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.userId}>
                            <td>{enrollment.user.name}</td>
                            <td>{enrollment.user.email}</td>
                            <td>{formatDateTime(enrollment.enrolledAt)}</td>
                            <td>
                              <DateTimeInput
                                title=""
                                onChange={(expiresAt) =>
                                  handleUpdateEnrollmentExpiration(
                                    enrollment,
                                    expiresAt
                                  )
                                }
                                defaultValue={enrollment.expiresAt}
                              />
                            </td>
                            <td
                              className="btn btn-outline btn-error my-7"
                              onClick={() => handleDeleteEnrollment(enrollment)}
                            >
                              <TrashIcon
                                className="h-5 w-6"
                                aria-hidden="true"
                              />
                            </td>
                          </tr>
                        ))}
                        {/* row 1 */}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Course;
