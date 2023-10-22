import React from 'react'

function FeaturedSkeleton() {
  return (
    <div className=" animate-pulse grid grid-cols-8 gap-8 ">
      <div className="flex-grow bg-neutral-800 rounded-md col-span-8  h-[360px] md:h-[540px]  md:col-span-6"></div>
      <div className=" col-span-8 md:col-span-2">
        <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
        <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
        <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
        <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
      </div>
    </div>
  )
}

export default FeaturedSkeleton
