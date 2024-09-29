import React, { useEffect, useState } from 'react';
import TemplateCard from './TemplateCard';
import { TempSelect } from './TempSelect';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk
import { Skeleton } from "@/components/ui/skeleton";


export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category: string;
  slug: string;
  aiPrompt: string;
  form?: FORM[];
  createdAt?: string;
  createdBy?: string;
  id: number;
  authorId: string;
  image: string;
  isowner: boolean;
}

export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
  type: string;
  value: string;
}

function TemplateListSection({ userSearchInput }: any) {
  const { user, isLoaded } = useUser(); // Get the current Clerk user and the loading state
  const [templateList, setTemplateList] = useState<TEMPLATE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const onComponentSelectTemp = (componentName: string) => {
    switch (componentName) {
      case 'all':
        getAllTemplates();
        break;
      case 'my':
        if (user?.primaryEmailAddress?.emailAddress) {
          getMyTemplates(user.primaryEmailAddress.emailAddress); // Pass the user's email
        }
        break;
      default:
        break;
    }
  };

  const getAllTemplates = async () => {
    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const response = await fetch(`/api/template`);
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

  const getMyTemplates = async (userId: string) => {
    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const response = await fetch(`/api/mytemp?userId=${userId}`); // Passing userId as a query parameter
      if (!response.ok) {
        throw new Error('No templates');
      }
      const data = await response.json();
      setTemplateList(data.templates);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (user?.primaryEmailAddress?.emailAddress) {
        getMyTemplates(user.primaryEmailAddress.emailAddress);
      } else {
        getAllTemplates(); // Fetch all templates if the user is not authenticated
      }
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return <div className="flex flex-col space-y-3 mt-14 ml-6">
      <Skeleton className="h-[115px] w-[300px] rounded-xl" />

    </div>
      ;
  }

  if (error) {
    return <>

      <TempSelect onComponentSelect={onComponentSelectTemp} />
      <div className="text-red-500 text-center">Error: {error}</div>;
    </>
  }

  return (
    <>
      <TempSelect onComponentSelect={onComponentSelectTemp} />
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 p-10'>
        {templateList.map((item: TEMPLATE) => (
          <TemplateCard key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}

export default TemplateListSection;