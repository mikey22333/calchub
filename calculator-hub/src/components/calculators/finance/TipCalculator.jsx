import React, { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaUsers, FaPercent } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const tipOptions = [10, 15, 18, 20, 25];
  
  // Common currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc (CHF)', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real (R$)', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble (₽)', symbol: '₽' },
    { code: 'KRW', name: 'South Korean Won (₩)', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar (S$)', symbol: 'S$' },
    { code: 'NZD', name: 'New Zealand Dollar (NZ$)', symbol: 'NZ$' },
    { code: 'MXN', name: 'Mexican Peso (MX$)', symbol: 'MX$' },
    { code: 'HKD', name: 'Hong Kong Dollar (HK$)', symbol: 'HK$' },
    { code: 'SEK', name: 'Swedish Krona (kr)', symbol: 'kr' },
    { code: 'ZAR', name: 'South African Rand (R)', symbol: 'R' }
  ];

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    if (!billAmount) {
      setError('Please enter the bill amount');
      return;
    }

    const bill = parseFloat(billAmount);
    if (isNaN(bill) || bill <= 0) {
      setError('Bill amount must be a positive number');
      return;
    }

    const people = parseInt(numberOfPeople);
    if (isNaN(people) || people <= 0) {
      setError('Number of people must be a positive integer');
      return;
    }

    // Calculate tip and total
    const tipAmount = (bill * tipPercentage) / 100;
    let totalAmount = bill + tipAmount;
    
    // Round up total if selected
    if (roundUp) {
      totalAmount = Math.ceil(totalAmount);
    }
    
    // Calculate per person amounts
    const tipPerPerson = tipAmount / people;
    const totalPerPerson = totalAmount / people;
    
    setResults({
      bill,
      tipPercentage,
      tipAmount,
      totalAmount,
      people,
      tipPerPerson,
      totalPerPerson
    });
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage(15);
    setNumberOfPeople(1);
    setRoundUp(false);
    // Don't reset currency to preserve user preference
    setResults(null);
    setError('');
  };
  
  const formatCurrency = (value) => {
    // Get locale based on currency
    let locale = 'en-US';
    if (currency === 'EUR') locale = 'de-DE';
    else if (currency === 'JPY') locale = 'ja-JP';
    else if (currency === 'GBP') locale = 'en-GB';
    else if (currency === 'CNY') locale = 'zh-CN';
    else if (currency === 'INR') locale = 'en-IN';
    else if (currency === 'RUB') locale = 'ru-RU';
    else if (currency === 'BRL') locale = 'pt-BR';
    else if (currency === 'KRW') locale = 'ko-KR';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <SEO
        title="Tip Calculator"
        description="Calculate tips, split bills, and determine how much each person should pay with this easy-to-use tip calculator."
        keywords="tip calculator, bill splitter, restaurant tip, gratuity calculator, split bill"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Tip Calculator</h1>
        <p className="calculator-description">
          Calculate tips, split bills, and determine how much each person should pay.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="billAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Bill Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="billAmount"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter bill amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip Percentage ({tipPercentage}%)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tipOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setTipPercentage(option)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    tipPercentage === option
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {option}%
                </button>
              ))}
              <button
                onClick={() => setTipPercentage(0)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  tipPercentage === 0
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                No Tip
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="50"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
              Number of People
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUsers className="text-gray-400" />
              </div>
              <input
                type="number"
                id="numberOfPeople"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter number of people"
                min="1"
                step="1"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={roundUp}
                onChange={(e) => setRoundUp(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Round up total to nearest dollar</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaCalculator className="mr-2" /> Calculate Tip
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            Reset
          </button>
        </div>

        {results && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-primary-600" /> Tip Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Bill Amount</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.bill)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Tip Amount</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.tipAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">{results.tipPercentage}% of bill</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h4>
              <p className="text-lg font-semibold">{formatCurrency(results.totalAmount)}</p>
              <p className="text-xs text-gray-500 mt-1">Bill + Tip{roundUp ? ' (rounded up)' : ''}</p>
            </div>
            
            {results.people > 1 && (
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                  <FaUsers className="mr-2 text-primary-600" /> Split Between {results.people} People
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Tip Per Person</h4>
                    <p className="text-lg font-semibold">{formatCurrency(results.tipPerPerson)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Total Per Person</h4>
                    <p className="text-lg font-semibold">{formatCurrency(results.totalPerPerson)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tipping Guide</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <h4 className="text-md font-medium text-gray-700 mb-2">Standard Tipping Percentages:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>10-15%: Adequate service</li>
              <li>15-18%: Good service (standard in most restaurants)</li>
              <li>20-25%: Excellent service</li>
              <li>25%+: Exceptional service or large groups</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default TipCalculator;
