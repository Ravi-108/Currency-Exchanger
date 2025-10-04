import React, { useState, useEffect } from "react";
import "./App.css";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(null);

  // ✅ read API key from .env
  const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
;

  // fetch all rates based on USD
  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.conversion_rates) {
          setRates(data.conversion_rates);
          setCurrencies(Object.keys(data.conversion_rates));
        }
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, [API_KEY]);

  // convert function
  const convert = () => {
    if (!amount || isNaN(amount)) return;
    if (!rates[fromCurrency] || !rates[toCurrency]) return;

    // convert via USD
    const amountInUSD = amount / rates[fromCurrency];
    const converted = amountInUSD * rates[toCurrency];
    setResult(converted);
  };

  return (
    <div className="app">
      <div className="converter-card">
        <h1> Currency Converter</h1>

        {/* Amount */}
        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* From & To */}
        <div className="currency-row">
          <div className="input-group">
            <label>From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.length > 0 ? (
                currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
          </div>

          <div className="input-group">
            <label>To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.length > 0 ? (
                currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
          </div>
        </div>

        {/* Button */}
        <button className="convert-btn" onClick={convert}>
          Convert
        </button>

        {/* Result */}
        {result !== null && (
          <div className="result">
            <p>
              {amount} {fromCurrency} ={" "}
              <span>
                {result.toFixed(2)} {toCurrency}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
