import React from 'react'
import Link from "next/link";
interface Props {
  data: any;
}

function EditorCTANoImage({ data }: Props) {
  return (
    <div className={`relative w-screen -mx-[50vw] left-[50%] right-[50%] grid grid-cols-3 gap-4 p-8 ${data.hasBackgroundColour ? 'bg-base-200/80' : ''}`}>
        <div className="flex flex-col gap-4 p-8 py-32 relative z-10 col-span-full mx-auto max-w-7xl">
            {data.title && <p className="text-5xl font-bold mb-4">{data.title}</p>}
            {data.description && <p className="my-4 antialiased tracking-wide lg:w-1/2 w-full">{data.description}</p>}
            {data.buttonUrl && data.buttonText && <Link href={data.buttonUrl} className="btn btn-primary !no-underline w-fit mt-4 flex-grow">{data.buttonText}</Link>}
        </div>
</div>
  )
}

export default EditorCTANoImage