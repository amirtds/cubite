"use client";

import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAlert } from "@/app/utils/useAlert";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  image?: string;
}

function AdminsTab() {
  const [admins, setAdmins] = useState<User[]>([]);
  const {
    message: deleteAdminMessage,
    status: deleteAdminStatus,
    setMessage: setDeleteAdminMessage,
    setStatus: setDeleteAdminStatus,
  } = useAlert();
  const handleAdminDeletion = async (userId: string, siteId: string) => {
    if (admins.length === 1) {
      setDeleteAdminMessage("There should be at least one admin for the site");
      setDeleteAdminStatus(400);
      return;
    }
    const response = await fetch(`/api/site/${domainName}/admins`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        siteId,
      }),
    });
    const result = await response.json();

    setDeleteAdminMessage(result.message);
    setDeleteAdminStatus(result.status);
    if (result.status === 200) {
      setAdmins(admins.filter((a) => a.id !== userId));
    }
  };
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Admins"
      />
      <div role="tabpanel" className="tab-content py-10">
        <div className="overflow-x-auto">
          {deleteAdminMessage && (
            <div role="alert" className="alert alert-error">
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
              <span>{deleteAdminMessage}</span>
            </div>
          )}
          <div className="my-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="btn btn-outline btn-ghost"
              onClick={() => document.getElementById("add_admin").showModal()}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Admin
            </button>
          </div>

          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    {admin.image ? (
                      admin.image
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.username}</td>
                  <td>
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <div
                      className="btn btn-outline btn-error"
                      onClick={() => handleAdminDeletion(admin.id, site.id)}
                    >
                      <TrashIcon className="h-5 w-6" aria-hidden="true" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add a new admin modal */}
      <dialog id="add_admin" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a new Admin</h3>
          {createAdminStatus === 200 ? (
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
              <span>{createAdminMessage}</span>
            </div>
          ) : createAdminStatus === 0 ? (
            <p className="py-4">
              Please fill the following form to add an admin to your site.
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
              <span>{createAdminMessage}</span>
            </div>
          )}
          <div className="">
            <form method="dialog" onSubmit={handleAddAdminSubmit}>
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

              <div className="modal-action">
                <button className="btn btn-primary">Save</button>
                <div
                  className="btn btn-outline"
                  onClick={() => document.getElementById("add_admin").close()}
                >
                  Cancel
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default AdminsTab;
