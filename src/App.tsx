import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {FinnHubSocket} from "./services/finnhub";

function App() {
  const [count, setCount] = useState(0)
  const socket = FinnHubSocket.getInstance();
  const [list, setList] = useState([]);
  const symbolInput = useRef(null)


  const addToList = (_symbol: string) => {
    setList([...list, _symbol]);
  }

  const subscribe = () => {
    const _symbol = symbolInput?.current?.value || '';
    if (!_symbol) return;
    addToList(_symbol)
    socket.subscribe(_symbol);
  }

  const renderList = () => {
    return list.map(s => <p key={s}>{s}</p>)
  }

  return (
    <>
    {renderList()}
    <input type="text" name="symbol" id="symbol" ref={symbolInput}/>
    <button onClick={subscribe}>Subscribe</button>
    </>
  )
}

export default App
