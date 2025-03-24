import axios from "axios";

// No need to set baseURL as we're using relative URLs with Next.js API routes
const url = "/api/generator";

export const generateFirstResults = (keywords: string[]) => {
    return axios.post(url, { keywords });
};
