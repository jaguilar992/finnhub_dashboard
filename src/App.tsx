import { useEffect, useRef, useState } from 'react'
import './App.css'
import SubscribeForm from './components/SubscribeForm'
import { FinnHubSocket } from "./services/finnhub/socket";

function App() {
  const [count, setCount] = useState(0)
  const socket = FinnHubSocket.getInstance();
  const [list, setList] = useState([]);
  const symbolInput = useRef(null)


  const addToList = (_symbol: string) => {
    setList([...list, _symbol]);
  }

  const unsubscribe = (_symbol) => {
    setList(list.filter(symbol => symbol !== _symbol));
    socket.unsubscribe(_symbol);
  }
  const subscribe = (_symbol) => {
    if (!_symbol) return;
    addToList(_symbol)
    socket.subscribe(_symbol);;
  }

  const renderList = () => {
    return list.map(s => <p key={s}>{s} - <span onClick={() => unsubscribe(s)}>X</span></p>)
  }

  return (
    <>
      <div className="ui grid">
        <div className="one columns row">
          <div className="sixteen wide column">
            <h1>Alerts</h1>
          </div>
        </div>
        <div className="two columns row">
          <div className="eight wide column">
            <SubscribeForm
              onSubmit={subscribe}
            />
          </div>
          <div className="eight wide column">
            <h1>Graph</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
