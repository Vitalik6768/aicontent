
import { OpenAIEmbeddings, ChatOpenAI, OpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import {
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { Pinecone} from '@pinecone-database/pinecone'; // Ensure correct import

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        // Extract the `messages` from the message of the request
        const { messages } = await req.json();
        const message = messages.at(-1).content;

        //PINCONE
        const pc = new Pinecone({
            apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || '',
        });

        const text = await queryPineconeVectorStoreAndQueryLLM({pc,message});








        const prompt = PromptTemplate.fromTemplate("{message}");

        const model = new ChatOpenAI({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
            model: 'gpt-4o-mini',
            temperature: 0.8,
            callbacks: [
                {
                  handleLLMEnd(output) {
                    console.log(JSON.stringify(output, null, 2));
                  },
                },
              ],
        });

        const parser = new HttpResponseOutputParser();

        const chain = prompt.pipe(model).pipe(parser);

        // Convert the response into a friendly text-stream
        const stream = await chain.stream({ message });

        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );

       
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: e.status ?? 500 });
    }
}


 const queryPineconeVectorStoreAndQueryLLM = async ({
    pc,
    message,
  }: any) => {
    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = pc.Index('my-test');
    
    // 3. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  
  
    }).embedQuery(message);
  
    // console.log(queryEmbedding);
    // 4. Query Pinecone index and return top 10 matches
  
  
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 10,
      includeValues: true,
      includeMetadata: true,
  });
  
  
    console.log('queryResponse')
    // 5. Log the number of matches

    console.log(`Found ${queryResponse.matches.length} matches...`);
    // 6. Log the question being asked

    console.log(`Asking question: ${message}...`);
    if (queryResponse.matches.length) {
      // 7. Create an OpenAI instance and load the QAStuffChain


      const llm = new ChatOpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
        model: "gpt-4o-mini",
        temperature: 0.8,
        callbacks: [
          {
            handleLLMEnd(output) {
              console.log(JSON.stringify(output, null, 2));
            },
          },
        ],
      });
      const chain = loadQAStuffChain(llm);
      // 8. Extract and concatenate page content from matched documents
      const concatenatedPageContent = queryResponse.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
      // 9. Execute the chain with input documents and question
      const result = await chain.call({
        input_documents: [new Document({ pageContent: concatenatedPageContent })],
        question: message,
      });
      // 10. Log the answer
      console.log(`Answer: ${result.text}`);
      return result.text;
    } else {
      // 11. Log that there are no matches, so GPT-3 will not be queried
      console.log("Since there are no matches, GPT-3 will not be queried.");
    }
  };
  