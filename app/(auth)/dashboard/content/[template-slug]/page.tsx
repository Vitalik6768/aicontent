'use client'; // Ensure this is a client-side component

import React, { useState, useEffect } from 'react';
import FormSection from '../_components/FormSection';
import OutputSection from '../_components/OutputSection';
import { TEMPLATE } from '../../_components/TemplateListSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { chatSession } from '@/utils/AImodel';
import { AIOutput } from '@/utils/schema';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

interface PROPS {
    params: {
        'template-slug': string;
    };
}

function CreateNewContent(props: PROPS) {
    const [selectedTemplate, setSelectedTemplate] = useState<TEMPLATE | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [aiOutput, setAioutput] = useState<string>('');
    const { user } = useUser();

    // Fetch the template data based on the 'template-slug' prop from the API route
    useEffect(() => {
        const fetchTemplateData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/test'); // Update with your actual API route
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: TEMPLATE[] = await response.json();
                const template = data.find(item => item.slug === props.params['template-slug']);
                setSelectedTemplate(template);


            } catch (error) {
                console.error('Error fetching template:', error);
            }

        };

        fetchTemplateData();
    }, [props.params['template-slug']]);

    const generateAiContent = async (formData: any) => {
        setLoading(true);

        const SelectedPrompt = selectedTemplate?.aiPrompt;
        const FinalAiPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;
        const result = await chatSession.sendMessage(FinalAiPrompt);

        setAioutput(result.response.candidates[0].content.parts[0].text);
        await saveInDb(formData, selectedTemplate?.slug, result.response.candidates[0].content.parts[0].text);
        setLoading(false);
    };

    const saveInDb = async (formData: any, slug: any, aiRespo: string) => {
        const result = await db.insert(AIOutput).values({
            formData: formData,
            templateSlug: slug,
            aiResponse: aiRespo,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD/MM/YYYY'),
        });

        console.log(result);
    };

    return (
        <div>
            <div className='ml-5 mt-5'>
                <Link href={'/dashboard'}>
                    <Button><ArrowLeft /></Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 py-5">
                
                
                <FormSection selectedTemplate={selectedTemplate} userFormInput={(v: any) => generateAiContent(v)} loading={loading} />
                <div className='col-span-2'>
                    <OutputSection aiOutput={aiOutput} />
                </div>
            </div>
        </div>
    );
}

export default CreateNewContent;