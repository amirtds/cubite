"use client";

import React, { useState } from "react";

function SiteLayoutTheme({ site }: { site: Site }) {
    const [theme, setTheme] = useState(site.themeName || "");

    const handleThemeSelect = async (e) => {
        setTheme(e.target.value);
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
                themeName: e.target.value,
              },
            }),
          }
        );
      };

  return (
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
              <option value="rmu">Rmu</option>
              <option value="ocean">Ocean</option>
            </select>
          </label>
        </div>
      </div>
      </div>
    </div>
  );
}

export default SiteLayoutTheme