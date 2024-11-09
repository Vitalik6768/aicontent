import { OpenAIEmbeddings, ChatOpenAI, OpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { indexName, timeOut } from "./config";
import dotenv from "dotenv";

export interface PINE {
  client: string;
  indexName: any;
  vectorDimension: string;
}

dotenv.config({
  path: ".env.local",
});

export const queryPineconeVectorStoreAndQueryLLM = async ({
  pc,
  body,
}: any) => {
  // 1. Start query process
  console.log("Querying Pinecone vector store...");
  // 2. Retrieve the Pinecone index
  const index = pc.Index('my-test');
  
  // 3. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,


  }).embedQuery(body);

  // console.log(queryEmbedding);
  // 4. Query Pinecone index and return top 10 matches


  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 10,
    includeValues: true,
    includeMetadata: true,
});


  // let queryResponse = await index.namespace({
  //   queryRequest: {
  //     topK: 10,
  //     vector: queryEmbedding,
  //     includeMetadata: true,
  //     includeValues: true,
  //   },
  // });

  console.log('queryResponse')
  // 5. Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches...`);
  // 6. Log the question being asked
  console.log(`Asking question: ${body}...`);
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
      question: body,
    });
    // 10. Log the answer
    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    // 11. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};

export const createPinconeIndex = async ({ pc }: any) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`);
  // 2. Get list of existing indexes

  //  1536

  const existingIndexes = await pc.listIndexes();
  // 3. If index doesn't exist, create it
  if (existingIndexes.name != indexName) {
    // 4. Log index creation initiation
    console.log(`Creating "${indexName}"...`);
    // 5. Create index
    await pc.createIndex({
      name: indexName,
      dimension: 1536, // Replace with your model dimensions
      metric: "cosine", // Replace with your model metric
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    // 6. Log successful creation
    console.log(
      `Creating index.... please wait for it to finish initializing.`
    );
    // 7. Wait for index initialization
    await new Promise((resolve) => setTimeout(resolve, timeOut));
  } else {
    // 8. Log if index already exists
    console.log(`"${indexName}" already exists.`);
  }
};

export const updatePinecone = async ({ pc, docs }: any) => {
  console.log("Retrieving Pinecone index...");
  // 1. Retrieve Pinecone index
  const index = pc.Index(indexName);
  console.log(`Pinecone index retrieved: ${indexName}`);

  // 3. Process each document in the docs array
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;

    // 4. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks...");

    // 5. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);

    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
    );

    // 6. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    }).embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );
    console.log("Finished embedding documents");
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`
    );

    // 7. Create and upsert vectors in batches of 100
    const batchSize = 100;
    let batch: any[] = [];

    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const vector = {
        id: `${txtPath}_${idx}`, // Unique ID for each chunk
        values: embeddingsArrays[idx], // Embedding values
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc), // Ensure loc is stringified
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      };

      // Verify values are array of numbers and metadata is properly formatted
      if (!Array.isArray(vector.values) || vector.values.some(isNaN)) {
        console.error(`Invalid vector values for chunk ${idx}:`, vector.values);
        continue; // Skip this vector if values are not valid
      }

      batch.push(vector); // Push vector to batch

      // When batch is full or it's the last item, upsert the vectors
      if (batch.length === batchSize || idx === chunks.length - 1) {
        console.log("Batch to be upserted:", batch);

        try {
          await index.upsert(
            batch
          
            
            // Correctly pass the batch
          );
          // console.log(`Upserted batch with ${batch.length} vectors.`);
        } catch (error) {
          console.error(`Failed to upsert batch: ${error}`);
        }

        batch = []; // Empty the batch after upsert
      }
    }

    // Log the number of vectors updated
    // console.log(`Pinecone index updated with ${chunks.length} vectors`);
  }
};
