import axios, { AxiosInstance } from 'axios';
import { config } from '../../config.ts';

class FinnHubAPI {
    private static instance: FinnHubAPI;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: config.finnhubAPIBaseUrl,
        });
    }

    public static getInstance(): FinnHubAPI {
        if (!FinnHubAPI.instance) {
            FinnHubAPI.instance = new FinnHubAPI();
        }
        return FinnHubAPI.instance;
    }

    public async searchStockSymbol(query: string) {
        return this.axiosInstance.get(`/api/v1/search?token=${config.finnhubToken}&exchange=US&q=${query}`);
    }
}

export default FinnHubAPI.getInstance();