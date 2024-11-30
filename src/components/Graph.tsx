import React from 'react'
import { useSelector } from 'react-redux';
import { HistoryDB, StockDB } from '../store';
import {BarChart} from "@mui/x-charts/BarChart"

interface GraphProps {
  title: string;
}

export const Graph : React.FC<GraphProps> = () => {
  const stocks = useSelector(state => state.stocks);
  const history = useSelector(state => state.history);
  const allData = stocks.map((s: StockDB) => {
    const currHistory = history
      .filter((i: HistoryDB) => i.symbol === s.symbol)
      .sort((a: HistoryDB, b: HistoryDB) => a.timestamp - b.timestamp)
      .map((i: HistoryDB) => i.price)
      .slice(-100)
    ;
    return currHistory[currHistory.length - 1] || 0;
  });
  const xlabels = stocks.map((s: StockDB) => s.symbol);

  return (
    <div className='ui grid'>
      <BarChart
        width={500}
        height={300}
        series={[{data: allData, label: "Stock Price", type: "bar"}]}
        xAxis={[{scaleType: "band", data: xlabels}]}
      />
    </div>

  )
}
