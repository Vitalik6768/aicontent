import React, { useEffect, useState } from 'react';
import TemplateCard from './TemplateCard';
import { TempSelect } from './TempSelect';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk

export interface TEMPLATE {
  name: string,
  desc: string,
  icon: string,
  category: string,
  slug: string,
  aiPrompt: string,
  form?: FORM[],
  createdAt?: string,
  createdBy?: string,
  id: number,
  authorId:string,
  image:string,
  isowner:boolean
  
}

export interface FORM {
  label: string,
  field: string,
  name: string,
  required?: boolean,
  type: string,
  value: string
}

function TemplateListSection({ userSearchInput }: any) {
  const { user } = useUser(); // Get the current Clerk user
  const [templateList, setTemplateList] = useState<TEMPLATE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [owner, setowner] = useState("all");

  const onComponentSelectTemp = (componentName: string) => {
    switch (componentName) {
      case 'all':
        getAllTemplates();
        break;
      case 'my':
        if (user?.primaryEmailAddress?.emailAddress) {
          getMyTemplates(user.primaryEmailAddress.emailAddress); // Pass the user's email
        } // Pass the Clerk user ID to getMyTemplates
        break;
      default:
        console.log('Unknown component selected');
    }
  };

  const getAllTemplates = async () => {

    
    setLoading(true);
    console.log(process.env.API_ROUTE);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/template`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setTemplateList(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMyTemplates = async (userId: string | undefined) => {
    console.log('ok')
    if (!userId) {
      setError('User ID is required to fetch your templates');
      return;
    }


    
    
    setLoading(true);
    try {
      const response = await fetch(`/api/mytemp`); // Pass userId to the API
      if (!response.ok) {
        throw new Error('Failed to fetch your templates');
      }
      const data = await response.json();
      console.log(data.templates)
      
      setTemplateList(data.templates);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    getAllTemplates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  return (
    <>
      <TempSelect onComponentSelect={onComponentSelectTemp} />
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 p-10'>
        {templateList.map((item: TEMPLATE, index: number) => (
          <div key={index}>
            <TemplateCard {...item} />
          </div>
        ))}
      </div>
    </>
  );
}

export default TemplateListSection;
