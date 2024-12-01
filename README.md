<img src="https://cdn-icons-png.flaticon.com/512/2285/2285545.png" width="50px"/>

# RealTime Stocks

This is a web page that displays real-time stock prices using the Finnhub API. The page is built with Vite+React, a next-generation frontend tooling that makes it easy to start writing modern Typescript applications.

The project directory structure is as follows:

- `src`: This directory contains the source code for the application.
- `public`: Public assets for the application.
- `vite.config.js`: This file contains the configuration for the Vite build tool.
- `Dockerfile`: Instructions for building the Docker image.
- `docker-compose.yaml`: configuration for the Docker Compose service.

## Instructions
1. Clone the repository
``` bash
git clone https://github.com/jaguilar992/finnhub_dashboard.git
```
2. Create a new .env file using the .env.example provided in the repo
```
VITE_FINNHUB_WS_URL="wss://ws.finnhub.io"
VITE_FINNHUB_API_URL="https://finnhub.io"
VITE_FINNHUB_TOKEN=<YOUR_API_TOKEN>
```
3. Deploy the project using `docker-compose`
```
docker-compose up -d --build
```

## Features
1. Developed using the Typescript programming language

2. The main route / consists of 3 components:
* TopCards: Displays stock price alerts, one per card
* SubscribeForm: Allows adding new stock alerts, by specifying a price to monitor
* Graph: Displays the prices of subscribed stocks in real-time via chart

3. The app connects to the Websocket Finnhub service to obtain real time updates.

4. In the top cards, the user will see a red text showing the price is below the alert value, and a green text if it is above
