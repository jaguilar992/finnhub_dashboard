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

  const unsubscribe = (_symbol) => {
    setList(list.filter(symbol => symbol !== _symbol));
    socket.unsubscribe(_symbol);
  }
  const subscribe = () => {
    const _symbol = symbolInput?.current?.value || '';
    if (!_symbol) return;
    addToList(_symbol)
    socket.subscribe(_symbol);
    symbolInput.current.value = '';
  }

  const renderList = () => {
    return list.map(s => <p key={s}>{s} - <span onClick={() => unsubscribe(s)}>X</span></p>)
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
