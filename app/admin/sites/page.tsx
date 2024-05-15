import React from "react";
import Link from "next/link";
import { getAdministratedSites } from "../../utils/getSitesAdmins";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/authOptions";

const Sites = async () => {
  const session = await getServerSession(authOptions);
  const sites = await getAdministratedSites(session?.user?.email);

  console.log(sites);
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

      {sites.status === 200
        ? sites.sites.map((site) => (
            <div key={sites.id} className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{sites.name}</h2>
                <p className="text-xl font-semibold">{site.domainName}</p>
                <p>Custom Domain: {site.customDomain}</p>
                <p>
                  Status:{" "}
                  {site.isActive ? (
                    <span>Active</span>
                  ) : (
                    <span>Deactivated</span>
                  )}
                </p>
                <div className="card-actions justify-end">
                  <Link
                    href={`/admin/sites/${site.domainName}`}
                    className="btn btn-outline btn-accent"
                  >
                    Go to the Site
                  </Link>
                </div>
              </div>
            </div>
          ))
        : "No site"}
    </div>
  );
};

export default Sites;
