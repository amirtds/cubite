"use client";

import React from "react";
import { Image } from "@/app/components/Image";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
        </div>
      </div>
    </div>
  );
};

export default SiteNavbar;
