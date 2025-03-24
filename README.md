# Startup Names Generator

An AI-powered domain name generator for startups and businesses. This application helps users discover available domain names by leveraging OpenAI's GPT models and checking domain availability through GoDaddy's API.

## Features

- Generate domain name suggestions based on keywords
- Check domain availability in real-time
- Show instant results by combining keywords
- Display AI-generated domain suggestions
- Mobile responsive design

## Tech Stack

- **Frontend**: Next.js, React, SCSS
- **API Integration**: OpenAI API, GoDaddy API
- **Hosting**: Vercel

## Development

### Prerequisites

- Node.js (v14.17.0 or higher recommended)
- npm or yarn
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

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and add your environment variables in the Vercel dashboard.

## License

[MIT](LICENSE)