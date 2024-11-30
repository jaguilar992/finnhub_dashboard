import { useEffect, useRef, useState } from 'react'
import './App.css'
import SubscribeForm from './components/SubscribeForm'
import { FinnHubSocket } from "./services/finnhub/socket";
import { useDispatch, useSelector } from 'react-redux';
import { addStock } from './store';
import { Stock, TopCards } from './components/TopCards';
import { Graph } from './components/Graph';

function App() {
  const socket = FinnHubSocket.getInstance();
  const dispatch = useDispatch();
  const stocks = useSelector((state: { stocks: Stock[] }) => state.stocks);

  useEffect(() => {
    const initializeSubscriptions = () => {
      stocks.forEach(s => {
        console.log("Initializing subscription to stored stocks")
        socket.subscribe(s.symbol);
      });
    }
    setTimeout(initializeSubscriptions, 5000);
  }, [])

  const subscribe = (symbol: string, name: string, value: number) => {
    if (!symbol) return;
    socket.subscribe(symbol);
    dispatch(
      addStock({ symbol, value, name})
    );
  }

  return (
    <div className='ui container' style={{paddingTop: "15px"}}>
      <div className="ui grid">
      <div className="one columns row">
          <div className="sixteen wide column">
            <h3>Alerts</h3>
            <TopCards />
          </div>
        </div>
      </div>
      <div className="ui doubling stackable grid">
        <div className="two columns row">
          <div className="eight wide column">
            <SubscribeForm
              onSubmit={subscribe}
            />
          </div>
          <div className="eight wide column">
            <h3>Graph</h3>
            <Graph />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
