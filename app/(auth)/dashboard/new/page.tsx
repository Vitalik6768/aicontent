"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenuSelection } from './_components/DropdownMenuSelection'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

function Page() {
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    const handleComponentSelection = (componentName: string) => {
        setSelectedComponents(prevSelectedComponents => {
            // Add the component name to the array without removing any items
            return [...prevSelectedComponents, componentName];
        });
        console.log(componentName)
    };

    const handleDelete = (indexToRemove: number) => {
        setSelectedComponents(prevSelectedComponents =>
            prevSelectedComponents.filter((_, index) => index !== indexToRemove)
        );
    };

    useEffect(() => {
        console.log(selectedComponents);
    }, [selectedComponents]);

    return (
        <div className='m-5'>
            <div className='p-5 shadow-lg border rounded-md bg-white w-[40%]'>
                <h2 className='font-bold text-2xl mb2 text-primary'>
                    Create & Test New Template
                </h2>
                <form className='mt-6'>

                    {selectedComponents.map((item, index) => (
                        <div className='my-2 flex flex-col gap-2 mb-7' key={index}>
                            <label>{item}</label>
                            <div className='flex items-center gap-2'>
                                {item === 'text' ? (
                                    <Input name={item} required={true} />
                                ) : item === 'textarea' ? (
                                    <Textarea name={item} required={true} />
                                ) : null}
                                <Trash2 className='ml-2 cursor-pointer hover:text-red-600' onClick={() => handleDelete(index)} />

                            </div>
                        </div>
                    ))}

                    <div className='w-full flex justify-center mt-5'>
                        <DropdownMenuSelection onComponentSelect={handleComponentSelection} />
                    </div>


                    <div className='my-2 flex flex-col gap-2 mb-7'>
                        <label></label>
                    </div>

                    <Button type='submit' className='w-full py-6'>
                        Create New Template
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Page;
