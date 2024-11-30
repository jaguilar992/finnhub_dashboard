import React from 'react'

interface StockAlertProps {
  symbol: string;
  value: number;
  name: string;
  onDelete: () => void;
}

const cardStyle ={
  width: "170px"
}

export const StockAlert: React.FC<StockAlertProps> = ({ symbol, value, onDelete, name }) => {
  return (
    <div className="item">
      <div className="ui card" style={cardStyle}>
      <i className="red close icon"/>
      <div className="content">
        <div className="header">
          <h5>{name}</h5>
          <h5>{symbol}</h5>
        </div>
        <hr />
        <div className="meta">
          {value}
        </div>
      </div>
    </div>
    </div>
  )
}
