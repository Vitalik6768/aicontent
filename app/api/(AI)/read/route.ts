import { NextRequest, NextResponse } from 'next/server';
import { Pinecone} from '@pinecone-database/pinecone'; // Ensure correct import
import { queryPineconeVectorStoreAndQueryLLM } from '@/utils/pinecone/utils';
import { indexName } from '@/utils/pinecone/config';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await req.json();

    // Initialize Pinecone client (no init method, just the constructor)
    

    const pc = new Pinecone({
        apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || '',
    });

    // const client = new Pinecone();
    // await client.init({
    //   apiKey: process.env.PINECONE_API_KEY || '', // Add your API key here
    //   environment: process.env.PINECONE_ENVIRONMENT || '', // Add your environment here
    // });

    // Call the utility function to query Pinecone and LLM


    const text = await queryPineconeVectorStoreAndQueryLLM({pc,body});


    
    // Return the response in JSON format
    return NextResponse.json({
      data: text,
    });
  } catch (error) {
    // Handle errors gracefully and return an error response
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
      },
      {
        status: 500, // Internal Server Error
      }
    );
  }
}