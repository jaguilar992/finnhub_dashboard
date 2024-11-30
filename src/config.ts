export interface Config {
  finnhubWSBaseUrl: string;
  finnhubToken: string;
  finnhubAPIBaseUrl: string;
}

export const config: Config = {
  finnhubWSBaseUrl: import.meta.env.VITE_FINNHUB_WS_URL,
  finnhubToken: import.meta.env.VITE_FINNHUB_TOKEN,
  finnhubAPIBaseUrl: import.meta.env.VITE_FINNHUB_API_URL,
}
