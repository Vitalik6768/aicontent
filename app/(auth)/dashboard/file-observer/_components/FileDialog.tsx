import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useUser } from '@clerk/nextjs';
import { useMutation } from "convex/react";
import { api } from '@/convex/_generated/api';

export function FileDialog() {
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDescription, setTemplateDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const createDocument = useMutation(api.documents.createDocument); 

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!templateName.trim() || !templateDescription.trim() || !selectedFile) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    setLoading(true);

    try {
      // Generate the upload URL from Convex
      const url = await generateUploadUrl();

      // Upload the file to the generated URL
      const uploadResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type,  // Use the file's MIME type
        },
        body: selectedFile, // Upload the file directly
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      // Extract the storageId from the response (ensure the backend returns it)
      const { storageId } = await uploadResponse.json();

      // Create a document with the template details and fileId (storageId)
      await createDocument({
        title: templateName,
        fileId: storageId,
      });

      console.log("Document created successfully!");

      // Set success state and close the dialog
      setIsSuccess(true);
      setLoading(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving template:', error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type='button' className='w-full py-6 mt-6'>
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Enter Template Details</DialogTitle>
        <DialogDescription>Provide the name, description, and file for your template.</DialogDescription>
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
          <input type="file" accept='.txt' onChange={handleFileChange} /> {/* File upload input */}
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