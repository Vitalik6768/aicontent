"use client";

import React, { useEffect, useState } from 'react';
import { TEMPLATE } from '../../_components/TemplateListSection';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { DropdownMenuSelectionOptions } from './DropdownMenuSelectionOptions';
import { useRouter } from 'next/navigation';

// Random string generator function for unique field names
function generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

interface PROPS {
    selectedTemplate?: TEMPLATE;
    userFormInput: (data: Record<string, any>) => void;
    loading: boolean;
    templateId: any;
    isowner:boolean;
   
}

function FormSection({ selectedTemplate, userFormInput, loading, templateId, isowner}: PROPS) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    // const [owner, setOwner] = useState<boolean>(false); // Initialize as an empty string
    const router = useRouter();

    // Update owner state using useEffect


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        console.log(name);
    };

    const handleComponentSelection = (componentName: string) => {
        switch (componentName) {
            case 'delete':
                deleteTemplate(templateId);
                break;
            case 'add-to-favorite':
                addToFavorite(templateId);
                break;
        }
    };

    const addToFavorite = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/favorite?id=${id}`, {
                method: 'GET',
            });

            if (response.ok) {
                router.push('/dashboard'); // Redirect to dashboard
            } else {
                console.error('Failed to add to favorites');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteTemplate = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/template?id=${id}&owner=${isowner}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/dashboard'); // Redirect to dashboard
            } else {
                console.error('Failed to delete template');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        userFormInput(formData); // Pass formData to parent component
    };

    return (
        <div className="p-5 shadow-lg border  bg-white">
            <div className="flex justify-between">
                <h2 className="font-bold text-2xl mb-2 text-primary">{selectedTemplate?.name}</h2>
                <DropdownMenuSelectionOptions onComponentSelect={handleComponentSelection} isowner={isowner} />
            </div>
            <p className="text-gray-500 text-sm">{selectedTemplate?.desc}</p>

            <form onSubmit={onSubmit} className="mt-6">
                {selectedTemplate?.form?.map((item, index) => (
                    <div className="my-2 flex flex-col gap-2 mb-7" key={index}>
                        <label>{item.label}</label>
                        {item.type === 'human' ? (
                            <Input
                                name={item.name} // Use item.name for consistency
                                required={item?.required}
                                placeholder={`example prompt: ${item.value}`}
                                onChange={handleInputChange}
                            />
                        ) : item.type === 'textarea' ? (
                            <Textarea
                                name={item.name} // Use item.name for consistency
                                required={item?.required}
                                onChange={handleInputChange}
                            />
                        ) : null}
                    </div>
                ))}

                <Button type="submit" className="w-full py-6" disabled={loading}>
                    {loading && <Loader2Icon className="animate-spin" />}
                    Generate Content
                </Button>
            </form>
        </div>
    );
}

export default FormSection;