"use client";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { createSiteAction } from "./actions";
import InputText from "@/app/components/InputText";
import Alert from "@/app/components/Alert";

const initialState = {
    status: 0,
    message: "",
    site: {
        id: "",
        siteName: "",
        subDomain: "",
        customDomain: "",
        theme: "",
        userEmail: "",
    },
  };

export default function CreateSiteForm() {
  const [state, formAction] = useFormState(createSiteAction, initialState);
  const { status, data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (state.status === 201) {
      router.push(`/admin/sites/${state.site.domainName}`);
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
    >
      <InputText
        label="Site Name"
        description="Name to show in Dashboard"
        placeholder="Acme LMS"
        name="siteName"
        id="siteName"
        required
      />
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
              <span className="label-text-alt">Subdomain for your site</span>
            </div>
          </label>
        </div>
      </div>
      <InputText
        label="Custom Domain"
        description="Custom domain for your site"
        placeholder="acme.com"
        name="customDomain"
        id="customDomain"
      />
      <InputText
        label="Site Admin"
        description="You will be added as the first admin of this site, you can add more users later."
        placeholder="admin@example.com"
        name="userEmail"
        id="userEmail"
        value={session?.user?.email || ""}
        readOnly
      />
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
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="submit" className="btn btn-primary px-8">
          Save
        </button>
      </div>
    </form>
  );
}
