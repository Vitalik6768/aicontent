"use client";

import React, { useState } from 'react';
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
    userFormInput: any;
    loading: boolean;
    templateId: any;
}

function FormSection({ selectedTemplate, userFormInput, loading, templateId }: PROPS) {
    const [formData, setFormData] = useState<Record<string, any>>({}); // Initialize as an empty object
    const router = useRouter();

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value});
        console.log(name);
    };

    const handleComponentSelection = (componentName: string) => {
        switch (componentName) {
            case 'delete':
                deleteTemplate(templateId);
                break;
            case 'edit':
                console.log('edit');
                break;
            case 'share':
                console.log('share');
                break;
        }
    };

    const deleteTemplate = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/test?id=${id}`, {
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

    const onSubmit = (e: any) => {
        e.preventDefault();
        userFormInput(formData); // Pass formData to parent component
    };

    return (
        <div className="p-5 shadow-lg border rounded-md bg-white">
            <div className="flex justify-between">
                <h2 className="font-bold text-2xl mb2 text-primary">{selectedTemplate?.name}</h2>
                <DropdownMenuSelectionOptions onComponentSelect={handleComponentSelection} />
            </div>
            <p className="text-gray-500 text-sm">{selectedTemplate?.desc}</p>

            <form onSubmit={onSubmit} className="mt-6">
                {selectedTemplate?.form?.map((item, index) => (
                    <div className="my-2 flex flex-col gap-2 mb-7" key={index}>
                        <label>{item.label}</label>
                        {item.type === 'human' ? (
                            <Input
                                name={`${item.name}`} // Generate a random string for the name field
                                required={item?.required}
                                placeholder={`example prompt: ${item.value}`}
                                onChange={handleInputChange}
                            />
                        ) : item.type === 'textarea' ? (
                            <Textarea
                                name={generateRandomString()} // Generate a random string for the name field
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