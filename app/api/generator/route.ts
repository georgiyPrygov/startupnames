import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Simple in-memory cache to store results (will be cleared on server restart)
// In a production environment, consider using Redis or a similar solution
interface CacheEntry {
  data: any;
  timestamp: number;
}

const resultsCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Retry helper function with exponential backoff
async function retryWithBackoff(fn: () => Promise<any>, maxRetries: number = 3): Promise<any> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on rate limit errors (429)
      if (error.status !== 429) {
        throw error;
      }
      
      // Calculate exponential backoff delay: 2^attempt * 1000ms + random jitter
      const delay = Math.pow(2, i) * 1000 + Math.random() * 200;
      console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${i + 1}/${maxRetries})...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
}

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json();
    if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
      return NextResponse.json(
        { message: "Keywords are required and must be an array" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OpenAI API Key');
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { keywords } = body;
    
    // Create a cache key from sorted keywords to ensure consistent caching
    // regardless of the order the keywords are provided
    const cacheKey = [...keywords].sort().join(',');
    
    // Check if we have a valid cached result
    const now = Date.now();
    if (resultsCache[cacheKey] && now - resultsCache[cacheKey].timestamp < CACHE_TTL) {
      console.log(`Returning cached result for keywords: ${keywords.join(', ')}`);
      return NextResponse.json(resultsCache[cacheKey].data);
    }

    // Use the retry mechanism for the API call
    const completion = await retryWithBackoff(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // Using GPT-3.5 Turbo with JSON mode for better JSON formatting
      response_format: { type: "json_object" }, // Enforces JSON response
      messages: [
        {
          role: "system",
          content: `You are a domain name generator tool that creates clever, memorable domain names for startups and businesses.
          You MUST return the response formatted as a valid JSON object with a 'domains' array of string domain names.`
        },
        {
          role: "user",
          content: `Generate a list of 30 unique domain names based on these keywords: ${keywords.join(", ")}.
          Requirements:
          - No TLDs (.com, .org, etc)
          - Maximum 15 characters per name
          - Use full words when possible
          - Names should be memorable and appropriate for businesses/startups
          
          Return ONLY a JSON object with a 'domains' array containing the generated domain names.`
        }
      ],
      temperature: 0.8,
      max_tokens: 1024
    }));

    if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message.content) {
      return NextResponse.json(
        { message: "No results generated. Please try again." },
        { status: 500 }
      );
    }
    
    const content = completion.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Format the response to match the expected structure by the frontend
    const formattedResponse = {
      choices: [
        {
          text: JSON.stringify(parsedContent.domains || [])
        }
      ]
    };
    
    // Cache the successful result
    resultsCache[cacheKey] = {
      data: formattedResponse,
      timestamp: now
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error in generator API:', error);
    
    // Determine if it's an OpenAI API error
    const err = error as any;
    if (err.status) {
      const statusCode = err.status;
      let errorMessage = "Error connecting to AI service";
      
      // Handle specific OpenAI errors
      if (statusCode === 401) {
        errorMessage = "API key error";
      } else if (statusCode === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (statusCode >= 500) {
        errorMessage = "AI service unavailable";
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { message: "Something went wrong, please try again" },
      { status: 500 }
    );
  }
} 