"use client";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import Alert from "@/app/components/Alert";
import MultiInput from "@/app/components/MultiInput";
import MultiSelect from "@/app/components/MultiSelect";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { useSession } from "next-auth/react";

interface Props {
  params: {
    id: string;
  };
}

interface Post {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
}
interface Author {
  id: string;
  name: string;
}

const Post = ({ params: { id } }: Props) => {
  const [post, setPost] = useState<Post>();
  const [alertStatus, setStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [authors, setAuthors] = useState([]);
  const [possibleAuthors, setPossibleAuthors] = useState<Author[]>([]);
  const [sites, setSites] = useState([]);
  const { status, data: session } = useSession();

  useEffect(() => {
    async function getPostData(id: string) {
      const response = await fetch(`/api/post/${id}`);
      const result = await response.json();
      if (result.status === 200) {
        const fetchedPost = result.post;
        const authors = fetchedPost.authors.map((author) => ({
          name: author.user.name,
          id: author.user.id,
        }));
        fetchedPost.authors = authors;
        setPost(fetchedPost);
        setAuthors(authors);
        setMessage("Successfully fetched post data");
        setStatus(200);
      } else {
        setStatus(result.status);
        setMessage(result.message);
      }
    }
    async function getInstructor() {
      const response = await fetch("/api/instructors");
      if (response.status === 200) {
        const result = await response.json();
        const possibleInstructors = await result.instructors;
        setPossibleAuthors(possibleInstructors);
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
    getPostData(id);
    getInstructor();
    getMysites(session?.user?.email);
  }, [id, session]);

  const handleTitle = (e) => {
    post ? (post.title = e.target.value) : "";
    setPost(post);
  };

  const handleSubjects = (options) => {
    post ? (post.subjects = options) : "";
    setPost(post);
  };

  const handleTopics = (options) => {
    post ? (post.topics = options) : "";
    setPost(post);
  };

  const handlePermalink = (e) => {
    post ? (post.permalink = e.target.value) : "";
    setPost(post);
  };

  const handleBlurb = (e) => {
    post ? (post.blurb = e.target.value) : "";
    setPost(post);
  };

  const handleAuthors = (options) => {
    post ? (post.authors = options) : "";
    setPost(post);
  };

  const handleDescription = (e) => {
    post ? (post.description = e.target.value) : "";
    setPost(post);
  };

  const handlePostImage = (imageSrc: string) => {
    if (post) {
      setPost({ ...post, image: imageSrc });
    } else {
      console.log("post not available");
    }
  };

  const handleSites = (options) => {
    post ? (post.sites = options) : "";
    setPost(post);
  };

  const handlePostUpdate = async () => {
    if (!post) return;
    console.log(post);
    const response = await fetch(`/api/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    const result = await response.json();
    setStatus(result.status);
    setMessage(result.message);
  };

  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{post?.title}</h1>
            <p className="text-sm text-gray-500">
              Created at {post?.createdAt && formatDateTime(post?.createdAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated at {post?.updatedAt && formatDateTime(post?.updatedAt)}
            </p>

            <p className="mt-2">
              Fill the following information to create a new course.
            </p>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handlePostUpdate}>
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
      <div>
        <div className="space-y-12">
          <div className="border-b pb-12">
            <h2 className="font-semibold leading-7 text-lg">
              Post Information
            </h2>
            <p className="mt-1 text-sm leading-6">
              Please fill this information. This is basic info after creating
              the post you can go to content authoring to add post content
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Title</span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder={post?.title}
                    defaultValue={post?.title}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleTitle}
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      Name to show as post title to the users
                    </span>
                  </div>
                </label>
              </div>
              <MultiInput
                title={"Subjects"}
                onChange={handleSubjects}
                preSelectedOptions={post?.subjects}
              />
              <MultiInput
                title={"Topics"}
                onChange={handleTopics}
                preSelectedOptions={post?.topics}
              />
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Permalink</span>
                  </div>
                  <input
                    type="text"
                    name="permalink"
                    id="permalink"
                    placeholder={post?.permalink}
                    defaultValue={post?.permalink}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handlePermalink}
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      permalink for this post
                    </span>
                  </div>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Blurb</span>
                  </div>
                  <input
                    type="text"
                    name="blurb"
                    id="blurb"
                    placeholder={post?.blurb}
                    defaultValue={post?.blurb}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleBlurb}
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt">blurb for this post</span>
                  </div>
                </label>
              </div>
              <MultiSelect
                title="Authors"
                onChange={handleAuthors}
                options={possibleAuthors}
                preSelectedOptions={authors}
              />
              <div className="col-span-full">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder={post?.description}
                    defaultValue={post?.description}
                    onChange={handleDescription}
                  ></textarea>
                  <div className="label">
                    <span className="label-text-alt">
                      Write some description about this post
                    </span>
                  </div>
                </label>
              </div>
              {post && (
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
                        src={post?.image}
                        alt="Description of my image"
                      />
                      <div className="mt-4 flex text-sm leading-6">
                        <CldUploadWidget
                          uploadPreset="dtskghsx"
                          options={{
                            multiple: false,
                          }}
                          onSuccess={(results, options) => {
                            handlePostImage(results.info?.public_id);
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
              )}
              <MultiSelect
                title={"Sites"}
                onChange={handleSites}
                options={sites}
                preSelectedOptions={post?.sites}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
