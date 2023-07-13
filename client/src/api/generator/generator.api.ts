import axios from "axios";

axios.defaults.baseURL = `${process.env.NODE_ENV === "development" ? "http://localhost:8000" : ""}`;

const url = "/api/generator";


export const generateFirstResults = (keywords: string[]) => {
    return axios.post(url, { keywords });
};
