import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicTool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import * as cheerio from 'cheerio';
import axios from 'axios';

const scrapeProductHunt = async (scrapeType: string): Promise<string> => {
  try {
    const response = await axios.get('https://www.producthunt.com/');
    const $ = cheerio.load(response.data);
    
    const products: any[] = [];
    
    // Scrape product data
    $('[data-test="post-item"]').each((i, elem) => {
      const product = {
        name: $(elem).find('[data-test="post-name"]').text().trim(),
        tagline: $(elem).find('[data-test="post-tagline"]').text().trim(),
        votes: $(elem).find('[data-test="vote-button"] span').text().trim(),
        comments: $(elem).find('[data-test="comment-count"]').text().trim() || '0',
        link: 'https://www.producthunt.com' + $(elem).find('a[href*="/posts/"]').attr('href')
      };
      if (product.name) products.push(product);
    });
    
    return JSON.stringify(products.slice(0, 10)); // Top 10 products
  } catch (error) {
    return `Error scraping: ${error}`;
  }
};

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0
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
