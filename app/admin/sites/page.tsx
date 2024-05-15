import React from "react";
import Link from "next/link";
import { getAdministratedSites } from "../../utils/getSitesAdmins";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/authOptions";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

const Sites = async () => {
  const session = await getServerSession(authOptions);
  const sites = await getAdministratedSites(session?.user?.email);

  return (
    <div>
      <div className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sites</h1>
            <p className="mt-2">
              In the following you can see all the sites you can manage.
            </p>
          </div>
          <Link href="/admin/sites/new" className="h-10 w-auto btn btn-primary">
            Create a Site
          </Link>
        </div>
      </div>
      <div className="border-b mb-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
        {sites.status === 200
          ? sites.sites.map((site) => (
              <div key={site.id} className="border-2">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium uppercase">
                        {site.name}
                      </h3>
                      <p className="text-sm">{site.domainName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-ping" />
                      <span className="text-sm font-medium text-green-500">
                        Active
                      </span>
                    </div>
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
            ))
          : "No site"}
      </div>
    </div>
  );
};

export default Sites;
