import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaChartLine } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const ROICalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [timeInYears, setTimeInYears] = useState('');
  const [additionalCosts, setAdditionalCosts] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleInitialInvestmentChange = (e) => {
    const value = e.target.value;
    setInitialInvestment(value);
    setResults(null);
    setError('');
  };

  const handleFinalValueChange = (e) => {
    const value = e.target.value;
    setFinalValue(value);
    setResults(null);
    setError('');
  };

  const handleTimeInYearsChange = (e) => {
    const value = e.target.value;
    setTimeInYears(value);
    setResults(null);
    setError('');
  };

  const handleAdditionalCostsChange = (e) => {
    const value = e.target.value;
    setAdditionalCosts(value);
    setResults(null);
    setError('');
  };

  const validateInputs = () => {
    setError('');

    if (!initialInvestment || isNaN(parseFloat(initialInvestment)) || parseFloat(initialInvestment) <= 0) {
      setError('Please enter a valid initial investment (must be a positive number)');
      return false;
    }

    if (!finalValue || isNaN(parseFloat(finalValue)) || parseFloat(finalValue) < 0) {
      setError('Please enter a valid final value (must be a non-negative number)');
      return false;
    }

    // Time is optional for basic ROI calculation
    if (timeInYears && (isNaN(parseFloat(timeInYears)) || parseFloat(timeInYears) <= 0)) {
      setError('Please enter a valid time period (must be a positive number)');
      return false;
    }

    // Additional costs is optional
    if (additionalCosts && (isNaN(parseFloat(additionalCosts)) || parseFloat(additionalCosts) < 0)) {
      setError('Please enter valid additional costs (must be a non-negative number)');
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const investment = parseFloat(initialInvestment);
    const finalVal = parseFloat(finalValue);
    const costs = additionalCosts ? parseFloat(additionalCosts) : 0;
    const time = timeInYears ? parseFloat(timeInYears) : null;

    const totalCosts = investment + costs;
    const netProfit = finalVal - totalCosts;
    const roi = (netProfit / totalCosts) * 100;
    
    let annualizedROI = null;
    if (time && time > 0) {
      // Calculate annualized ROI using the formula: (1 + ROI)^(1/t) - 1
      annualizedROI = (Math.pow(1 + (roi / 100), 1 / time) - 1) * 100;
    }

    setResults({
      initialInvestment: investment,
      finalValue: finalVal,
      additionalCosts: costs,
      totalCosts,
      netProfit,
      roi,
      timeInYears: time,
      annualizedROI
    });
  };

  const handleReset = () => {
    setInitialInvestment('');
    setFinalValue('');
    setTimeInYears('');
    setAdditionalCosts('');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  return (
    <>
      <SEO
        title="ROI Calculator - Return on Investment Calculator"
        description="Calculate your return on investment (ROI) and annualized ROI. Analyze the profitability of your investments with this easy-to-use ROI calculator."
        keywords="ROI calculator, return on investment, investment calculator, profit calculator, annualized ROI, investment return"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">ROI Calculator</h1>
        <p className="calculator-description">
          Calculate your Return on Investment (ROI) and analyze the profitability of your investments.
          This calculator helps you determine both simple ROI and annualized ROI.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-primary-500" /> 
              ROI Calculator
            </h2>

            <div className="mb-4">
              <label htmlFor="initialInvestment" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Investment
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="initialInvestment"
                  value={initialInvestment}
                  onChange={handleInitialInvestmentChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter initial investment amount"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="finalValue" className="block text-sm font-medium text-gray-700 mb-1">
                Final Value
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="finalValue"
                  value={finalValue}
                  onChange={handleFinalValueChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter final value of investment"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="additionalCosts" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Costs (optional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="additionalCosts"
                  value={additionalCosts}
                  onChange={handleAdditionalCostsChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter any additional costs"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="timeInYears" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period in Years (for Annualized ROI)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="timeInYears"
                  value={timeInYears}
                  onChange={handleTimeInYearsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter investment time period"
                  min="0.01"
                  step="0.01"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">years</span>
              </div>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculate}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Calculate ROI
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
                    Return on Investment (ROI)
                  </h3>
                  <p className={`text-2xl font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(results.roi)}
                  </p>
                </div>
                
                {results.annualizedROI !== null && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-800 mb-2">
                      Annualized ROI
                    </h3>
                    <p className={`text-2xl font-bold ${results.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(results.annualizedROI)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Net Profit/Loss
                  </h3>
                  <p className={`text-xl font-bold ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.netProfit)}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Investment
                  </h3>
                  <p className="text-xl font-bold text-primary-600">
                    {formatCurrency(results.totalCosts)}
                  </p>
                </div>
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
                    <p>1. Initial Investment: {formatCurrency(results.initialInvestment)}</p>
                    
                    {results.additionalCosts > 0 && (
                      <p>2. Additional Costs: {formatCurrency(results.additionalCosts)}</p>
                    )}
                    
                    <p>{results.additionalCosts > 0 ? '3' : '2'}. Total Investment: {formatCurrency(results.initialInvestment)} {results.additionalCosts > 0 ? `+ ${formatCurrency(results.additionalCosts)}` : ''} = {formatCurrency(results.totalCosts)}</p>
                    
                    <p>{results.additionalCosts > 0 ? '4' : '3'}. Final Value: {formatCurrency(results.finalValue)}</p>
                    
                    <p>{results.additionalCosts > 0 ? '5' : '4'}. Net Profit/Loss = Final Value - Total Investment</p>
                    <p>   = {formatCurrency(results.finalValue)} - {formatCurrency(results.totalCosts)}</p>
                    <p>   = {formatCurrency(results.netProfit)}</p>
                    
                    <p>{results.additionalCosts > 0 ? '6' : '5'}. ROI = (Net Profit / Total Investment) × 100%</p>
                    <p>   = ({formatCurrency(results.netProfit)} / {formatCurrency(results.totalCosts)}) × 100%</p>
                    <p>   = {formatPercentage(results.roi)}</p>
                    
                    {results.annualizedROI !== null && (
                      <>
                        <p>{results.additionalCosts > 0 ? '7' : '6'}. Time Period: {results.timeInYears} years</p>
                        <p>{results.additionalCosts > 0 ? '8' : '7'}. Annualized ROI = ((1 + ROI)^(1/Time Period)) - 1</p>
                        <p>   = ((1 + {(results.roi / 100).toFixed(4)})^(1/{results.timeInYears})) - 1</p>
                        <p>   = {formatPercentage(results.annualizedROI)}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Return on Investment (ROI)</h2>
          <div className="space-y-2">
            <p>
              <strong>Return on Investment (ROI)</strong> is a performance measure used to evaluate the efficiency or profitability of an investment.
            </p>
            <p>
              ROI is calculated by dividing the net profit (or loss) from an investment by the cost of the investment, then expressing the result as a percentage.
            </p>
            <p>
              <strong>ROI Formula:</strong> ROI = (Net Profit / Total Investment) × 100%
            </p>
            <p>
              <strong>Annualized ROI</strong> takes into account the time period of the investment, providing a yearly rate of return that can be used to compare investments of different durations.
            </p>
            <p>
              <strong>Annualized ROI Formula:</strong> Annualized ROI = ((1 + ROI)^(1/t)) - 1
            </p>
            <p>
              Where t is the time period in years.
            </p>
            <p>
              <strong>Note:</strong> A positive ROI indicates a profitable investment, while a negative ROI indicates a loss.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default ROICalculator;
