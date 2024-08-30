import React, { useEffect, useState } from 'react';
import Templates from '@/app/(data)/Templates'
import TemplateCard from './TemplateCard';

export interface TEMPLATE {
  name: string,
  desc: string,
  icon: string,
  category: string,
  slug: string,
  aiPrompt: string,
  form?: FORM[]
}

export interface FORM {
  label: string,
  field: string,
  name: string,
  required?: boolean
}


function TemplateListSection({ userSearchInput }: any) {

  const [templateList, settemplateList] = useState(Templates)


  useEffect(() => {

    if (userSearchInput) {
      const filterData = Templates.filter(item =>
        item.name.toLowerCase().includes(userSearchInput.toLowerCase())
      )
      settemplateList(filterData);
    }else{
      settemplateList(Templates);
    }



    console.log(userSearchInput);



  }, [userSearchInput])


  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10'>
      {Templates.map((item: TEMPLATE, index: number) => (
        <div key={index}>
          <TemplateCard {...item} />
        </div>

      ))}
    </div>
  );
}

export default TemplateListSection
