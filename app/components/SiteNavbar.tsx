"use client";

import React from "react";
import { Image } from "@/app/components/Image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BellIcon } from "@heroicons/react/24/outline";

interface Site {
  name: string;
  logo: string;
}

interface HeaderLinks {
  url: string;
  text: string;
  type: string;
}

interface Props {
  site: Site;
  headerLinks: HeaderLinks[];
}

const SiteNavbar = ({ site, headerLinks }: Props) => {
  const { status, data: session } = useSession();
  const renderAvatar = () => {
    if (session?.user?.image) {
      return (
        <img alt="Avatar" src={session.user.image} className="rounded-full" />
      );
    } else if (session?.user?.name) {
      const initial = session.user.name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white">
          {initial}
        </div>
      );
    } else {
      return <div className="w-10 h-10 rounded-full bg-gray-300"></div>;
    }
  };
  return (
    <div className="bg-base-200">
      <div className="navbar mx-auto max-w-7xl p-6 lg:px-8">
        <div className="navbar-start">
          <Link
            href={"/"}
            className="btn btn-ghost text-xl hover:bg-transparent"
          >
            <Image
              src={site.logo ? site.logo : "courseCovers/600x400_er61hk"}
              width={100}
              height={100}
              alt="test"
              sizes="100vw"
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {headerLinks.map((link) => {
              if (
                (link.url === "/auth/signin" ||
                  link.url === "/auth/register") &&
                session
              ) {
                return null;
              }
              return link.type === "internal" || link.type === "external" ? (
                <li key={link.url}>
                  <a href={link.url}>{link.text}</a>
                </li>
              ) : null;
            })}
          </ul>
        </div>
        <div className="navbar-end">
          {headerLinks.map((link) => {
            if (
              (link.url === "/auth/signin" || link.url === "/auth/register") &&
              session
            ) {
              return null;
            }
            return link.type === "neutral-button" ? (
              <a
                key={link.url}
                className="btn btn-ghost btn-outline mx-2"
                href={link.url}
              >
                {link.text}
              </a>
            ) : link.type === "primary-button" ? (
              <a
                key={link.url}
                className="btn btn-outline btn-primary mx-2"
                href={link.url}
              >
                {link.text}
              </a>
            ) : null;
          })}
          {session && (
            <>
              <button className="btn btn-ghost btn-circle mx-2">
                <div className="indicator">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </button>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="">
                  {renderAvatar()}
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link href={"/profile"} className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href={"/settings"}>Settings</Link>
                  </li>
                  <li>
                    <button onClick={() => signOut()}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteNavbar;
