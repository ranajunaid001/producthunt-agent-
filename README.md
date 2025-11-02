Product Hunt AI Agent

Project Overview
An intelligent AI agent built with LangChain that can answer any question about today's Product Hunt launches. The agent scrapes real-time data from Product Hunt and provides contextual answers with appropriate data visualizations.

Features
	• Natural Language Questions: Ask anything about Product Hunt in plain English
	• Real-time Data: Scrapes current Product Hunt homepage data
	• Smart Visualizations: AI automatically chooses the best way to display data
	• Full Transparency: Shows source data, timestamps, and verification links
	• LangSmith Integration: Complete observability and debugging capabilities
	
Tech Stack
	• Frontend: Next.js 14 (App Router), React, TypeScript
	• AI/LLM: LangChain, OpenAI GPT-3.5-turbo
	• Monitoring: LangSmith
	• Deployment: Vercel
	• Styling: Inline styles (Jony Ive-inspired minimalist design)
	
Project Structure
producthunt-agent/
├── app/
│   ├── api/
│   │   └── ask/
│   │       └── route.ts        # Main API endpoint - handles AI agent logic
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage with API instructions
│   └── globals.css             # Global styles (minimal)
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
└── .gitignore                 # Git ignore file
File Descriptions

/app/api/ask/route.ts
The core of the application. This file:
	• Implements the LangChain agent with tools
	• Scrapes Product Hunt using regex parsing (no external scraping libraries)
	• Uses OpenAI to understand questions and generate answers
	• Returns structured responses with: 
		○ Natural language answer
		○ Visualization type (bar_chart, sentiment_cards, product_grid, etc.)
		○ Raw data and metadata for transparency
	• Integrates LangSmith for tracing and debugging
	
/app/page.tsx
Simple landing page that displays:
	• API endpoint information
	• Example questions users can ask
	• Instructions for making POST requests
	
/app/layout.tsx
Root layout that wraps all pages with:
	• HTML structure
	• Metadata (title, description)
	• Global CSS import
	
Environment Variables
Required in Vercel:
OPENAI_API_KEY=sk-...                    # OpenAI API key
LANGCHAIN_TRACING_V2=true               # Enable LangSmith tracing
LANGCHAIN_API_KEY=ls__...                # LangSmith API key
LANGCHAIN_PROJECT=producthunt-agent      # LangSmith project name
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
API Usage
Endpoint: POST /api/ask
Request Body:
{
  "question": "Which product has the most votes today?"
}
Response:
{
  "answer": "Linear is the hottest product today with 453 votes...",
  "visualization": "bar_chart",
  "data": [...],
  "metadata": {
    "source_url": "https://www.producthunt.com/",
    "scraped_at": "2024-11-02T...",
    "items_found": 10,
    "raw_data": [...]
  }
}
How It Works
	1. User asks a question about Product Hunt
	2. LangChain agent processes the question
	3. Agent uses tools to scrape Product Hunt homepage
	4. AI analyzes data to find the answer
	5. Agent decides visualization type based on the question
	6. Returns structured response with answer + visualization recommendation
	7. LangSmith tracks every step for debugging
	
Development Status
Completed ✅
	• Basic Next.js setup with TypeScript
	• LangChain agent implementation
	• Product Hunt scraping (basic)
	• AI response generation
	• Visualization type selection
	• LangSmith integration
	• Vercel deployment
	
Pending Implementation 🚧
	1. Frontend UI:
		○ Beautiful Jony Ive-inspired interface
		○ Dynamic visualizations (bar charts, sentiment cards, etc.)
		○ "Show sources" expandable section
	2. Enhanced Scraping:
		○ Individual product page scraping
		○ Real comments/reviews extraction
		○ Sentiment analysis from actual user feedback
	3. LangSmith Features:
		○ Test datasets creation
		○ Automated testing
		○ Prompt optimization
		○ Performance monitoring
		
Deployment
	• Production URL: https://producthunt-agent.vercel.app/
	• GitHub Repository: https://github.com/ranajunaid001/producthunt-agent-
	• Deployment Platform: Vercel (auto-deploys from main branch)
	
Next Steps
	1. Implement the frontend UI with dynamic visualizations
	2. Enhance scraping to get real comments and reviews
	3. Create LangSmith test datasets for quality assurance
	4. Add more sophisticated question handling
	5. Implement caching for better performance
	
Example Questions
	• "Which product has the most votes?"
	• "Are there any AI products launched today?"
	• "What do people think about Linear?"
	• "Show me the top 3 products by comments"
	• "What categories are trending today?"
	
Notes
	• Currently using mock comment data (real vote counts when available)
	• Scraping is done via regex parsing to avoid dependency issues
	• The AI agent can handle any question about Product Hunt, not just predefined ones
	• LangSmith provides full visibility into the agent's decision-making process
<img width="1268" height="5636" alt="image" src="https://github.com/user-attachments/assets/20763723-a856-4dd3-9ea7-f3e2b0b0f692" />
