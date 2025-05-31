import React, { useState } from 'react';
import { FaCalculator, FaPercent, FaTags } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [error, setError] = useState('');
  const [calculationMethod, setCalculationMethod] = useState('percent'); // 'percent' or 'amount'

  const handleCalculate = () => {
    setError('');
    setFinalPrice('');
    setSavedAmount('');

    // Validate inputs
    if (!originalPrice) {
      setError('Please enter the original price');
      return;
    }

    const origPrice = parseFloat(originalPrice);
    if (isNaN(origPrice) || origPrice < 0) {
      setError('Original price must be a positive number');
      return;
    }

    if (calculationMethod === 'percent') {
      if (!discountPercent) {
        setError('Please enter the discount percentage');
        return;
      }

      const discPercent = parseFloat(discountPercent);
      if (isNaN(discPercent) || discPercent < 0 || discPercent > 100) {
        setError('Discount percentage must be between 0 and 100');
        return;
      }

      // Calculate final price and saved amount
      const saved = (origPrice * discPercent) / 100;
      const final = origPrice - saved;

      setFinalPrice(final.toFixed(2));
      setSavedAmount(saved.toFixed(2));
      setDiscountAmount(saved.toFixed(2));
    } else {
      if (!discountAmount) {
        setError('Please enter the discount amount');
        return;
      }

      const discAmount = parseFloat(discountAmount);
      if (isNaN(discAmount) || discAmount < 0) {
        setError('Discount amount must be a positive number');
        return;
      }

      if (discAmount > origPrice) {
        setError('Discount amount cannot be greater than the original price');
        return;
      }

      // Calculate final price and discount percentage
      const final = origPrice - discAmount;
      const discPercent = (discAmount / origPrice) * 100;

      setFinalPrice(final.toFixed(2));
      setSavedAmount(discAmount.toFixed(2));
      setDiscountPercent(discPercent.toFixed(2));
    }
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setDiscountAmount('');
    setFinalPrice('');
    setSavedAmount('');
    setError('');
  };

  return (
    <>
      <SEO
        title="Discount Calculator"
        description="Calculate discounted prices, savings, and discount percentages with this easy-to-use discount calculator."
        keywords="discount calculator, sale price calculator, percentage off, savings calculator, price reduction"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Discount Calculator</h1>
        <p className="calculator-description">
          Calculate the final price after a discount, how much you'll save, and the discount percentage.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setCalculationMethod('percent')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                calculationMethod === 'percent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <FaPercent className="inline mr-2" /> Calculate with Percentage
            </button>
            <button
              onClick={() => setCalculationMethod('amount')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                calculationMethod === 'amount'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <FaTags className="inline mr-2" /> Calculate with Amount
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                id="originalPrice"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 100"
                min="0"
                step="0.01"
              />
            </div>

            {calculationMethod === 'percent' ? (
              <div>
                <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  id="discountPercent"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 20"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Amount ($)
                </label>
                <input
                  type="number"
                  id="discountAmount"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 20"
                  min="0"
                  step="0.01"
                />
              </div>
            )}
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
            <FaCalculator className="mr-2" /> Calculate Discount
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            Reset
          </button>
        </div>

        {finalPrice && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaTags className="mr-2 text-primary-600" /> Discount Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Original Price</h4>
                <p className="text-lg font-semibold">${parseFloat(originalPrice).toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Discount</h4>
                <p className="text-lg font-semibold">{discountPercent}% (${savedAmount})</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Final Price</h4>
                <p className="text-lg font-semibold">${finalPrice}</p>
                <p className="text-xs text-gray-500 mt-1">You save: ${savedAmount}</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
              <p className="text-sm">
                <strong>Tip:</strong> A {discountPercent}% discount means you pay {100 - parseFloat(discountPercent)}% of the original price.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use the Discount Calculator</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter the original price of the item</li>
            <li>Choose whether to calculate by percentage or amount</li>
            <li>Enter either the discount percentage or the discount amount</li>
            <li>Click "Calculate Discount" to see the results</li>
          </ol>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default DiscountCalculator;
