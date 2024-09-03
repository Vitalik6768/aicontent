import React, { useEffect, useState } from 'react';
import TemplateCard from './TemplateCard';

export interface TEMPLATE {
  name: string,
  desc: string,
  icon: string,
  category: string,
  slug: string,
  aiPrompt: string,
  form?: FORM[],
  createdAt?: string,
  createdBy?: string
}

export interface FORM {
  label: string,
  field: string,
  name: string,
  required?: boolean,
  type:string,
  value:string
}

function TemplateListSection({ userSearchInput }: any) {
  const [templateList, setTemplateList] = useState<TEMPLATE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTemplateList(data);
      } catch (error) {
        setError('error.message');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userSearchInput) {
      const filterData = templateList.filter(item =>
        item.name.toLowerCase().includes(userSearchInput.toLowerCase())
      );
      setTemplateList(filterData);
    } else {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/test');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          setTemplateList(data);
        } catch (error) {
          setError('error.message');
        }
      };
      fetchData();
    }
  }, [userSearchInput]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10'>
      {templateList.map((item: TEMPLATE, index: number) => (
        <div key={index}>
          <TemplateCard {...item} />
        </div>
      ))}
    </div>
  );
}

export default TemplateListSection;
