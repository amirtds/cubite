"use client";

import React, { useState, useEffect } from "react";
import Alert from "@/app/components/Alert";
import { z } from "zod";
import { signIn } from "next-auth/react";

interface Props {
  params: {
    domain: string;
  };
}

const Register = ({ params: { domain } }: Props) => {
  const [userObject, setUserObject] = useState({
    siteId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    extraInfo: {},
  });

  const [status, setStatus] = useState(0);
  const [message, setMessage] = useState([]);
  const [site, setSite] = useState({});
  const [extraRegistrationFields, setExtraRegistrationFields] = useState([]);

  useEffect(() => {
    async function getSites() {
      const response = await fetch(`/api/getSitesPublicData`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        const siteData = result.sites.find(
          (s) =>
            s.domainName.split(`.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`)[0] ===
            domain
        );
        setSite(siteData);
      }
    }
    getSites();
  }, [domain]);

  const schema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First Name should be at least 3 characters" }),
    lastName: z
      .string()
      .min(3, { message: "Last Name should be at least 3 characters" }),
    username: z
      .string()
      .min(3, { message: "Username should be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .max(32, { message: "Password should be at most 32 characters long" })
      .refine(
        (password) => {
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          return hasNumber && hasSpecialCharacter;
        },
        {
          message:
            "Password must contain at least one number and one special character",
        }
      ),
  });

  const handleUserObject = (e) => {
    setUserObject({
      ...userObject,
      [e.target.id]: e.target.value,
    });
  };

  const handleExtraInfo = (e) => {
    setUserObject({
      ...userObject,
      extraInfo: {
        ...userObject.extraInfo,
        [e.target.id]: e.target.value,
      },
    });
  };

  const handleCreateUser = async () => {
    userObject.siteId = site.id;
    const validation = schema.safeParse(userObject);
    if (!validation.success) {
      setStatus(400);
      setMessage(validation.error.issues.map((issue) => issue.message));
    } else {
      try {
        const response = await fetch("/api/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObject),
        });
        const result = await response.json();
        setStatus(result.status);
        setMessage([result.message]);
        if (result.status === 200 || result.status === 201) {
          const result = await signIn("credentials", {
            redirect: false,
            email: userObject.email,
            password: userObject.password,
          });
          // Redirect to index or another page on successful sign-in
          window.location.href = "/dashboard";

          // send welcome email
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              site,
              userFirstname: userObject.firstName,
              to: userObject.email,
              subject: `Welcome to ${site?.name}`,
            }),
          });
        }
      } catch (error) {
        setStatus(500);
        setMessage(["An error occurred while creating the user."]);
      }
    }
  };

  return (
    <>
      {status !== 0 && (
        <Alert
          status={status}
          message={
            <ul>
              {message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          }
          onClose={() => {
            setStatus(0);
            setMessage([]);
          }}
        />
      )}
      <div className="mx-auto max-w-md grid grid-cols-2 justify-items-center gap-4 my-32">
        <div className="col-span-2">
          <p className="text-center text-2xl font-semibold">
            Create an Account
          </p>
          <p className="text-center my-2">
            Please fill this form to create your account
          </p>
        </div>
        <label className="input input-bordered flex items-center gap-2 sm:col-span-2 md:col-span-1 w-full">
          <input
            type="text"
            className="grow"
            placeholder="First Name"
            name="firstName"
            id="firstName"
            value={userObject.firstName}
            onChange={handleUserObject}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 sm:col-span-2 md:col-span-1 w-full">
          <input
            type="text"
            className="grow"
            placeholder="Last Name"
            name="lastName"
            id="lastName"
            value={userObject.lastName}
            onChange={handleUserObject}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 col-span-2 w-full">
          <input
            type="text"
            className="grow"
            placeholder="Username"
            name="username"
            id="username"
            value={userObject.username}
            onChange={handleUserObject}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 col-span-2 w-full">
          <input
            type="email"
            className="grow"
            placeholder="Email"
            name="email"
            id="email"
            value={userObject.email}
            onChange={handleUserObject}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 col-span-2 w-full">
          <input
            type="password"
            className="grow"
            placeholder="Password"
            name="password"
            id="password"
            value={userObject.password}
            onChange={handleUserObject}
          />
        </label>
        {site &&
          site.extraRegistrationFields &&
          site.extraRegistrationFields.map((field) => (
            <label
              key={field.text}
              className="input input-bordered flex items-center gap-2 col-span-2 w-full"
            >
              <input
                type={field.type}
                className="grow"
                placeholder={field.text}
                name={field.text}
                id={field.text}
                required={field.required}
                onChange={handleExtraInfo}
              />
            </label>
          ))}
        <button
          className="btn btn-primary col-span-full w-full"
          onClick={handleCreateUser}
        >
          Register
        </button>
      </div>
    </>
  );
};

export default Register;
