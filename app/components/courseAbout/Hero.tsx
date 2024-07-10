"use client";

import React from "react";
import { CldImage } from "next-cloudinary";

const Hero = ({ coverImage, description, name }) => {
  return (
    <div className="min-h-48 relative isolate overflow-hidden">
      <CldImage
        fill
        src={coverImage}
        sizes="100vw"
        alt={name}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary opacity-70 -z-10"></div>

      <div className="flex flex-col px-12 py-36">
        <p className="text-4xl font-bold uppercase text-base-300">{name}</p>
        <p className="py-4 text-lg capitalize text-base-200">{description}</p>
      </div>
    </div>
  );
};

export default Hero;
