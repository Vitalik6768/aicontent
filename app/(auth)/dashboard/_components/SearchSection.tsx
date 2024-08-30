import { Search } from 'lucide-react'
import React from 'react'

function SearchSection({onSearchInput}:any) {
  return (
    <div className='p10 bg-gradient-to-br from-purple-500 via-purple-700 to-blue-600 flex flex-col justify-center items-center'>
        <h2 className='text-3xl font-bold text-white'>Brows All Templates</h2>
        <p>What Would You Like To Create Today?</p>
        <div className='w-full flex justify-center  '>
            <div className='mb-6 flex gap-2 items-center p-2 border rounded-md bg-white my-5 '>
                <Search/>
                <input onChange={(event)=>onSearchInput(event.target.value)} className='bg-transparent w-full outline-none text-black' type='text' placeholder='Search'/>
            </div>
            
        </div>
      
    </div>
  )
}

export default SearchSection
