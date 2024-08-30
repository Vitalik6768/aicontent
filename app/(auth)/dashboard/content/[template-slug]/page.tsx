"use client"

import React from 'react';
import FormSection from '../_components/FormSection';
import OutputSection from '../_components/OutputSection';
import { TEMPLATE } from '../../_components/TemplateListSection';
import Templates from '@/app/(data)/Templates';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PROPS {
    params: {
        'template-slug': string;
    };
}



function CreateNewContent(props: PROPS) {


    const selectedTemplate: TEMPLATE | undefined = Templates?.find(
        (item) => item.slug === props.params['template-slug']
    );


    const generateAiContent = (formData: any) => {

    }

    return (
        <div>
            <div className='ml-5 mt-5'>

                <Link href={'/dashboard'}>
                    <Button><ArrowLeft /></Button>
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 py-5">
                <FormSection selectedTemplate={selectedTemplate} userFormInput={(v: any) => console.log(v)} />
                <div className='col-span-2'>
                    <OutputSection />

                </div>

            </div>
        </div>
    );
}

export default CreateNewContent;
