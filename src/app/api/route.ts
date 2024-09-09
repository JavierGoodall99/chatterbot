import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
    });

    const theResponse = completion?.choices?.[0]?.message;
    if (!theResponse) {
      throw new Error("No message found in completion response");
    }

    return NextResponse.json({ output: theResponse });

  } catch (error) {
    console.error("Error in OpenAI API request:", error);
    
    return NextResponse.json(
      { error: "There was an error processing your request." },
      { status: 500 }
    );
  }
}
