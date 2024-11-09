import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import {
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { Pinecone } from '@pinecone-database/pinecone'; // Assuming the correct import

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const message = messages.at(-1)?.content;

        // Pinecone client setup
        const pc = new Pinecone({
            apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || '',
        });

        // Query Pinecone and LLM
        const pineconeResponse = await queryPineconeVectorStoreAndQueryLLM({ pc, message });

        // Use response from Pinecone, or fallback to the original message if no result is found
        const finalResponseText = pineconeResponse || message;

        // Prepare and execute the final prompt with LLM
        const prompt = PromptTemplate.fromTemplate("{message}");
        const model = new ChatOpenAI({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
            model: 'gpt-4o-mini',
            temperature: 0.8,
            // callbacks: [
            //     {
            //         handleLLMEnd(output) {
            //             console.log(JSON.stringify(output, null, 2));
            //         },
            //     },
            // ],
        });

        const parser = new HttpResponseOutputParser();
        const chain = prompt.pipe(model).pipe(parser);

        // Convert the response into a friendly text-stream
        const stream = await chain.stream({ message: finalResponseText });

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
}: { pc: Pinecone, message: string }) => {
    try {
        // Query Pinecone vector store
        const index = pc.Index('website');

        // Create embedding for the query
        const queryEmbedding = await new OpenAIEmbeddings({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
        }).embedQuery(message);

        // Query Pinecone index for top matches
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: 10,
            includeValues: true,
            includeMetadata: true,
        });

        console.log(`Found ${queryResponse.matches.length} matches...`);

        if (queryResponse.matches.length) {
            // Load QA chain
            const llm = new ChatOpenAI({
                apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
                model: "gpt-4o-mini",
                temperature: 0.8,
                // callbacks: [
                //     {
                //         handleLLMEnd(output) {
                //             console.log(JSON.stringify(output, null, 2));
                //         },
                //     },
                // ],
            });

            const chain = loadQAStuffChain(llm);

            // Extract page content from matches
            const concatenatedPageContent = queryResponse.matches
                .map((match: any) => match.metadata.pageContent)
                .join(" ");

            // Execute the chain
            const result = await chain.call({
                input_documents: [new Document({ pageContent: concatenatedPageContent })],
                question: message,
            });

            console.log(`Answer: ${result.text}`);
            return result.text;
        } else {
            console.log("No matches found in Pinecone.");
            return null;  // Return null if no matches found
        }
    } catch (error) {
        console.error("Error querying Pinecone or LLM:", error);
        return null;  // Return null on error
    }
};