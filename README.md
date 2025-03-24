# Startup Names Generator

An AI-powered domain name generator for startups and businesses. This application helps users discover available domain names by leveraging OpenAI's GPT models and checking domain availability through GoDaddy's API.

## Live Demo

Check out the live application at [startupnames.vercel.app](https://startupnames.vercel.app/)

## Features

- Generate domain name suggestions based on keywords
- Check domain availability in real-time
- Show instant results by combining keywords
- Display AI-generated domain suggestions
- Mobile responsive design

## Tech Stack

- **Frontend**: Next.js, React, SCSS, Typescript, RestAPI
- **API Integration**: OpenAI API, GoDaddy API
- **Hosting**: Vercel

## Development

### Prerequisites

- Node.js
- npm
- API keys for OpenAI and GoDaddy

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   GODADDY_API_KEY=your_godaddy_api_key
   GODADDY_API_SECRET=your_godaddy_api_secret
   ```
4. Start the development server:
   ```
   npm run dev
   ```
