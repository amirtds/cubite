"use client";

import { Site } from "@prisma/client";
import React, { useState } from "react";

function LoginForm({ site }: { site: Site }) {
  const [formTitle, setFormTitle] = useState(site?.loginForm?.title);
  const [formDescription, setFormDescription] = useState(
    site?.loginForm?.description
  );
  const [formButtonText, setFormButtonText] = useState(
    site?.loginForm?.buttonText
  );

  const handleFormTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
  };

  const handleFormDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormDescription(e.target.value);
  };

  const handleFormButtonTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormButtonText(e.target.value);
  };

  const handleUpdateForm = async () => {
    const result = await fetch(`/api/site/${site.domainName}/loginForm`, {
      method: "PUT",
      body: JSON.stringify({
        siteId: site.id,
        loginForm: { title: formTitle, description: formDescription, buttonText: formButtonText },
      }),
    });
  };

  return (
    <div className="w-full space-y-4 mb-8 border-2 border-dashed border-gray-100 p-4">
      <h3 className="font-medium">Login Form</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="form-control w-full min-w-xs">
            <div className="label">
              <span className="label-text">Form Title</span>
            </div>
            <input
              type="text"
              placeholder="Login to your account"
              className="input input-bordered w-full max-w-xs"
              onChange={handleFormTitleChange}
              onBlur={handleUpdateForm}
              value={formTitle}
            />
          </label>
        </div>
        <div className="col-span-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Form Description</span>
            </div>
            <input
              type="text"
              placeholder="Please fill this form to login to your account"
              className="input input-bordered w-full max-w-lg"
              onChange={handleFormDescriptionChange}
              onBlur={handleUpdateForm}
              value={formDescription}
            />
          </label>
        </div>
        <div className="col-span-1">
        <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Button Text</span>
            </div>
            <input
              type="text"
              placeholder="Login"
              className="input input-bordered w-full max-w-lg"
              onChange={handleFormButtonTextChange}
              onBlur={handleUpdateForm}
              value={formButtonText}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
