"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import EmptyState from "@/app/components/admin/EmptyState";
import PageHeader from "@/app/components/admin/PageHeader";

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  isOpenedxSite: boolean;
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

const Sites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { status, data: session } = useSession();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch(`/api/site/mysites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: session?.user.email,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setSites(result.sites);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch sites.");
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated" && session) {
      fetchSites();
    }
  }, [session, status]);

  if (loading) {
    return (
      <div>
        <div className="flex-1 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sites</h1>
              <p className="mt-2">
                In the following you can see all the sites you can manage.
              </p>
            </div>
          </div>
        </div>
        <div className="border-b mb-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Sites"
        description="In the following you can see all the sites you can manage."
        showButton={sites.length > 0}
        buttonText="Create a Site"
        buttonLink="/admin/sites/new"
        
      />
      {!error ? (
        sites.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
            {sites.map((site) => (
              <div key={site.id} className="border-2">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium capitalize mb-2">
                        {site.name} <span className="text-xs text-info normal-case">{site.isOpenedxSite ? " | Open edX Site" : ""}</span>
                      </h3>
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
                    {site.isActive ? (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-ping" />
                        <span className="text-sm font-medium text-green-500">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-red-500">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      className="inline-flex items-center btn btn-outline"
                      href={`/admin/sites/${site.domainName}`}
                    >
                      <Cog6ToothIcon className="h-6 w-6" />
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No sites found"
            description="You don't have any site that you can manage."
            buttonText="Create a Site"
            buttonLink="/admin/sites/new"
          />
        )
      ) : (
        "No site"
      )}
    </>
  );
};

export default Sites;
