export interface Config {
  finnhubBaseUrl: string;
  finnhubToken: string;
}

export const config: Config = {
  finnhubBaseUrl: import.meta.env.VITE_FINNHUB_WS_URL,
  finnhubToken: import.meta.env.VITE_FINNHUB_TOKEN,
}
