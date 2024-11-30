import React from 'react'
import { useSelector } from 'react-redux'
import { StockAlert } from './atoms/StockAlert';
import "../style/top-cards.css"

export interface Stock {
  symbol: string;
  value: number;
  name: string;
}

interface TopCardsProps {
  onDelete: (symbol: string) => void;
}

export const TopCards: React.FC<TopCardsProps> = ({ onDelete }) => {
  const stocks = useSelector((state: { stocks: Stock[] }) => state.stocks);
  return (
    <div className="ui horizontal list" id="top-cards">
      {stocks.map((s: Stock) => (
        <div key={s.symbol} className="item">
          <StockAlert
            symbol={s.symbol}
            value={s.value}
            name={s.name}
            onDelete={() => onDelete(s.symbol)}
          />
        </div>
      ))}
    </div>
  )
}
