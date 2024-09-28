"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';

type TemplateDialogProps = {
    onSuccess: () => void;  // Callback function for successful save
    selectedComponents: Array<{ type: 'human' | 'bot'; value: string }>;
    aiPrompts: string;
};


export function TemplateDialog({ onSuccess, selectedComponents, aiPrompts }: TemplateDialogProps) {
    const [templateName, setTemplateName] = useState<string>("");
    const [templateDescription, setTemplateDescription] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const saveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        let botPrompt = '';


        for(let i of selectedComponents){
            if(i.type == "bot"){
                botPrompt = i.value
            }
        }
       
        if (!templateName.trim() || !templateDescription.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const templateData = {
            category: "ghjghj",
            icon: "icon",
            slug: templateName.replace(/\s+/g, '-'),
            desc: templateDescription,
            name: templateName,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            // createdAt: moment().format('DD/MM/YYYY'),
            components: selectedComponents,
            aiPrompt: botPrompt
        };

        
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateData),
            });
            const result = await response.json();
            console.log('Template saved successfully:', result);

            setIsSuccess(true);
            setTimeout(() => {
                setIsDialogOpen(false);
                setIsSuccess(false);
                onSuccess();  // Call the onSuccess callback to notify the parent component
            }, 2000);

        } catch (error) {
            console.error('Error saving template:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button type='button' className='w-full py-6 mt-6'>
                    Open Dialog
                    
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Enter Template Details</DialogTitle>
                <DialogDescription>Provide the name and description for your template.</DialogDescription>
                <div className='flex flex-col gap-4'>
                    <Input
                        placeholder="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />
                    
                    
                    <Textarea
                        placeholder="Template Description"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                    />
                    {isSuccess && <p className="text-green-600">Template saved successfully!</p>}
                </div>
                <DialogFooter>
                    <Button
                        onClick={saveTemplate}
                        className='w-full py-6 mt-6'
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Template'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}