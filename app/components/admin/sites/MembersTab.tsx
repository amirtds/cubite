import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAlert } from "@/app/utils/useAlert";
import { CldImage } from "next-cloudinary";

function MembersTab({ site }: { site: Site }) {
  const {
    message: updateMemberRoleMessage,
    status: updateMemberRoleStatus,
    setMessage: setUpdateMemberRoleMessage,
    setStatus: setUpdateMemberRoleStatus,
  } = useAlert();
  const handleRoleChange = async (e, userId, siteId) => {
    const newRole = e.target.value;
    const response = await fetch(`/api/site/${domainName}/members`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        siteId,
        newRole,
      }),
    });
    const result = await response.json();
    setUpdateMemberRoleStatus(result.status);
    setUpdateMemberRoleMessage(result.message);
    if (result.status === 200) {
      // Update the site roles state
      const updatedRoles = site.siteRoles.map((role) =>
        role.user.id === userId ? { ...role, role: newRole } : role
      );
      setSite({ ...site, siteRoles: updatedRoles });
    } else {
      console.error("Failed to update role:", result.message);
    }
  };

  const handleMemberDeletion = async (userId: string, siteId: string) => {
    const response = await fetch(`/api/site/${domainName}/members`, {
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
  };
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Members"
      />
      <div role="tabpanel" className="tab-content py-10">
        {site.siteRoles && site.siteRoles.length > 0 ? (
          <div className="overflow-x-auto">
            {updateMemberRoleStatus === 200 && updateMemberRoleMessage && (
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
                <span>{updateMemberRoleMessage}</span>
              </div>
            )}
            {updateMemberRoleStatus !== 200 && updateMemberRoleMessage && (
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
                <span>{updateMemberRoleMessage}</span>
              </div>
            )}
            <div className="my-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="btn btn-outline btn-ghost"
                onClick={() =>
                  document.getElementById("add_member").showModal()
                }
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Add Member
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
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {site.siteRoles.map((member) => (
                  <tr key={member.user.id}>
                    <td className="">
                      {member.user.image ? (
                        <CldImage
                          width={250}
                          height={250}
                          className="w-12 h-12 rounded-full"
                          src={member.user.image}
                          onClick={() => open()}
                          alt={member.user.name}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>{member.user.name}</td>
                    <td>{member.user.email}</td>
                    <td>{member.user.username}</td>
                    <td>
                      {new Date(member.user.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td>
                      <select
                        className="select select-bordered max-w-x"
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(e, member.user.id, site.id)
                        }
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div
                        className="btn btn-outline btn-error"
                        onClick={() =>
                          handleMemberDeletion(member.user.id, site.id)
                        }
                      >
                        <TrashIcon className="h-5 w-6" aria-hidden="true" />
                      </div>
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
                  Add Users
                </h2>
                <p className="mt-1 text-sm ">
                  You haven’t added any members to your site yet.
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-ghost mt-4"
                  onClick={() =>
                    document.getElementById("add_member").showModal()
                  }
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Add a new member modal */}
      <dialog id="add_member" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a new Admin</h3>
          {createMemberStatus === 200 ? (
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
              <span>{createMemberMessage}</span>
            </div>
          ) : createMemberStatus === 0 ? (
            <p className="py-4">
              Please fill the following form to add a new member to your site.
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
              <span>{createMemberMessage}</span>
            </div>
          )}
          <div className="">
            <form method="dialog" onSubmit={handleAddMemberSubmit}>
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
                id="role"
                name="role"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              <div className="modal-action">
                <button className="btn btn-primary">Save</button>
                <div
                  className="btn btn-outline"
                  onClick={() => document.getElementById("add_member").close()}
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

export default MembersTab;
