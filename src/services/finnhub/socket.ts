import {config} from '../../config.ts';

export interface FinnHubSocketEvents {
    message: (data: string) => void;
    error: (error: Error) => void; // Changed from any to Error
    close: () => void;
}

// This class provides methods and configurations to interact with the Finnhub WebSocket service
// The subscribe method receives a stock's symbol to monitor "trades" message
export class FinnHubSocket {
    private static instance: FinnHubSocket;
    private socket: WebSocket;
    private events: { [key: string]: ((...args: any[]) => void)[] } = {};
    private isSocketReady: boolean = false;

    private constructor() {
        this.socket = new WebSocket(`${config.finnhubWSBaseUrl}?token=${config.finnhubToken}`);
        this.setupSocketEvents();
    }
    // Singleton
    public static getInstance(): FinnHubSocket {
        if (!FinnHubSocket.instance) {
            FinnHubSocket.instance = new FinnHubSocket();
        }
        return FinnHubSocket.instance;
    }
    // Initial setup - Event Listeners
    private setupSocketEvents() {
        this.socket.addEventListener('open', () => {
            console.log('WebSocket connection established');
            this.isSocketReady = true;
            this.subscribe("BINANCE:BTCUSDT")
        });

        this.socket.addEventListener('message', (event) => {
            this.emit('message', event.data);
        });

        this.socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            alert("Please check your internet connection")
            this.emit('error', error);
        });

        this.socket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            this.isSocketReady = false;
            this.emit('close');
        });
    }
    // Subscribe to a stock (symbol) updates
    public subscribe(symbol: string) {
        if (this.isSocketReady) {
            console.log(`Subscribing to stock: ${symbol}`)
            this.socket.send(JSON.stringify({type: 'subscribe', symbol}));
        } else {
            console.log('Socket is not ready to send messages');
        }
    }
    // Unsubscribe to a stock (symbol) updates
    public unsubscribe(symbol: string) {
        if (this.isSocketReady) {
            this.socket.send(JSON.stringify({type: 'unsubscribe', symbol}));
        } else {
            console.log('Socket is not ready to send messages');
        }
    }
    // Add callbacks to propagate the messages when received (Pub-Sub pattern)
    public on(event: keyof FinnHubSocketEvents, callback: FinnHubSocketEvents[keyof FinnHubSocketEvents]) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    // Emit the messages using the Pub-Sub pattern
    private emit(event: keyof FinnHubSocketEvents, ...args: any[]) {
        if (this.events[event]) {
            this.events[event].forEach((callback) => callback(...args));
        }
    }
}
