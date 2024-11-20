"use client";

import React, { useState } from "react";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { CldUploadWidget } from "next-cloudinary";
import NavigationLinks from "@/app/components/NavigationLinks";
import { CldImage } from "next-cloudinary";

function LayoutTab({ site }: { site: Site }) {
  const [logo, setLogo] = useState<String>("");
  const [theme, setTheme] = useState("");
  const [headerLinks, setHeaderLinks] = useState([
    { text: "", type: "internal", url: "" },
  ]);
  const [footerLinks, setFooterLinks] = useState([
    { text: "", type: "internal", url: "" },
  ]);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [copyrightText, setCopyrightText] = useState("");

  const handleSiteLogo = (imageSrc) => {
    setLogo(imageSrc);
  };
  const handleThemeSelect = (e) => {
    setTheme(e.target.value);
  };
  const handleHeaderLinks = (links) => {
    setHeaderLinks(links);
  };

  const handleFooterLinks = (links) => {
    setFooterLinks(links);
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

  return (
    <>
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
    </>
  );
}

export default LayoutTab;
