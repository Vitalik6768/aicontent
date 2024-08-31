"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'

function SideNav() {

    const MenuList = [
        {
            name: 'home',
            icon: Home,
            path: '/dashboard'
        },
        {
            name: 'history',
            icon: FileClock,
            path: '/dashboard/history'
        },
        {
            name: 'Billing',
            icon: WalletCards,
            path: '/dashboard/billing'
        },
        {
            name: 'Settings',
            icon: Settings,
            path: '/dashboard/settings'
        },
    ]

    const path=usePathname();
    useEffect(() =>{
        console.log(path);

    },[])


    return (
        <div className='h-screen p-5 shadow-sm border bg-white'>
            <div className="flex justify-center">
                <Image src={'/logo.svg'} alt='logo' width={100} height={100} />
            </div>
            <hr className='my-6 border'/>
            <div className='mt-3'>
                {MenuList.map((menu, index) => (
                    <div className={`flex gap-2 mb-2 p-3 hover:bg-primary
                     hover:text-white rounded-lg cursor-pointer
                     ${path==menu.path&&'bg-primary text-white'}
                     
                     `}
                    key={index}>
                        <menu.icon/>
                        <h2>{menu.name}</h2>
                    
                    </div>
                ))}
            </div>



        </div>
    )
}

export default SideNav