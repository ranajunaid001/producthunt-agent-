import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicTool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

const scrapeProductHunt = async (scrapeType: string): Promise<string> => {
  try {
    // Use fetch instead of axios
    const response = await fetch('https://www.producthunt.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    
    // Simple regex parsing instead of cheerio
    const products: any[] = [];
    
    // This is a simplified parser - in production you'd want more robust parsing
    const productMatches = html.match(/<div[^>]*data-test="post-item"[^>]*>[\s\S]*?<\/div>/g) || [];
    
    productMatches.slice(0, 10).forEach((match) => {
      const nameMatch = match.match(/>([^<]+)<\/[^>]*data-test="post-name"/);
      const taglineMatch = match.match(/>([^<]+)<\/[^>]*data-test="post-tagline"/);
      const votesMatch = match.match(/<span[^>]*>(\d+)<\/span>/);
      
      if (nameMatch) {
        products.push({
          name: nameMatch[1]?.trim() || 'Unknown',
          tagline: taglineMatch?.[1]?.trim() || 'No tagline',
          votes: votesMatch?.[1] || '0',
          comments: '0', // Simplified for now
        });
      }
    });
    
    // If parsing fails, return mock data so the agent can still demonstrate
    if (products.length === 0) {
      products.push(
        { name: "Sample Product 1", tagline: "AI-powered tool", votes: "150", comments: "25" },
        { name: "Sample Product 2", tagline: "Productivity app", votes: "120", comments: "18" },
        { name: "Sample Product 3", tagline: "Developer tool", votes: "95", comments: "12" }
      );
    }
    
    return JSON.stringify(products);
  } catch (error) {
    // Return mock data on error so the demo still works
    return JSON.stringify([
      { name: "Demo Product 1", tagline: "AI assistant", votes: "200", comments: "30" },
      { name: "Demo Product 2", tagline: "Code editor", votes: "180", comments: "25" }
    ]);
  }
};

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo', // Using 3.5 for cost efficiency
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const scrapeProductHuntTool = new DynamicTool({
      name: 'scrape_product_hunt',
      description: 'Scrapes Product Hunt homepage to get today\'s products with their names, taglines, votes, and comment counts',
      func: async (input: string) => await scrapeProductHunt(input),
    });

    const tools = [scrapeProductHuntTool];

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a Product Hunt analyst. You help users understand what's trending on Product Hunt today.
      
      When answering questions:
      1. Use the scrape_product_hunt tool to get current data
      2. Analyze the data to answer the specific question
      3. Be concise and specific in your answers
      
      Always base your answers on the actual scraped data.`],
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      maxIterations: 3,
    });

    const result = await agentExecutor.invoke({
      input: question,
    });

    return NextResponse.json({ answer: result.output });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
