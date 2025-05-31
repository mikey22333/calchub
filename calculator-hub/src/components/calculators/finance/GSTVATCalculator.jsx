import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaExchangeAlt } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const GSTVATCalculator = () => {
  const [calculationType, setCalculationType] = useState('addTax'); // 'addTax' or 'removeTax'
  const [amount, setAmount] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [taxType, setTaxType] = useState('gst'); // 'gst' or 'vat'

  // Common tax rates for different countries
  const commonRates = {
    gst: [
      { country: 'India', rates: [0, 5, 12, 18, 28] },
      { country: 'Singapore', rates: [8] },
      { country: 'Australia', rates: [10] },
      { country: 'New Zealand', rates: [15] },
      { country: 'Malaysia', rates: [6] },
      { country: 'Custom', rates: [] }
    ],
    vat: [
      { country: 'United Kingdom', rates: [0, 5, 20] },
      { country: 'Germany', rates: [7, 19] },
      { country: 'France', rates: [5.5, 10, 20] },
      { country: 'Italy', rates: [4, 10, 22] },
      { country: 'Spain', rates: [4, 10, 21] },
      { country: 'Custom', rates: [] }
    ]
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setResults(null);
    setError('');
  };

  const handleTaxRateChange = (e) => {
    const value = e.target.value;
    setTaxRate(value);
    setResults(null);
    setError('');
  };

  const handleCustomRateChange = (e) => {
    const value = e.target.value;
    setCustomRate(value);
    setResults(null);
    setError('');
  };

  const handleCalculationTypeChange = (type) => {
    setCalculationType(type);
    setResults(null);
    setError('');
  };

  const handleTaxTypeChange = (type) => {
    setTaxType(type);
    setTaxRate('');
    setResults(null);
    setError('');
  };

  const validateInputs = () => {
    setError('');

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      setError('Please enter a valid amount (must be a positive number)');
      return false;
    }

    let effectiveTaxRate;
    if (taxRate === 'custom') {
      if (!customRate || isNaN(parseFloat(customRate)) || parseFloat(customRate) < 0) {
        setError('Please enter a valid custom tax rate (must be a positive number)');
        return false;
      }
      effectiveTaxRate = parseFloat(customRate);
    } else if (!taxRate) {
      setError('Please select a tax rate');
      return false;
    } else {
      effectiveTaxRate = parseFloat(taxRate);
    }

    if (effectiveTaxRate > 100) {
      setError('Tax rate cannot exceed 100%');
      return false;
    }

    return {
      amount: parseFloat(amount),
      taxRate: effectiveTaxRate
    };
  };

  const calculate = () => {
    const validInputs = validateInputs();
    if (!validInputs) return;

    const { amount: validAmount, taxRate: validTaxRate } = validInputs;

    let taxAmount, totalAmount, amountExcludingTax;

    if (calculationType === 'addTax') {
      // Calculate tax to be added to the amount
      taxAmount = (validAmount * validTaxRate) / 100;
      totalAmount = validAmount + taxAmount;
      amountExcludingTax = validAmount;
    } else {
      // Extract tax from the amount (reverse calculation)
      amountExcludingTax = (validAmount * 100) / (100 + validTaxRate);
      taxAmount = validAmount - amountExcludingTax;
      totalAmount = validAmount;
    }

    setResults({
      originalAmount: validAmount,
      taxRate: validTaxRate,
      taxAmount,
      totalAmount,
      amountExcludingTax,
      calculationType
    });
  };

  const handleReset = () => {
    setAmount('');
    setTaxRate('');
    setCustomRate('');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <SEO
        title={`${taxType.toUpperCase()} Calculator - Calculate ${taxType.toUpperCase()} Tax`}
        description={`Calculate ${taxType.toUpperCase()} (${taxType === 'gst' ? 'Goods and Services Tax' : 'Value Added Tax'}) for any amount. Add or remove tax with different tax rates.`}
        keywords={`${taxType} calculator, ${taxType === 'gst' ? 'goods and services tax' : 'value added tax'}, tax calculator, add tax, remove tax, inclusive tax, exclusive tax`}
      />

      <div className="calculator-container">
        <h1 className="calculator-title">
          {taxType.toUpperCase()} Calculator ({taxType === 'gst' ? 'Goods and Services Tax' : 'Value Added Tax'})
        </h1>
        <p className="calculator-description">
          Calculate {taxType === 'gst' ? 'Goods and Services Tax (GST)' : 'Value Added Tax (VAT)'} for any amount. 
          You can add tax to a price or extract tax from an inclusive price.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FaCalculator className="mr-2 text-primary-500" /> 
                {taxType.toUpperCase()} Calculator
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTaxTypeChange('gst')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    taxType === 'gst'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  GST
                </button>
                <button
                  onClick={() => handleTaxTypeChange('vat')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    taxType === 'vat'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  VAT
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleCalculationTypeChange('addTax')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    calculationType === 'addTax'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Add Tax (Exclusive)
                </button>
                <button
                  type="button"
                  onClick={() => handleCalculationTypeChange('removeTax')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    calculationType === 'removeTax'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Extract Tax (Inclusive)
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                {calculationType === 'addTax' ? 'Amount (Excluding Tax)' : 'Amount (Including Tax)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                {taxType.toUpperCase()} Rate
              </label>
              <select
                id="taxRate"
                value={taxRate}
                onChange={handleTaxRateChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a tax rate</option>
                {commonRates[taxType].map((country, countryIndex) => (
                  <optgroup key={countryIndex} label={country.country}>
                    {country.country !== 'Custom' ? (
                      country.rates.map((rate, rateIndex) => (
                        <option key={`${countryIndex}-${rateIndex}`} value={rate}>
                          {rate}%
                        </option>
                      ))
                    ) : (
                      <option value="custom">Custom Rate</option>
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            {taxRate === 'custom' && (
              <div className="mb-4">
                <label htmlFor="customRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="customRate"
                  value={customRate}
                  onChange={handleCustomRateChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter custom tax rate"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            )}

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculate}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Reset"
            >
              <FaRedo />
            </button>
          </div>

          {results && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Results:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    {calculationType === 'addTax' ? 'Amount (Excluding Tax)' : 'Amount (Excluding Tax)'}
                  </h3>
                  <p className="text-2xl font-bold text-primary-600">
                    ${formatCurrency(results.amountExcludingTax)}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    {taxType.toUpperCase()} Amount ({results.taxRate}%)
                  </h3>
                  <p className="text-2xl font-bold text-secondary-600">
                    ${formatCurrency(results.taxAmount)}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Total Amount (Including Tax)
                </h3>
                <p className="text-2xl font-bold text-tertiary-600">
                  ${formatCurrency(results.totalAmount)}
                </p>
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
                    {calculationType === 'addTax' ? (
                      <>
                        <p>1. Original amount: ${formatCurrency(results.amountExcludingTax)}</p>
                        <p>2. {taxType.toUpperCase()} rate: {results.taxRate}%</p>
                        <p>3. {taxType.toUpperCase()} amount = Original amount × ({taxType.toUpperCase()} rate / 100)</p>
                        <p>   = ${formatCurrency(results.amountExcludingTax)} × ({results.taxRate}% / 100)</p>
                        <p>   = ${formatCurrency(results.amountExcludingTax)} × {results.taxRate / 100}</p>
                        <p>   = ${formatCurrency(results.taxAmount)}</p>
                        <p>4. Total amount = Original amount + {taxType.toUpperCase()} amount</p>
                        <p>   = ${formatCurrency(results.amountExcludingTax)} + ${formatCurrency(results.taxAmount)}</p>
                        <p>   = ${formatCurrency(results.totalAmount)}</p>
                      </>
                    ) : (
                      <>
                        <p>1. Total amount (including {taxType.toUpperCase()}): ${formatCurrency(results.totalAmount)}</p>
                        <p>2. {taxType.toUpperCase()} rate: {results.taxRate}%</p>
                        <p>3. Amount excluding {taxType.toUpperCase()} = Total amount × (100 / (100 + {taxType.toUpperCase()} rate))</p>
                        <p>   = ${formatCurrency(results.totalAmount)} × (100 / (100 + {results.taxRate}))</p>
                        <p>   = ${formatCurrency(results.totalAmount)} × (100 / {100 + results.taxRate})</p>
                        <p>   = ${formatCurrency(results.totalAmount)} × {(100 / (100 + results.taxRate)).toFixed(6)}</p>
                        <p>   = ${formatCurrency(results.amountExcludingTax)}</p>
                        <p>4. {taxType.toUpperCase()} amount = Total amount - Amount excluding {taxType.toUpperCase()}</p>
                        <p>   = ${formatCurrency(results.totalAmount)} - ${formatCurrency(results.amountExcludingTax)}</p>
                        <p>   = ${formatCurrency(results.taxAmount)}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About {taxType.toUpperCase()}</h2>
          <div className="space-y-2">
            {taxType === 'gst' ? (
              <>
                <p>
                  <strong>Goods and Services Tax (GST)</strong> is a value-added tax levied on most goods and services sold for domestic consumption.
                </p>
                <p>
                  GST is paid by consumers, but it is remitted to the government by the businesses selling the goods and services.
                </p>
                <p>
                  GST is implemented in many countries including India, Australia, New Zealand, Singapore, and Malaysia, with different rates and structures.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Value Added Tax (VAT)</strong> is a consumption tax placed on a product whenever value is added at each stage of the supply chain, from production to the point of sale.
                </p>
                <p>
                  VAT is collected by the end retailer and is usually a percentage of the final price paid by the consumer.
                </p>
                <p>
                  VAT is widely used throughout the European Union and many other countries around the world, with rates varying by country.
                </p>
              </>
            )}
            <p>
              <strong>Exclusive vs. Inclusive:</strong>
            </p>
            <p>
              - <strong>Exclusive calculation</strong> (Add Tax): Calculates the tax amount to be added to a price that doesn't include tax.
            </p>
            <p>
              - <strong>Inclusive calculation</strong> (Extract Tax): Extracts the tax amount from a price that already includes tax.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default GSTVATCalculator;
