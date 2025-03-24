import axios from "axios";

// No need to set baseURL as we're using relative URLs with Next.js API routes
const url = "/api/availability";

export const getSingleDomainAvailability = (domain: string) => {
    return axios.post(url, { keywords: [`${domain}`] });
};

export const getDomainsAvailability = (keywords: string[]) => {
    return axios.post(url, { keywords });
};
