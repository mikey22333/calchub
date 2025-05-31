import React, { useState } from 'react';
import { FaCalculator, FaPercentage, FaMoneyBillWave } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const InterestCalculator = () => {
  const [interestType, setInterestType] = useState('simple');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('years');
  const [compoundingFrequency, setCompoundingFrequency] = useState('annually');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    if (!principal || !rate || !time) {
      setError('Please fill in all required fields');
      return;
    }

    const principalAmount = parseFloat(principal);
    const interestRate = parseFloat(rate) / 100; // Convert percentage to decimal
    let timeInYears = parseFloat(time);

    // Convert time to years based on selected unit
    if (timeUnit === 'months') {
      timeInYears = timeInYears / 12;
    } else if (timeUnit === 'days') {
      timeInYears = timeInYears / 365;
    }

    if (isNaN(principalAmount) || isNaN(interestRate) || isNaN(timeInYears)) {
      setError('Please enter valid numbers for all fields');
      return;
    }

    if (principalAmount <= 0 || interestRate <= 0 || timeInYears <= 0) {
      setError('All values must be greater than zero');
      return;
    }

    if (interestType === 'simple') {
      calculateSimpleInterest(principalAmount, interestRate, timeInYears);
    } else {
      calculateCompoundInterest(principalAmount, interestRate, timeInYears);
    }
  };

  const calculateSimpleInterest = (principal, rate, time) => {
    const interest = principal * rate * time;
    const finalAmount = principal + interest;

    setResults({
      interestEarned: interest.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      effectiveRate: (rate * 100).toFixed(2),
      type: 'simple'
    });
  };

  const calculateCompoundInterest = (principal, rate, time) => {
    let periodsPerYear;
    
    switch (compoundingFrequency) {
      case 'annually':
        periodsPerYear = 1;
        break;
      case 'semi-annually':
        periodsPerYear = 2;
        break;
      case 'quarterly':
        periodsPerYear = 4;
        break;
      case 'monthly':
        periodsPerYear = 12;
        break;
      case 'daily':
        periodsPerYear = 365;
        break;
      default:
        periodsPerYear = 1;
    }

    const n = periodsPerYear;
    const t = time;
    const r = rate;
    const p = principal;

    // A = P(1 + r/n)^(nt)
    const finalAmount = p * Math.pow(1 + r / n, n * t);
    const interestEarned = finalAmount - p;

    // Calculate effective annual rate
    const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

    setResults({
      interestEarned: interestEarned.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      effectiveRate: effectiveRate.toFixed(2),
      compoundingPeriods: n * t,
      type: 'compound'
    });
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setTimeUnit('years');
    setCompoundingFrequency('annually');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO 
        title="Interest Calculator" 
        description="Calculate simple and compound interest with this easy-to-use calculator. See how your money grows over time."
        keywords="interest calculator, simple interest, compound interest, interest rate, investment calculator"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Interest Calculator</h1>
        <p className="calculator-description">
          Calculate how much interest you'll earn on your investments or pay on your loans with this simple and compound interest calculator.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setInterestType('simple')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                interestType === 'simple'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Simple Interest
            </button>
            <button
              onClick={() => setInterestType('compound')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                interestType === 'compound'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Compound Interest
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Amount ($)
                </label>
                <input
                  type="number"
                  id="principal"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 1000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (% per year)
                </label>
                <input
                  type="number"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 5"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 5"
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              {interestType === 'compound' && (
                <div>
                  <label htmlFor="compoundingFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Compounding Frequency
                  </label>
                  <select
                    id="compoundingFrequency"
                    value={compoundingFrequency}
                    onChange={(e) => setCompoundingFrequency(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="annually">Annually (once per year)</option>
                    <option value="semi-annually">Semi-annually (twice per year)</option>
                    <option value="quarterly">Quarterly (4 times per year)</option>
                    <option value="monthly">Monthly (12 times per year)</option>
                    <option value="daily">Daily (365 times per year)</option>
                  </select>
                </div>
              )}
            </div>
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
            <FaCalculator className="mr-2" /> Calculate Interest
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
              <FaMoneyBillWave className="mr-2 text-primary-600" /> Interest Calculation Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Principal Amount</h4>
                <p className="text-lg font-semibold">${principal}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Interest Earned</h4>
                <p className="text-lg font-semibold">${results.interestEarned}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Final Amount</h4>
                <p className="text-lg font-semibold">${results.finalAmount}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Interest Type</h4>
                <p className="text-lg font-semibold capitalize">{interestType}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Interest Rate</h4>
                <p className="text-lg font-semibold">{rate}% per year</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Time Period</h4>
                <p className="text-lg font-semibold">{time} {timeUnit}</p>
              </div>
              
              {interestType === 'compound' && (
                <>
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Compounding Frequency</h4>
                    <p className="text-lg font-semibold capitalize">{compoundingFrequency}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Effective Annual Rate</h4>
                    <p className="text-lg font-semibold">{results.effectiveRate}%</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Total Compounding Periods</h4>
                    <p className="text-lg font-semibold">{results.compoundingPeriods}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default InterestCalculator;
