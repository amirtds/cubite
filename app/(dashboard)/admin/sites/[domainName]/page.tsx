"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { getRoles } from "@/app/utils/getRoles";
import { useAlert } from "@/app/utils/useAlert";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import NavigationLinks from "@/app/components/NavigationLinks";
import RegistrationFields from "@/app/components/RegistrationFields";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import MultiSelect from "@/app/components/MultiSelect";
import LiftedTab from "@/app/components/admin/sites/LiftedTab";
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
  languages: string[];
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
  const [isActive, setIsActive] = useState<Boolean>(false);
  const [logo, setLogo] = useState<String>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [admins, setAdmins] = useState<User[]>([]);
  const [roles, setRoles] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [availabelLanguages, setAvailabelLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [theme, setTheme] = useState("");
  const [headerLinks, setHeaderLinks] = useState([
    { text: "", type: "internal", url: "" },
  ]);
  const [footerLinks, setFooterLinks] = useState([
    { text: "", type: "internal", url: "" },
  ]);
  const [extraRegistrationFields, setExtraRegistrationFields] = useState([
    { text: "", type: "text", required: false },
  ]);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [googleTagManager, setGoogleTagManager] = useState("");
  const [googleAnalytics, setGoogleAnalytics] = useState("");
  const [openEdXURL, setOpenEdXURL] = useState<string>('');
  const [openEdxCourses, setOpenEdxCourses] = useState<any[]>([]);

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
  const {
    message: openEdXMessage,
    status: openEdXStatus,
    setMessage: setOpenEdXMessage,
    setStatus: setOpenEdXStatus,
  } = useAlert();
  const {
    message: syncCoursesMessage,
    status: syncCoursesStatus,
    setMessage: setSyncCoursesMessage,
    setStatus: setSyncCoursesStatus,
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

  const handleIsActive = (e) => {
    setIsActive(e.target.checked);
  };

  const handleSiteLogo = (imageSrc) => {
    setLogo(imageSrc);
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

  const handleSiteName = (e) => {
    setSiteName(e.target.value);
  };

  const handleSubDomain = (e) => {
    setSubDomain(e.target.value);
  };

  const handleCustomDomain = (e) => {
    setCustomDomain(e.target.value);
  };

  const handleLanguagesChange = (selectedLanguages) => {
    setLanguages(selectedLanguages);
  };

  const handleThemeSelect = (e) => {
    setTheme(e.target.value);
  };

  const handleGoogleAnalytics = (e) => {
    setGoogleAnalytics(e.target.value);
  };

  const handleGoogleTagManager = (e) => {
    setGoogleTagManager(e.target.value);
  };

  const handleUpdateSite = async (e) => {
    e.preventDefault();
    const updatedAt = new Date().toISOString();
    // handle layout update
    const layout = {
      header: {
        headerLinks,
      },
      footer: {
        footerLinks,
        copyrightText,
        socialMedia: {
          facebook: facebookUrl,
          tiktok: tiktokUrl,
          instagram: instagramUrl,
          youtube: youtubeUrl,
          x: xUrl,
        },
      },
    };
    const updateData = {
      updatedAt,
      isActive,
      logo,
      name: siteName,
      domainName: `${subDomain}${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
      customDomain,
      languages,
      themeName: theme,
      layout,
      extraRegistrationFields,
      googleAnalytics,
      googleTagManager,
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

  const handleHeaderLinks = (links) => {
    setHeaderLinks(links);
  };

  const handleFooterLinks = (links) => {
    setFooterLinks(links);
  };

  const handleExtraRegistrationFields = (fields) => {
    setExtraRegistrationFields(fields);
  };

  const handleFacebookURL = (e) => {
    setFacebookUrl(e.target.value);
  };

  const handleInstagramURL = (e) => {
    setInstagramUrl(e.target.value);
  };

  const handleTiktokURL = (e) => {
    setTiktokUrl(e.target.value);
  };

  const handleYoutubeURL = (e) => {
    setYoutubeUrl(e.target.value);
  };

  const handleXURL = (e) => {
    setXUrl(e.target.value);
  };

  const handleCopyright = (e) => {
    setCopyrightText(e.target.value);
  };

  const handleOpenEdXURL = (e) => {
    try {
      const url = e.target.value;
      if (!url) {
        setOpenEdXMessage("URL is required");
        setOpenEdXStatus(400);
        return;
      }

      if (!url.includes("http://") && !url.includes("https://")) {
        setOpenEdXURL("https://" + url);
        setOpenEdXMessage("Protocol added to URL");
        setOpenEdXStatus(200);
      } else {
        setOpenEdXURL(url);
        setOpenEdXMessage("URL updated successfully");
        setOpenEdXStatus(200);
      }
    } catch (error) {
      setOpenEdXMessage("Invalid URL format");
      setOpenEdXStatus(400);
    }
  };

  const handleSyncCourses = async () => {
    try {
      if (!openEdXURL) {
        setSyncCoursesMessage("OpenEdX URL is required");
        setSyncCoursesStatus(400);
        return;
      }

      if (!site?.id) {
        setSyncCoursesMessage("Site ID is required");
        setSyncCoursesStatus(400);
        return;
      }

      // Encode the URL parameters
      const encodedUrl = encodeURIComponent(openEdXURL);
      const encodedSiteId = encodeURIComponent(site.id);

      const response = await fetch(
        `/api/upsertOpenedxCourses?openedxUrl=${encodedUrl}&siteId=${encodedSiteId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setOpenEdxCourses(data.result.results || []);
        setSyncCoursesMessage(
          `${data.result.message}`
        );
        setSyncCoursesStatus(200);
      } else {
        setSyncCoursesMessage(data.message || "Failed to sync courses");
        setSyncCoursesStatus(data.status || 500);
      }
    } catch (error) {
      console.error("Error syncing courses:", error);
      setSyncCoursesMessage(`Error syncing courses: ${error.message}`);
      setSyncCoursesStatus(500);
    }
  };

  useEffect(() => {
    const roles = getRoles();
    setRoles(roles);
    async function fetchAvailableLanguages() {
      const response = await fetch("/api/i8n", {
        cache: "no-store",
      });
      const data = await response.json();
      setAvailabelLanguages(data.languages);
    }
    fetchAvailableLanguages();
    async function fetchSiteData() {
      try {
        const response = await fetch(`/api/site/${domainName}`, {
          cache: "no-store",
        });
        if (response.status === 200) {
          const site = await response.json();
          setAdmins(site.data.admins);
          setSite(site.data);
          setLogo(site.data.logo);
          setSiteName(site.data.name);
          setSubDomain(
            site.data.domainName.split(process.env.NEXT_PUBLIC_MAIN_DOMAIN)[0]
          );
          setCustomDomain(site.data.customDomain);
          setLanguages(site.data.languages);
          setTheme(site.data.themeName);
          setIsActive(site.data.isActive);
          setExtraRegistrationFields(site.data.extraRegistrationFields);
          if (site.data.layout) {
            setHeaderLinks(site.data.layout.header.headerLinks);
            setFooterLinks(site.data.layout.footer.footerLinks);
            setFacebookUrl(site.data.layout.footer.socialMedia.facebook);
            setYoutubeUrl(site.data.layout.footer.socialMedia.youtube);
            setInstagramUrl(site.data.layout.footer.socialMedia.instagram);
            setXUrl(site.data.layout.footer.socialMedia.x);
            setTiktokUrl(site.data.layout.footer.socialMedia.tiktok);
            setCopyrightText(site.data.layout.footer.copyrightText);
          }
          site.data.googleAnalytics &&
            setGoogleAnalytics(site.data.googleAnalytics);
          site.data.googleTagManager &&
            setGoogleAnalytics(site.data.googleTagManager);
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
            <h1 className="text-2xl font-bold mb-2">{site.name}</h1>
            <div className="form-control w-52 mb-4">
              <label className="cursor-pointer label">
                <span className="label-text font-medium text-lg">
                  Is Active
                </span>
                <input
                  className="toggle toggle-secondary"
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  defaultChecked={site.isActive}
                  onChange={handleIsActive}
                />
              </label>
            </div>

            <p className="text-sm text-gray-500">
              Created at {site?.createdAt && formatDateTime(site?.createdAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated at {site?.updatedAt && formatDateTime(site?.updatedAt)}
            </p>
            <a
              className="text-sm text-secondary link"
              href={`https://${site.domainName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.domainName}
            </a>
            {process.env.NODE_ENV === "development" && (
              <div>
                <a
                  className="text-sm text-ghost link"
                  href={`http://${
                    site.domainName.split(
                      `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
                    )[0]
                  }.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${
                    site.domainName.split(
                      `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
                    )[0]
                  }.localhost:3000`}
                </a>
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="btn btn-primary px-8"
              onClick={handleUpdateSite}
            >
              Save
            </button>
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <div className="border-b mb-12 ">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <div className="p-6 md:p-8">
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
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                        onChange={handleSiteName}
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
                            onChange={handleSubDomain}
                            defaultValue={
                              site.domainName.split(
                                `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
                              )[0]
                            }
                            className="input input-bordered w-full rounded-r-none"
                          />
                          <span className="inline-flex items-center px-3 bg-gray-200 text-gray-500 border border-l-0 border-gray-300 rounded-r-md">
                            .{process.env.NEXT_PUBLIC_MAIN_DOMAIN}
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
                        onChange={handleCustomDomain}
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
                      <MultiSelect
                        title="Languages"
                        preSelectedOptions={languages}
                        options={availabelLanguages}
                        onChange={handleLanguagesChange}
                        isRequired
                      />
                    </label>
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
            aria-label="Layout"
          />
          <div role="tabpanel" className="tab-content py-10">
            <div className="collapse collapse-arrow bg-base-200 my-2">
              <input type="radio" name="my-accordion-2" defaultChecked />
              <div className="collapse-title text-xl font-semibold">Header</div>
              <div className="collapse-content mx-4">
                <div className="">
                  <h3 className="font-medium my-2 mb-8">Logo</h3>
                  <div className="mx-4">
                    <CldUploadWidget
                      uploadPreset="dtskghsx"
                      options={{
                        multiple: false,
                        cropping: true,
                      }}
                      onSuccess={(results, options) => {
                        handleSiteLogo(results.info?.public_id);
                      }}
                    >
                      {({ open }) => {
                        return (
                          <div className="w-16">
                            <CldImage
                              width={250}
                              height={250}
                              className="rounded-md"
                              src={logo ? logo : "courseCovers/600x400_er61hk"}
                              onClick={() => open()}
                              alt="Description of my image"
                            />
                          </div>
                        );
                      }}
                    </CldUploadWidget>
                  </div>
                </div>
                <div className="divider"></div>

                <NavigationLinks
                  title={"Links"}
                  onLinksChange={handleHeaderLinks}
                  existingLink={headerLinks}
                />
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 my-2">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title text-xl font-semibold">Footer</div>
              <div className="collapse-content mx-4">
                <NavigationLinks
                  title={"Links"}
                  onLinksChange={handleFooterLinks}
                  existingLink={footerLinks}
                />
                <div className="divider"></div>

                <div>
                  <h3 className="font-medium my-2">Social Media</h3>
                  <div className="overflow-x-auto">
                    <table className="table">
                      {/* head */}
                      <thead></thead>
                      <tbody>
                        {/* row 1 */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <FaFacebookF className="w-6 h-6" />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Facebook URL"
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleFacebookURL}
                              defaultValue={facebookUrl ? facebookUrl : ""}
                            />
                          </td>
                        </tr>
                        {/* row 1 */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <FaTiktok className="w-6 h-6" />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="TikTok URL"
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleTiktokURL}
                              defaultValue={tiktokUrl ? tiktokUrl : ""}
                            />
                          </td>
                        </tr>
                        {/* row 1 */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <IoLogoYoutube className="w-6 h-6" />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Youtube URL"
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleYoutubeURL}
                              defaultValue={youtubeUrl ? youtubeUrl : ""}
                            />
                          </td>
                        </tr>
                        {/* row 1 */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <BsInstagram className="w-6 h-6" />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Instagram URL"
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleInstagramURL}
                              defaultValue={instagramUrl ? instagramUrl : ""}
                            />
                          </td>
                        </tr>
                        {/* row 1 */}
                        <tr>
                          <td>
                            <div className="flex items-center gap-3">
                              <BsTwitterX className="w-6 h-6" />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="X URL"
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleXURL}
                              defaultValue={xUrl ? xUrl : ""}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="font-medium my-2 mb-6">Copyright Notice</h3>
                  <input
                    type="text"
                    placeholder="Copyright © 2024 Cubite Technologies. All rights reserved."
                    className="input input-bordered w-full max-w-lg"
                    onChange={handleCopyright}
                    defaultValue={copyrightText ? copyrightText : ""}
                  />
                </div>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 my-2">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title text-xl font-semibold">Theme</div>
              <div className="collapse-content">
                <div className="m-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Theme Name</span>
                      </div>
                      <select
                        name="theme"
                        required
                        className="select select-bordered"
                        defaultValue={site.themeName}
                        onChange={handleThemeSelect}
                      >
                        <option value="lofi">Lofi</option>
                        <option value="winter">Winter</option>
                        <option value="dark">Dark</option>
                        <option value="luxury">Luxury</option>
                        <option value="forest">Forest</option>
                        <option value="autumn">Autumn</option>
                      </select>
                    </label>
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
            aria-label="Authentication"
          />
          <div role="tabpanel" className="tab-content py-10">
            <div className="sm:col-span-6">
              <RegistrationFields
                title={"Extra Registration Fields"}
                onFieldChange={handleExtraRegistrationFields}
                existingFields={extraRegistrationFields}
              />
            </div>
          </div>
          <input
            type="radio"
            name="sites_tabs"
            role="tab"
            className="tab"
            aria-label="Integrations"
          />
          <div role="tabpanel" className="tab-content py-10">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Google Analytics ID</span>
                  </div>
                  <input
                    type="text"
                    name="googleAnalytics"
                    id="googleAnalytics"
                    defaultValue={site.googleAnalytics}
                    placeholder="UA-xxxxx"
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleGoogleAnalytics}
                  />
                  <div className="label">
                    <span className="label-text-alt"></span>
                  </div>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Google Tag Manager ID</span>
                  </div>
                  <input
                    type="text"
                    name="googleTagManager"
                    id="googleTagManager"
                    defaultValue={site.googleTagManager}
                    placeholder="GTM-xxxxx"
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleGoogleTagManager}
                  />
                  <div className="label">
                    <span className="label-text-alt"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>

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
          <LiftedTab tabName="Import and Export">
            <h3 className="text-2xl font-bold uppercase">Open edX</h3>
            <div className="mt-4 flex gap-x-2">
              {/* Display Sync Courses alert */}
              {syncCoursesMessage && (
                <div className={`sm:col-span-6 alert ${
                  syncCoursesStatus === 200 ? 'alert-success' : 'alert-error'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {syncCoursesStatus === 200 ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                  <span>{syncCoursesMessage}</span>
                </div>
              )}

              {/* Open edX URL input */}
              <div className="">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">
                      What is your existing Open edX site URL?
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="edx.org"
                    className="input input-bordered w-full max-w-xs"
                    name="openEdXURL"
                    onChange={handleOpenEdXURL}
                    value={openEdXURL || ''}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      Please make sure the site is accessible
                    </span>
                  </div>
                </label>
              </div>

              <div className="mt-5">
                <button
                  className={`btn btn-outline btn-primary mt-4 ${
                    !openEdXURL ? 'btn-disabled' : ''
                  }`}
                  onClick={handleSyncCourses}
                  disabled={!openEdXURL}
                >
                  Sync Courses
                </button>
              </div>
            </div>
          </LiftedTab>
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
            <div className="mt-6 gap-x-6">
              <button
                className="btn btn-outline btn-error mt-4"
                onClick={() =>
                  document.getElementById("delete_site_modal").showModal()
                }
              >
                <TrashIcon className="h-5 w-6" aria-hidden="true" />
                Delete {site.name}
              </button>
              <dialog id="delete_site_modal" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">Are you sure ?</h3>
                  <p className="py-4">
                    Click on Delete to remove site completely. If you don&apos;t
                    want to delete the site press ESC key or click on ✕ button.
                  </p>
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={handleDeleteSite}
                  >
                    Delete
                  </button>
                </div>
              </dialog>
            </div>
          </div>
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
