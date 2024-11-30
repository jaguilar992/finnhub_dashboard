import React from 'react'
import { useSelector } from 'react-redux';
import "../../style/stock-alert.css"
import { HistoryDB } from '../../store';

interface StockAlertProps {
  symbol: string;
  value: number;
  name: string;
  onDelete: () => void;
}

const cardStyle ={
  width: "170px"
}

const formatCurrency = (price: number) => `$ ${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
const formatPercentage = (amount: number) => amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});



export const StockAlert: React.FC<StockAlertProps> = ({ symbol, value, onDelete, name }) => {
  const history = useSelector(state => state.history);
  const currentStockHistory = history
  .filter((item:HistoryDB) => item.symbol === symbol)
  .sort((a:HistoryDB ,b: HistoryDB) => a.timestamp - b.timestamp)
  .slice(-100);

  
  const lastPoint = currentStockHistory[currentStockHistory.length - 1];
  const lastPrice = lastPoint?.price;
  const marginChange = 100*(lastPrice - value)/value;
  const cn = lastPrice < value 
  ? 'ui red text' 
  : lastPrice > value 
    ? 'ui green text' 
    : 'ui black text';

  return (
    <div className="item">
      <div className="ui card" style={cardStyle}>
      <i onClick={onDelete} className="red close icon"/>
      <div className="content">
        <div className="header">
          <h5 className='header-text ui blue text'>{name}</h5>
          <h5 className='header-text'>{symbol}</h5>
          {lastPrice ? (
            <>
              <h5 className={cn}>{formatCurrency(lastPrice)}</h5>
              <h5 className={cn}>({lastPrice > value ? '+' : ''}{formatPercentage(marginChange)}%)</h5>
            </>
          ) : <h5><i>No updates</i></h5>}
        </div>
        <hr />
        <div className="meta">
          Alert: {formatCurrency(value)}
        </div>
      </div>
    </div>
    </div>
  )
}
