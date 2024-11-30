import {config} from '../../config.ts';

interface FinnHubSocketEvents {
    message: (data: string) => void;
    error: (error: Error) => void; // Changed from any to Error
    close: () => void;
}

export class FinnHubSocket {
    private static instance: FinnHubSocket;
    private socket: WebSocket;
    private events: { [key: string]: ((...args: any[]) => void)[] } = {};
    private isSocketReady: boolean = false;

    private constructor() {
        this.socket = new WebSocket(`${config.finnhubBaseUrl}?token=${config.finnhubToken}`);
        this.setupSocketEvents();
    }

    public static getInstance(): FinnHubSocket {
        if (!FinnHubSocket.instance) {
            FinnHubSocket.instance = new FinnHubSocket();
        }
        return FinnHubSocket.instance;
    }

    private setupSocketEvents() {
        this.socket.addEventListener('open', () => {
            console.log('WebSocket connection established');
            this.isSocketReady = true;
            this.subscribe('AAPL');
        });

        this.socket.addEventListener('message', (event) => {
            console.log(`Received message: ${event.data}`);
            this.emit('message', event.data);
        });

        this.socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', error);
        });

        this.socket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            this.isSocketReady = false;
            this.emit('close');
        });
    }

    public subscribe(symbol: string) {
        if (this.isSocketReady) {
            this.socket.send(JSON.stringify({type: 'subscribe', symbol}));
        } else {
            console.log('Socket is not ready to send messages');
        }
    }

    public unsubscribe(symbol: string) {
        if (this.isSocketReady) {
            this.socket.send(JSON.stringify({type: 'unsubscribe', symbol}));
        } else {
            console.log('Socket is not ready to send messages');
        }
    }

    public on(event: keyof FinnHubSocketEvents, callback: FinnHubSocketEvents[keyof FinnHubSocketEvents]) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    private emit(event: keyof FinnHubSocketEvents, ...args: any[]) {
        if (this.events[event]) {
            this.events[event].forEach((callback) => callback(...args));
        }
    }
}
