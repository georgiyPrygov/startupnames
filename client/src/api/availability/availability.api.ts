import axios from "axios";

axios.defaults.baseURL = `${process.env.NODE_ENV === "development" ? "http://localhost:8000" : ""}`;

const url = "/api/availability";


export const getSingleDomainAvailability = (domain: string) => {
    return axios.post(url, { keywords: [`${domain}`] });
};

export const getDomainsAvailability = (keywords: string[]) => {
    return axios.post(url, { keywords });
};
