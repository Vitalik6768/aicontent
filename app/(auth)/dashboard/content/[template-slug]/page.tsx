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
        'id':number;
    };
}



function CreateNewContent(props: PROPS) {
    const [selectedTemplate, setSelectedTemplate] = useState<TEMPLATE | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [aiOutput, setAioutput] = useState<string>('');
    const [owner, setOwner] = useState<boolean>(false)
    const { user } = useUser();
   

    // Fetch the template data based on the 'template-slug' prop from the API route
    useEffect(() => {
        const fetchTemplateData = async () => {
           
            try {
                const response = await fetch(`/api/single-template?slug=${props.params['template-slug']}`); // Update with your actual API route
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                // console.log(data);
                const data: TEMPLATE = await response.json();
                // const template = data.find(item => item.slug === props.params['template-slug']);
                console.log(`this is data ${data}`)
                console.log(data)
                //Looking If Owner
                if(data?.authorId === user?.id){
                    setOwner(true)
                 }
          
                setSelectedTemplate(data);
                


            } catch (error) {
                console.error('Error fetching template:', error);
            }

        };

        fetchTemplateData();
    }, [user]);

    // [props.params['template-slug']

    const generateAiContent = async (formData: any) => {
        setLoading(true);
        
        const selectedPromptcom = selectedTemplate?.form;
        let FinalAiPrompt =""

        if (selectedTemplate && selectedPromptcom) {
            // Get the formData values in an array
            const formDataValues = Object.values(formData);
            let formDataIndex = 0;
    
            // Iterate over the form template
            for (let i of selectedPromptcom) {
                // Check if the type is 'bot'
                if (i.type === "bot") {
                    // Append the bot's value
                    FinalAiPrompt += i.value + " ";
    
                    // Append the next value from formData
                    if (formDataIndex < formDataValues.length) {
                        FinalAiPrompt += formDataValues[formDataIndex] + " ";
                        formDataIndex++; // Move to the next value in formData
                    }
                }
            }
        }
    
        console.log(FinalAiPrompt.trim());

        const result = await chatSession.sendMessage(FinalAiPrompt.trim());

        setAioutput(result.response.candidates[0].content.parts[0].text);
        await saveInDb(selectedTemplate?.slug, result.response.candidates[0].content.parts[0].text);
        setLoading(false);
        console.log(result.response.candidates[0].content.parts[0].text);
     };

    const saveInDb = async ( slug: any, aiRespo: string) => {
        const result = await db.insert(AIOutput).values({
            // formData: formData,
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

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 py-5">
                
                <FormSection selectedTemplate={selectedTemplate} isowner={owner} templateId={selectedTemplate?.id} userFormInput={(v: any) => generateAiContent(v)} loading={loading} />
                <div className='col-span-2'>
                    <OutputSection aiOutput={aiOutput} />
                </div>
            </div>
        </div>
    );
}

export default CreateNewContent;