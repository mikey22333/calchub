import React, { useState, useEffect } from 'react';
import { FaCalculator, FaRedo, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [useOfflineRates, setUseOfflineRates] = useState(true);

  // Offline exchange rates (as of May 2025)
  // These are fallback rates in case the API is not used
  const offlineRates = {
    USD: 1.00,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    AUD: 1.51,
    CAD: 1.36,
    CHF: 0.90,
    CNY: 7.23,
    INR: 83.15,
    MXN: 16.82,
    BRL: 5.05,
    ZAR: 18.31,
    SGD: 1.34,
    NZD: 1.62,
    HKD: 7.81,
    SEK: 10.42,
    NOK: 10.65,
    DKK: 6.86,
    PLN: 3.94,
    THB: 35.67,
    KRW: 1345.20,
    RUB: 91.25,
    TRY: 32.14,
    AED: 3.67,
    SAR: 3.75,
    ILS: 3.68,
    PHP: 56.80,
    MYR: 4.68,
    IDR: 15750.00
  };

  // List of popular currencies with symbols and names
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' }
  ];

  // Calculate exchange rate using offline rates
  const calculateOfflineRate = () => {
    if (!fromCurrency || !toCurrency) return null;
    
    const baseRate = offlineRates[fromCurrency];
    const targetRate = offlineRates[toCurrency];
    
    if (!baseRate || !targetRate) return null;
    
    // Convert to USD as base, then to target currency
    return targetRate / baseRate;
  };

  // Fetch exchange rate from API (commented out as optional)
  // This would be implemented if an API key is available
  /*
  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Replace with your preferred currency API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      if (data && data.rates && data.rates[toCurrency]) {
        setExchangeRate(data.rates[toCurrency]);
        setLastUpdated(new Date());
      } else {
        throw new Error('Exchange rate not available');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      setError('Failed to fetch exchange rates. Using offline rates instead.');
      
      // Fall back to offline rates
      const offlineRate = calculateOfflineRate();
      if (offlineRate) {
        setExchangeRate(offlineRate);
        setUseOfflineRates(true);
      }
    } finally {
      setLoading(false);
    }
  };
  */

  // Update exchange rate when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      // If using API (uncomment when API key is available)
      // if (!useOfflineRates) {
      //   fetchExchangeRate();
      // } else {
        const offlineRate = calculateOfflineRate();
        if (offlineRate) {
          setExchangeRate(offlineRate);
          setLastUpdated(new Date());
        }
      // }
    }
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setConvertedAmount(null);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
    setConvertedAmount(null);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
    setConvertedAmount(null);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const validateInputs = () => {
    setError('');

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount (must be a positive number)');
      return false;
    }

    if (!fromCurrency || !toCurrency) {
      setError('Please select both currencies');
      return false;
    }

    if (!exchangeRate) {
      setError('Exchange rate is not available');
      return false;
    }

    return true;
  };

  const convert = () => {
    if (!validateInputs()) return;

    const result = parseFloat(amount) * exchangeRate;
    setConvertedAmount(result);
  };

  const handleReset = () => {
    setAmount('');
    setFromCurrency('USD');
    setToCurrency('EUR');
    setConvertedAmount(null);
    setError('');
    setShowSteps(false);
  };

  const formatCurrency = (value, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get currency symbol
  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '';
  };

  // Get currency name
  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.name : code;
  };

  return (
    <>
      <SEO
        title="Currency Converter - Convert Between World Currencies"
        description="Convert between different currencies with up-to-date exchange rates. Simple and accurate currency conversion tool."
        keywords="currency converter, exchange rate calculator, forex calculator, money converter, currency exchange"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Currency Converter</h1>
        <p className="calculator-description">
          Convert between different currencies with accurate exchange rates. 
          Simple and easy-to-use currency conversion tool.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> 
              Currency Converter
            </h2>

            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  {getCurrencySymbol(fromCurrency)}
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  From Currency
                </label>
                <select
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={handleFromCurrencyChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {currencies.map((currency) => (
                    <option key={`from-${currency.code}`} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  To Currency
                </label>
                <select
                  id="toCurrency"
                  value={toCurrency}
                  onChange={handleToCurrencyChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {currencies.map((currency) => (
                    <option key={`to-${currency.code}`} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={swapCurrencies}
                className="flex items-center justify-center p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                title="Swap currencies"
              >
                <FaExchangeAlt className="text-gray-700" />
              </button>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={convert}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Reset"
            >
              <FaRedo />
            </button>
          </div>

          {convertedAmount !== null && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Conversion Result:</h2>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {formatCurrency(parseFloat(amount), fromCurrency)}
                    </p>
                    <p className="text-sm text-gray-600">{getCurrencyName(fromCurrency)}</p>
                  </div>
                  
                  <div className="hidden md:block text-gray-400">
                    <FaExchangeAlt />
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(convertedAmount, toCurrency)}
                    </p>
                    <p className="text-sm text-gray-600">{getCurrencyName(toCurrency)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Exchange Rate:</p>
                  <p className="font-medium">
                    1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                  </p>
                </div>
                
                {lastUpdated && (
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">Last Updated:</p>
                    <p className="text-sm text-gray-600">
                      {lastUpdated.toLocaleString()}
                      {useOfflineRates && " (using offline rates)"}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Calculation Steps' : 'Show Calculation Steps'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Steps:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>1. Amount in {fromCurrency}: {formatCurrency(parseFloat(amount), fromCurrency)}</p>
                    <p>2. Exchange rate: 1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}</p>
                    <p>3. Conversion calculation: {parseFloat(amount).toFixed(2)} × {exchangeRate.toFixed(6)}</p>
                    <p>4. Result: {formatCurrency(convertedAmount, toCurrency)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Currency Conversion</h2>
          <div className="space-y-2">
            <p>
              Currency conversion is the process of changing one currency into another at a specific exchange rate.
            </p>
            <p>
              <strong>Exchange rates</strong> fluctuate based on market conditions, economic indicators, political events, and other factors.
            </p>
            <p>
              This calculator uses approximate exchange rates for demonstration purposes. For the most accurate and up-to-date rates, consider using a financial service or bank.
            </p>
            <p>
              <strong>Note:</strong> The exchange rates used in this calculator are for informational purposes only and may not reflect current market rates.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CurrencyConverter;
