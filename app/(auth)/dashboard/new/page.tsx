"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenuSelection } from './_components/DropdownMenuSelection';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Trash2, User } from 'lucide-react';
import { chatSession } from '@/utils/AImodel';
import { Aidialog } from './_components/Aidialog';
import { TemplateDialog } from './_components/TemplateDialog';  // Import the new component

type ComponentItem = {
    type: 'human' | 'bot';
    value: string;
};

const dummy: ComponentItem[] = [
    {
      type: "bot",
      value: "write 5 article ideas about"
    },
    {
      type: "human",
      value: "cars"
    }
  ];



function Page() {
    const [selectedComponents, setSelectedComponents] = useState<ComponentItem[]>(dummy);
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState<string>("");
    const [aiPrompts, setAiPrompts] = useState<string>("");

    const handleComponentSelection = (componentName: string) => {
        
        const componentType: 'human' | 'bot' = componentName === 'human' ? 'human' : 'bot';
        setSelectedComponents(prevSelectedComponents => [
            ...prevSelectedComponents,
            { type: componentType, value: '' },
        ]);
    };

    const handleInputChange = (index: number, newValue: string) => {

       
        setSelectedComponents(prevSelectedComponents =>
            prevSelectedComponents.map((item, i) =>
                i === index ? { ...item, value: newValue } : item
            )
        );
    };
    

    const handleDelete = (indexToRemove: number) => {
        setSelectedComponents(prevSelectedComponents =>
            prevSelectedComponents.filter((_, index) => index !== indexToRemove)
        );
    };


    
    const generateAiContent = async () => {
        try {
            setLoading(true);
            const finalAiPrompt = selectedComponents
                .map(item => `${item.type === 'human' ? 'User' : 'Bot'}: ${item.value}`)
                .join('\n');

            const result = await chatSession.sendMessage(finalAiPrompt);
            const aiOutput = result.response.candidates[0].content.parts[0].text;
            console.log(finalAiPrompt);

            setAiResult(aiOutput);
            setAiPrompts(prevAiPrompts => `${prevAiPrompts}${finalAiPrompt}\nBot: ${aiOutput}\n`);

        } catch (error) {
            console.error("Error generating AI content:", error);
        } finally {
            
            setLoading(false);
        }
    };

    const handleDialogSuccess = () => {
        // Logic to execute after the dialog is successfully closed (e.g., refresh data)
        console.log("Template saved successfully!");
    };

    return (
        <div className="grid grid-cols-2 p-5 py-5 gap-4">
            <div className='p-5 shadow-lg border rounded-md bg-white w-full'>
                <h2 className='font-bold text-2xl mb-4 text-primary'>
                    Create & Test New Template
                </h2>
                <form className='mt-6'>
                    {selectedComponents.map((item, index) => (
                        <div className='my-2 flex flex-col gap-2 mb-7' key={index}>
                            <div className="flex items-center gap-2">
                                {item.type === 'bot' ? (
                                    <Bot />
                                ) : item.type === 'human' ? (
                                    <User />
                                ) : null}
                                <Trash2
                                    className='ml-2 cursor-pointer hover:text-red-600'
                                    onClick={() => handleDelete(index)}
                                />
                            </div>
                            <div className='flex items-center gap-2'>
                                {item.type === 'human' ? (
                                    <Textarea
                                        name={`human-${index}`}
                                        required={true}
                                        value={item.value}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    />
                                ) : item.type === 'bot' ? (
                                    <Textarea
                                        name={`bot-${index}`}
                                        required={true}
                                        value={item.value}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    />
                                ) : null}
                            </div>
                        </div>
                    ))}

                    <div className='w-full flex justify-center mt-5'>
                        <DropdownMenuSelection onComponentSelect={handleComponentSelection} />
                    </div>

                    <TemplateDialog
                        onSuccess={handleDialogSuccess}
                        selectedComponents={selectedComponents}
                        aiPrompts={aiPrompts}
                    />
                </form>
            </div>

            <div className='flex flex-col p-5 shadow-lg border rounded-md bg-white'>
                <h2 className='font-bold text-2xl mb-4 text-primary'>
                    Summary
                </h2>
                <div className="flex-grow">
                    {selectedComponents.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {/* <strong>{item.type === 'human' ? 'User' : 'Bot'}:</strong> */}
                            <div>
                                {item.type === 'human' && <User />}
                                {item.type === 'bot' && <Bot />}
                            </div>
                            {item.value}
                        </div>
                    ))}
                </div>
                <div className='flex justify-between mt-auto'>
                    <Button
                        onClick={generateAiContent}
                        variant={'destructive'}
                        type='button'
                        className='w-[48%]'
                        disabled={loading}
                    >
                        {loading ? 'Running...' : 'Run Test'}
                    </Button>
                    <Aidialog aiResult={aiResult} />
                </div>
            </div>
        </div>
    );
}

export default Page;