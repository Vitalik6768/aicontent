import { Search } from 'lucide-react';
import React from 'react';
import UserIcon from './UserIcon';

function Header() {
    return (
        <div className='p-5 shadow-sm border-b-2 flex justify-between items-center bg-white'>
            <div className=''>
                
                {/* <Search />
                <input className='outline-none' type="text" placeholder='Search...' /> */}
            </div>


            <div className='flex items-center gap-4'>
                <UserIcon/>
                
            </div>
        </div>
    );
}

export default Header;
