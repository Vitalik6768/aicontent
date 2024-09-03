"use client"

import React from 'react'
import Image from 'next/image'
import { TEMPLATE } from './TemplateListSection'
import Link from 'next/link'
import { UserButton } from '@clerk/clerk-react'; // Import Clerk's UserButton component



function UserIcon() {
  return (
    <>
    <h2 className='bg-primary p1 rounded-full text-xs text-white px-2'>Join Membership</h2>
    <UserButton /> {/* Add the UserButton here */}
    </>

  )
}

export default UserIcon