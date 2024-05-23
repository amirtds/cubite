"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { getRoles } from "@/app/utils/getRoles";
import { useAlert } from "@/app/utils/useAlert";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    domainName: string;
  };
}

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  admins: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  siteRoles?: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  image?: string;
}

const SitePage = ({ params: { domainName } }: Props) => {
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [admins, setAdmins] = useState<User[]>([]);
  const [roles, setRoles] = useState([]);
  const {
    message: createAdminMessage,
    status: createAdminStatus,
    setMessage: setCreateAdminMessage,
    setStatus: setCreateAdminStatus,
  } = useAlert();
  const {
    message: deleteAdminMessage,
    status: deleteAdminStatus,
    setMessage: setDeleteAdminMessage,
    setStatus: setDeleteAdminStatus,
  } = useAlert();
  const {
    message: createMemberMessage,
    status: createMemberStatus,
    setMessage: setCreateMemberMessage,
    setStatus: setCreateMemberStatus,
  } = useAlert();
  const {
    message: updateSiteMessage,
    status: updateSiteStatus,
    setMessage: setUpdateSiteMessage,
    setStatus: setUpdateSiteStatus,
  } = useAlert();
  const {
    message: updateMemberRoleMessage,
    status: updateMemberRoleStatus,
    setMessage: setUpdateMemberRoleMessage,
    setStatus: setUpdateMemberRoleStatus,
  } = useAlert();
  const {
    message: deleteSiteMessage,
    status: deleteSiteStatus,
    setMessage: setDeleteSiteMessage,
    setStatus: setDeleteSiteStatus,
  } = useAlert();

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const username = formData.get("username");

    const response = await fetch(`/api/site/${domainName}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        username,
        siteId: site.id,
      }),
    });
    const result = await response.json();
    setCreateAdminMessage(result.message);
    setCreateAdminStatus(result.status);
    if (result.status === 200) {
      const newAdmin = result.user;
      const allAdmins = [...admins, newAdmin];
      setAdmins(allAdmins);
      document.getElementById("add_admin").close();
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const username = formData.get("username");
    const role = formData.get("role");
    const response = await fetch(`/api/site/${domainName}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        username,
        siteId: site.id,
        role,
      }),
    });

    const result = await response.json();
    setCreateMemberMessage(result.message);
    setCreateMemberStatus(result.status);
    if (result.status === 200) {
      const newMember = {
        ...result.user,
        role: result.role,
      };
      const newSiteRole = {
        id: result.siteRoleId,
        userId: newMember.id,
        siteId: site.id,
        role: result.role,
        user: newMember,
      };
      const allMembers = [...site.siteRoles, newSiteRole];
      setSite({ ...site, siteRoles: allMembers });
      document.getElementById("add_member").close();
    }
  };

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

    if (result.status === 200) {
      setSite({
        ...site,
        siteRoles: site.siteRoles.filter((member) => member.userId !== userId),
      });
    } else {
      console.error("Failed to delete member:", result.message);
    }
  };

  const handleUpdateSite = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedAt = new Date().toISOString();
    const isActive = formData.get("isActive") === "on";
    const siteName = formData.get("siteName");
    const subDomain = formData.get("subDomain");
    const customDomain = formData.get("customDomain");
    const theme = formData.get("theme");

    const updateData = {
      updatedAt,
      isActive,
      name: siteName,
      domainName: `${subDomain}.cubite.io`,
      customDomain,
      themeName: theme,
    };

    const response = await fetch(`/api/site/${domainName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        siteId: site.id,
        updateData,
      }),
    });

    const result = await response.json();
    setUpdateSiteStatus(result.status);
    setUpdateSiteMessage(result.message);
    if (result.status === 200) {
      // Merge the updated site data with the existing site roles
      setSite({ ...result.site, siteRoles: site.siteRoles });
    } else {
      console.error("Failed to update site:", result.message);
    }
  };

  const handleDeleteSite = async () => {
    try {
      const response = await fetch(`/api/site/${domainName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domainName: site?.domainName }),
      });

      const result = await response.json();
      setDeleteSiteMessage(result.message);
      setDeleteSiteStatus(result.status);

      if (result.status === 200) {
        router.push("/admin/sites");
      } else {
        console.error("Failed to delete site:", result.message);
      }
    } catch (error) {
      console.error("Error deleting site:", error);
      setDeleteSiteMessage("An error occurred while deleting the site.");
      setDeleteSiteStatus(500);
    }
  };

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

  useEffect(() => {
    const roles = getRoles();
    setRoles(roles);
    async function fetchSiteData() {
      try {
        const response = await fetch(`/api/site/${domainName}`);
        const site = await response.json();
        setAdmins(site.data.admins);
        if (response.status === 200) {
          setSite(site.data);
        } else {
          throw new Error(site.message);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching site data.");
      } finally {
        setLoading(false);
      }
    }

    fetchSiteData();
  }, [domainName]);
  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!site) {
    return <p>No site data available.</p>;
  }

  return (
    <div className="">
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{site.name}</h1>
            <p className="mt-2">Manage {site.name} Settings</p>
          </div>
        </div>
      </div>
      <div className="border-b mb-24 ">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <form onSubmit={handleUpdateSite} className="p-6 md:p-8">
        <div role="tablist" className="tabs tabs-bordered tabs-lg">
          <input
            type="radio"
            name="sites_tabs"
            role="tab"
            className="tab"
            aria-label="Configs"
            defaultChecked
          />
          <div role="tabpanel" className="tab-content py-10">
            <div className="space-y-12">
              <div className="border-b pb-12">
                <h2 className="font-semibold leading-7 text-lg">
                  Site Information
                </h2>
                {updateSiteStatus === 200 && updateSiteMessage && (
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
                    <span>{updateSiteMessage}</span>
                  </div>
                )}
                {updateSiteStatus !== 200 && updateSiteMessage && (
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
                    <span>{updateSiteMessage}</span>
                  </div>
                )}
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="form-control w-full max-w-full">
                      <div className="label">
                        <span className="label-text">Creation Date</span>
                      </div>
                      <textarea
                        name="createdAt"
                        id="createdAt"
                        defaultValue={site.createdAt ? site.createdAt : ""}
                        readOnly
                        className="textarea textarea-bordered "
                      />
                      <div className="label">
                        <span className="label-text-alt">
                          When Site got created
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="form-control w-full max-w-full">
                      <div className="label">
                        <span className="label-text">Update Date</span>
                      </div>
                      <textarea
                        name="updatedAt"
                        id="updatedAt"
                        defaultValue={site.updatedAt ? site.updatedAt : ""}
                        readOnly
                        className="textarea textarea-bordered"
                      />
                      <div className="label">
                        <span className="label-text-alt">
                          When Site got updated
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Site Name</span>
                      </div>
                      <input
                        type="text"
                        name="siteName"
                        id="siteName"
                        defaultValue={site.name}
                        placeholder="Acme LMS"
                        className="input input-bordered w-full max-w-xs"
                      />
                      <div className="label">
                        <span className="label-text-alt">
                          Name to show in Dashboard
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="sm:col-span-2">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">Subdomain</span>
                        </div>
                        <div className="relative flex">
                          <input
                            type="text"
                            name="subDomain"
                            id="subDomain"
                            defaultValue={
                              site.domainName.split(".cubite.io")[0]
                            }
                            className="input input-bordered w-full rounded-r-none"
                          />
                          <span className="inline-flex items-center px-3 bg-gray-200 text-gray-500 border border-l-0 border-gray-300 rounded-r-md">
                            .cubite.io
                          </span>
                        </div>
                        <div className="label">
                          <span className="label-text-alt">
                            Subdomain for your site
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Custom Domain</span>
                      </div>
                      <input
                        type="text"
                        name="customDomain"
                        id="customDomain"
                        defaultValue={
                          site.customDomain ? site.customDomain : "example.com"
                        }
                        className="input input-bordered w-full max-w-xs"
                      />
                      <div className="label">
                        <span className="label-text-alt">
                          Enter custom domain, if you have
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Theme</span>
                      </div>
                      <select
                        name="theme"
                        required
                        className="select select-bordered"
                        defaultValue={site.themeName}
                      >
                        <option value="lofi">Lofi</option>
                        <option value="winter">Winter</option>
                        <option value="dark">Dark</option>
                        <option value="luxury">Luxury</option>
                        <option value="forest">Forest</option>
                      </select>
                    </label>
                  </div>
                  <div className="sm:col-span-2 pt-4">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Is Active</span>
                      </div>
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        className="toggle"
                        defaultChecked={site.isActive}
                      />
                    </label>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="submit" className="btn btn-primary px-8">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input
            type="radio"
            name="sites_tabs"
            role="tab"
            className="tab"
            aria-label="Features"
          />
          <div role="tabpanel" className="tab-content py-10"></div>

          <input
            type="radio"
            name="sites_tabs"
            role="tab"
            className="tab"
            aria-label="Certificates"
          />
          <div role="tabpanel" className="tab-content py-10"></div>
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
                  onClick={() =>
                    document.getElementById("add_admin").showModal()
                  }
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
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
                        <td>
                          {member.user.image ? (
                            <img
                              src={member.user.image}
                              alt={member.user.name}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white">
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
          <input
            type="radio"
            name="sites_tabs"
            role="tab"
            className="tab"
            aria-label="Danger"
          />
          <div role="tabpanel" className="tab-content py-10">
            <p>
              Deleting a site will remove all the site related data and users.
              You can also deactivate a site instead of delete it.
            </p>
            <div className="mt-6  gap-x-6">
              <button
                className="btn btn-outline btn-error mt-4"
                onClick={handleDeleteSite}
              >
                <TrashIcon className="h-5 w-6" aria-hidden="true" />
                Delete {site.name}
              </button>
            </div>
          </div>
        </div>
      </form>
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
    </div>
  );
};

export default SitePage;
