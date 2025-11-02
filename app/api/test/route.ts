// Enable LangSmith tracing
if (process.env.LANGCHAIN_API_KEY) {
  process.env.LANGCHAIN_TRACING_V2 = "true";
  process.env.LANGCHAIN_PROJECT = "producthunt-agent";
}

import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
    });

    const response = await model.invoke(question);
    
    return NextResponse.json({ 
      answer: response.content,
      test: "LangSmith integration test"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
