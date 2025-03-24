import { NextResponse } from 'next/server';
import axios from 'axios';

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

    const { keywords } = body;
    
    // According to GoDaddy OTE documentation, we should use the correct endpoint
    // This is the endpoint for a single domain check
    const apiUrl = "https://api.ote-godaddy.com/v1/domains/available";
    
    if (!process.env.GODADDY_API_KEY || !process.env.GODADDY_API_SECRET) {
      console.error('Missing GoDaddy API credentials');
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }
    
    console.log(`Checking availability for domains: ${keywords.join(", ")}`);
    
    // Process results for multiple domains
    const domainsResults = [];
    
    // Process each domain individually since the bulk endpoint isn't working
    for (const domain of keywords) {
      try {
        console.log(`Checking domain: ${domain}`);
        
        // For a single domain check, we need to use query parameters
        const singleCheckUrl = `${apiUrl}?domain=${encodeURIComponent(domain)}`;
        
        const response = await axios.get(singleCheckUrl, {
          headers: {
            "Authorization": `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          timeout: 10000 // 10 seconds timeout
        });
        
        // Add the result to our array
        domainsResults.push({
          domain: domain,
          available: response.data.available || false
        });
      } catch (error) {
        console.error(`Error checking domain ${domain}:`, error);
        // Add the domain as unavailable if there's an error
        domainsResults.push({
          domain: domain,
          available: false
        });
      }
    }

    // Return the compiled results
    const transformedResponse = {
      domains: domainsResults
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error in availability API:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      // Network error or timeout
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { message: "Request timed out. Please try again." },
          { status: 408 }
        );
      }
      
      // API error with response
      if (error.response) {
        const statusCode = error.response.status || 500;
        console.error('GoDaddy API error response:', {
          status: statusCode,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Special handling for authentication errors
        if (statusCode === 401 || statusCode === 403) {
          return NextResponse.json(
            { message: "Authentication error with domain provider. Please check API credentials." },
            { status: statusCode }
          );
        }
        
        const errorMessage = error.response.data?.message || error.message || "An error occurred";
        
        return NextResponse.json(
          { message: errorMessage },
          { status: statusCode }
        );
      }
      
      // Network error without response
      return NextResponse.json(
        { message: "Network error. Please check your connection." },
        { status: 503 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { message: "Something went wrong, please try again" },
      { status: 500 }
    );
  }
} 