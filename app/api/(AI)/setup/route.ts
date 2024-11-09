import { NextResponse } from 'next/server'
import { Pinecone} from '@pinecone-database/pinecone'; // Ensure correct import
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  createPinconeIndex,
  updatePinecone
} from '@/utils/pinecone/utils'
//import { indexName } from '@/utils/pinecone/config'

export async function POST() {
  const loader = new DirectoryLoader('./documents', {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path)
  })

  const docs = await loader.load()
  // const vectorDimensions = 1536

  const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || '',
});

  

  try {
    // await createPinconeIndex({pc})
    await updatePinecone({pc, docs})
  } catch (err) {
    console.log('error: ', err)
  }

  

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...'
  })
}