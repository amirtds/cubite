"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import NavigationLinks from "@/app/components/NavigationLinks";

interface Site {
  id: string;
  createdAt: string;
  updatedAt: string;
  logo?: string;
  headerLinks?: { text: string; type: string; url: string }[];
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

function SiteLayoutHeader({ site }: { site: Site }) {
  const [logo, setLogo] = useState(site.logo || "");
  const [headerLinks, setHeaderLinks] = useState(
    site.layout?.header?.headerLinks || [{ text: "", type: "internal", url: "" }]
  );
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [navigationLinksStatus, setNavigationLinksStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSiteLogo = async (imageSrc: string) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      setLogo(imageSrc);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteId: site.id,
            updateData: {
              layout: {
                ...site.layout,
                header: {
                  ...site.layout?.header,
                  logo: imageSrc,
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Logo updated successfully",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to update logo",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error updating logo",
      });
    } finally {
      setIsUpdating(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 3000);
    }
  };

  const handleHeaderLinks = async (
    links: { text: string; type: string; url: string }[]
  ) => {
    setHeaderLinks(links);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
          updateData: {
            layout: {
              ...site.layout,
              header: {
                ...site.layout?.header,
                headerLinks: links,
              },
            },
          },
        }),
      }
    );
  };

  return (
    <div className="collapse collapse-arrow bg-base-200 my-2">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="collapse-title text-xl font-semibold">Header</div>
      <div className="collapse-content mx-4">
        <div className="">
          <h3 className="font-medium my-2 mb-8">
            Logo
            {status.type === "success" && (
              <span className="text-xs text-green-600 ml-4">
                Logo updated successfully
              </span>
            )}
            {status.type === "error" && (
              <span className="text-xs text-red-600 ml-4">
                Error updating logo
              </span>
            )}
          </h3>
          <div className="mx-4">
            <CldUploadWidget
              uploadPreset="dtskghsx"
              options={{
                multiple: false,
                cropping: true,
              }}
              onSuccess={(results: any) => {
                if (results?.info?.public_id) {
                  handleSiteLogo(results.info.public_id);
                }
              }}
            >
              {({ open }) => (
                <div className="w-16">
                  <CldImage
                    width={250}
                    height={250}
                    className={`rounded-md ${isUpdating ? 'opacity-50' : ''}`}
                    src={logo ? logo : "courseCovers/600x400_er61hk"}
                    onClick={() => !isUpdating && open()}
                    alt="Site logo"
                  />
                  {isUpdating && (
                    <div className="text-xs text-gray-500 mt-1">Updating...</div>
                  )}
                </div>
              )}
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
  );
}

export default SiteLayoutHeader;
