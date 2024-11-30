import React, { useState } from "react";
import { Dropdown } from 'semantic-ui-react';

interface SubscribeFormProps {
  onSubmit: (symbol: string, alertValue: string) => void;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ onSubmit }) => {
  const [symbol, setSymbol] = useState('');
  const [alertValue, setAlertValue] = useState('0.00');
  const symbolOptions = [
    { key: 'AAPL', text: 'Apple Inc.', value: 'AAPL' },
    { key: 'GOOG', text: 'Alphabet Inc. (Google)', value: 'GOOG' },
    { key: 'BINANCE:BTCUSDT', text: 'Binance Bitcoin/USDT', value: 'BINANCE:BTCUSDT' },
    { key: 'MSFT', text: 'Microsoft Corporation', value: 'MSFT' },
    { key: 'AMZN', text: 'Amazon.com Inc.', value: 'AMZN' },
    { key: 'FB', text: 'Facebook Inc.', value: 'FB' },
    { key: 'TSLA', text: 'Tesla Inc.', value: 'TSLA' },
    { key: 'BRK-A', text: 'Berkshire Hathaway Inc.', value: 'BRK-A' },
    { key: 'JPM', text: 'JPMorgan Chase & Co.', value: 'JPM' },
    { key: 'V', text: 'Visa Inc.', value: 'V' },
    { key: 'JNJ', text: 'Johnson & Johnson', value: 'JNJ' },
    { key: 'BTC-USD', text: 'Bitcoin (BTC) - USD', value: 'BTC-USD' },
    { key: 'ETH-USD', text: 'Ethereum (ETH) - USD', value: 'ETH-USD' },
    { key: 'EUR-USD', text: 'Euro (EUR) - USD', value: 'EUR-USD' },
    { key: 'GBP-USD', text: 'British Pound (GBP) - USD', value: 'GBP-USD' },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(symbol, alertValue);
  };

  return (
    <div className="ui card" style={{ padding: "30px" }}>
      <h4>Subscribe to a Symbol</h4>
      <form onSubmit={handleSubmit} className="ui form">
        <label>Stock:</label>
        <Dropdown
          placeholder="Select a stock or currency"
          fluid
          selection
          options={symbolOptions}
          value={symbol}
          onChange={(event, { value }) => setSymbol(value)}
        />
        <br />
        <label>
          Alert Value (USD):
          <input type="number" step={0.01} value={alertValue} onChange={(event) => setAlertValue(event.target.value)} />
        </label>
        <br />
        <button className="ui button" type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default SubscribeForm;
