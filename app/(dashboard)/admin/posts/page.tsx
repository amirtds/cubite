"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { CldImage } from "next-cloudinary";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleCopyPost = async (postId) => {
    const response = await fetch(`/api/posts/copyPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    const result = await response.json();
    if (result.status === 201) {
      setPosts([...posts, result.newPost]);
    } else {
      setError(result.message);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const response = await fetch(`/api/posts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    const result = await response.json();
    if (result.status === 200) {
      setPosts(posts.filter((post) => post.id !== postId));
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    async function getPosts() {
      const response = await fetch("/api/posts");
      const result = await response.json();
      if (result.status === 200) {
        setPosts(result.posts);
      }
    }
    getPosts();
  }, []);

  return (
    <div>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Posts</h1>
            <p className="mt-2">
              In the following you can see all the posts you can manage.
            </p>
          </div>
          {posts.length > 0 && (
            <Link
              href="/admin/posts/new"
              className="h-10 w-auto btn btn-primary"
            >
              Create a Post
            </Link>
          )}
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      {posts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Title</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <CldImage
                            width="960"
                            height="600"
                            src={
                              post.image
                                ? post.image
                                : "photo-1715967635831-f5a1f9658880_mhlqwu"
                            }
                            sizes="100vw"
                            alt="Description of my image"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{post.title}</div>
                        <div className="text-sm opacity-50">
                          {post.sites &&
                            post.sites.map((site) => site.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{format(new Date(post.createdAt), "PPP")}</td>
                  <td>{format(new Date(post.updatedAt), "PPP")}</td>
                  <th>
                    <Link
                      className="btn btn-outline btn-accent"
                      href={`/admin/posts/${post.id}`}
                    >
                      Details
                    </Link>
                  </th>
                  <td>
                    <button
                      className="btn btn-outline btn-secondary"
                      onClick={() => handleCopyPost(post.id)}
                    >
                      Copy
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto max-w-md sm:max-w-3xl">
          <div>
            <div className="text-center">
              <DocumentTextIcon className="h-12 w-12 mx-auto" />
              <h2 className="mt-2 text-base font-semibold leading-6">
                Create a Course
              </h2>
              <p className="mt-1 text-sm ">
                You don't have any posts, create one.
              </p>
              <Link
                type="button"
                className="btn btn-outline btn-ghost mt-4"
                href="/admin/posts/new"
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Create a Post
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
