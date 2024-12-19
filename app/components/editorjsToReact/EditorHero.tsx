import React from "react";
import Link from "next/link";
interface Props {
  data: any;
}

const EditorHero = ({ data }: Props) => {
  return (
        <div className={`relative w-screen -mx-[50vw] left-[50%] right-[50%] ${data.backgroundImage ? 'bg-cover bg-center' : ''}`} style={data.backgroundImage ? {backgroundImage: `url(https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${data.backgroundImage}?_a=BAVCluDW0)`} : {}}>
            {data.backgroundImage && <div className="absolute inset-0 bg-base-200/80"></div>}
            <div className="flex flex-col gap-4 p-8 py-32 relative z-10 col-span-full mx-auto max-w-7xl">
                {data.title && <p className="text-5xl font-bold mb-4">{data.title}</p>}
                {data.description && <p className="my-4 antialiased tracking-wide lg:w-1/2 w-full">{data.description}</p>}
                <p className="text-2xl font-bold">Hello, Dream College.</p>
                <p className="text-2xl font-bold">Hello, Dream Score.</p>
                {data.buttonUrl && data.buttonText && <Link href={data.buttonUrl} className="btn btn-primary !no-underline w-36 mt-4">{data.buttonText}</Link>}
            </div>
        </div>
  )
};

export default EditorHero;
