import { useEffect } from 'react'
import './App.css'
import SubscribeForm from './components/SubscribeForm'
import { FinnHubSocket } from "./services/finnhub/socket";
import { useDispatch, useSelector } from 'react-redux';
import { addHistory, addStock, removeStockBySymbol } from './store';
import { Stock, TopCards } from './components/TopCards';
import { Graph } from './components/Graph';

function App() {
  // Singleton for FinnHubSocket 
  const socket = FinnHubSocket.getInstance();
  const dispatch = useDispatch();
  const stocks = useSelector((state: { stocks: Stock[] }) => state.stocks);

  // Initializes the stocks to monitor, reading from the store 
  // (The store is populated from IndedexDB during its initialization)
  useEffect(() => {
    const initializeSubscriptions = () => {
      console.log("Updating subscriptions to finnhub")
      stocks.forEach(s => {
        console.log(`Initializing subscription to stored stocks: ${s.symbol}`)
        socket.subscribe(s.symbol);
      });
    }
    setTimeout(initializeSubscriptions, 1000);
  }, [socket, stocks])

  // Add an event listener to push the updates from finnhub to the store and IndexedDB
  useEffect(() => {
    const saveToHistory = (_data: string) => {
      try {
        const {data, type: msgType} = JSON.parse(_data);
        // Only accept trade type messages
        if (msgType !== 'trade') return;
        const lastItem = data[data.length - 1];
        // Add the data to store
        dispatch(addHistory({
          id: lastItem.t,
          timestamp: lastItem.t,
          symbol: lastItem.s,
          volume: lastItem.v, 
          price: lastItem.p,
        }));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    // Add event listener callback on socket communication
    socket.on("message", saveToHistory)
  }, [dispatch, socket])

  const subscribe = (symbol: string, name: string, value: number) => {
    if (!symbol) return;
    dispatch(addStock({ symbol, value, name}));
  }

  const unsuscribe = (symbol: string) => {
    if (!symbol) return;
    socket.unsubscribe(symbol);
    dispatch(removeStockBySymbol(symbol));
  }

  return (
    <>
    <div className="ui inverted top attached menu">
      <div className="item">
        <img src="diagram.png" alt="Logo" width="18px"/>
      </div>
      <div className="header item">RealTime Stocks</div>
    </div>
    <div className='ui container' style={{paddingTop: "15px"}}>
      <div className="ui grid">
      <div className="one columns row">
          <div className="sixteen wide column">
            <h3>Stock monitor</h3>
            <TopCards onDelete={unsuscribe}/>
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
            <Graph title='Stock prices'/>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
