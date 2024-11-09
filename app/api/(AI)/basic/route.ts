import { StreamingTextResponse, createStreamDataTransformer } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  const messages = await req.json();


//   const prompt = PromptTemplate.fromTemplate(messages);

  const model = new ChatOpenAI({
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

  const response = await model.invoke([{ role: "user", content: messages }]);



  return NextResponse.json({
    data: response.content,
  });

  // return Response.json({ status: 200 }, {});

  // try {
  //     // Extract the `messages` from the body of the request
  //     const { messages } = await req.json();
  //     const message = messages.at(-1).content;

  //     const prompt = PromptTemplate.fromTemplate("{message}");

  //     const model = new ChatOpenAI({
  //         apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  //         model: 'gpt-4o-mini',
  //         temperature: 0.8,
  //         callbacks: [
  //             {
  //               handleLLMEnd(output) {
  //                 console.log(JSON.stringify(output, null, 2));
  //               },
  //             },
  //           ],
  //     });

  //     const parser = new HttpResponseOutputParser();

  //     const chain = prompt.pipe(model).pipe(parser);

  //     // Convert the response into a friendly text-stream
  //     const stream = await chain.stream({ message });

  //     return new StreamingTextResponse(
  //         stream.pipeThrough(createStreamDataTransformer()),
  //     );

  // } catch (e: any) {
  //     return Response.json({ error: e.message }, { status: e.status ?? 500 });
  // }
}
