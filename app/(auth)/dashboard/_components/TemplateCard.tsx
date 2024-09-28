import React from 'react'
import Image from 'next/image'
import { TEMPLATE } from './TemplateListSection'
import Link from 'next/link'





function TemplateCard(item: TEMPLATE) {
  return (
    <Link href={`/dashboard/content/${item.slug}`} className="block">
      <div className="p-5 shadow-md rounded-md border bg-white flex items-center justify-between gap-3 hover:scale-105 transition-all">
        {/* Content Section */}
        <div className="flex-1  gap-3">

          {/* Created by Section */}
          <div className="flex justify-between gap-2 text-sm text-gray-600">

            <h2 className="font-medium text-lg">{item.name}</h2>
            <div className='flex items-center'>
              <span className='mr-3'>Created by</span>
              <Image
                src={item.image || '/default-image.png'} // Fallback to a default image if `item.image` is not available
                alt="creator's icon"
                width={30}   // Smaller size for the profile image
                height={30}  // Smaller size for the profile image
                className="rounded-full object-cover" // Makes the image round
              />
            </div>

          </div>
          <p className="text-gray-500 line-clamp-3">{item.desc}</p>
        </div>

      </div>
    </Link>
  );
}

export default TemplateCard;