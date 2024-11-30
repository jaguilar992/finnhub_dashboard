import React, { useState } from "react";
import { Dropdown } from 'semantic-ui-react';

interface SubscribeFormProps {
  onSubmit: (symbol: string, name: string, alertValue: number) => void;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ onSubmit }) => {
  const [symbol, setSymbol] = useState('');
  const [alertValue, setAlertValue] = useState('0.00');
  const symbolOptions = [
    { key: 'BINANCE:BTCUSDT', text: 'Binance Bitcoin/USDT', value: 'BINANCE:BTCUSDT', name: 'Binance Bitcoin/USDT' },
    { key: 'AAPL', text: 'Apple Inc.', value: 'AAPL', name: 'Apple Inc.' },
    { key: 'GOOG', text: 'Alphabet Inc. (Google)', value: 'GOOG', name: 'Alphabet Inc. (Google)' },
    { key: 'MSFT', text: 'Microsoft Corporation', value: 'MSFT', name: 'Microsoft Corporation' },
    { key: 'AMZN', text: 'Amazon.com Inc.', value: 'AMZN', name: 'Amazon.com Inc.' },
    { key: 'FB', text: 'Facebook Inc.', value: 'FB', name: 'Facebook Inc.' },
    { key: 'TSLA', text: 'Tesla Inc.', value: 'TSLA', name: 'Tesla Inc.' },
    { key: 'BRK-A', text: 'Berkshire Hathaway Inc.', value: 'BRK-A', name: 'Berkshire Hathaway Inc.' },
    { key: 'JPM', text: 'JPMorgan Chase & Co.', value: 'JPM', name: 'JPMorgan Chase & Co.' },
    { key: 'V', text: 'Visa Inc.', value: 'V', name: 'Visa Inc.' },
    { key: 'JNJ', text: 'Johnson & Johnson', value: 'JNJ', name: 'Johnson & Johnson' },
    { key: 'BTC-USD', text: 'Bitcoin (BTC) - USD', value: 'BTC-USD', name: 'Bitcoin (BTC) - USD' },
    { key: 'BINANCE:ETHBTC', text: 'Ethereum (ETH) - USD', value: 'BINANCE:ETHBTC', name: 'Ethereum (ETH) - USD' },
    { key: 'EUR-USD', text: 'Euro (EUR) - USD', value: 'EUR-USD', name: 'Euro (EUR) - USD' },
    { key: 'GBP-USD', text: 'British Pound (GBP) - USD', value: 'GBP-USD', name: 'British Pound (GBP) - USD' },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedOption = symbolOptions.find(option => option.value === symbol);
    if (selectedOption && parseFloat(alertValue) > 0) {
      onSubmit(symbol, selectedOption.name, parseFloat(alertValue));
    } else if (parseFloat(alertValue) === 0) {
      alert("Alert value cannot be zero. Please enter a valid value.");
    }
  };

  return (
    <div className="ui fluid card" style={{ padding: "30px" }}>
      <h4>Subscribe</h4>
      <form onSubmit={handleSubmit} className="ui form">
      <div className="field">
          <label>Stock:</label>
          <Dropdown
            placeholder="Select a stock or currency"
            fluid
            selection
            options={symbolOptions}
            value={symbol}
            onChange={(event, { value }) => setSymbol(value)}
          />
        </div>
        <div className="field">
          <label>Alert Value (USD):</label>
          <input type="number" step={0.01} value={alertValue} onChange={(event) => setAlertValue(event.target.value)} />
        </div>
        <div className="button group">
          <button className="ui button" type="submit">Subscribe</button>
        </div>
      </form>
    </div>
  );
};

export default SubscribeForm;
