"use client";

import React, { useEffect } from "react";
import { registerSite } from "./actions";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Alert from "@/app/components/Alert";

const initialState = {
  status: 0,
  message: "",
  siteName: "",
  subDomain: "",
  customDomain: "",
  theme: "",
  userEmail: "",
};

const SitesNew = () => {
  const { status, data: session } = useSession();
  const [state, formAction] = useFormState(registerSite, initialState);
  const router = useRouter();
  useEffect(() => {
    if (state.status === 201) {
      router.push(`/admin/sites/${state.site.domainName}`);
    }
  }, [state, router]);
  return (
    <div className="">
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create a New Site</h1>
            <p className="mt-2">
              Fill the following information to create a new site.
            </p>
          </div>
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <form action={formAction}>
        <Alert
          status={state.status}
          message={state.message}
          onClose={() => {
            (state.status = 0), (state.message = "");
          }}
        />
        <div className="space-y-12">
          <div className="border-b pb-12">
            <h2 className="font-semibold leading-7 text-lg">
              Site Information
            </h2>
            <p className="mt-1 text-sm leading-6">
              Please fill this information. This is basic info after creating
              the site you can provide more info.
            </p>
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
                        placeholder="acme"
                        className="input input-bordered w-full rounded-r-none"
                        required
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
                    placeholder="learning.ace.com"
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
                    <span className="label-text">Site Admin</span>
                  </div>
                  <input
                    type="text"
                    name="userEmail"
                    id="userEmail"
                    value={session?.user?.email || ""}
                    className="input input-bordered w-full max-w-xs"
                    readOnly
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      User who has full access to this site
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
                    defaultValue="winter"
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

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="submit" className="btn btn-primary px-8">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SitesNew;
