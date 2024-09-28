"use client"

import React, { useEffect, useRef } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';


interface props{
  aiOutput:string
}


function OutputSection({aiOutput}:props) {

  const editorRef: any = useRef();
  // console.log(aiOutput);

  useEffect(() =>{
    const editorInstance=editorRef.current.getInstance();
    editorInstance.setMarkdown(aiOutput);

  },[aiOutput])


  return (
    <div className='bg-white shadow-lg border rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2>Your Result</h2>
        <Button><Copy /> Copy</Button>
      </div>

      <Editor
        ref={editorRef}
        initialValue="hello react editor world!"
        initialEditType="wysiwyg"
        height="600px"
        useCommandShortcut={true}
        // onChange={() => console.log(editorRef.current.getInstance().getMarkdown())}
      />

    </div>
  )
}

export default OutputSection
