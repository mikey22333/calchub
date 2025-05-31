import React, { useState, useEffect } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaCreditCard, FaChartLine } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CreditCardPayoffCalculator = () => {
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minPaymentType, setMinPaymentType] = useState('percentage');
  const [minPaymentPercentage, setMinPaymentPercentage] = useState('2');
  const [minPaymentAmount, setMinPaymentAmount] = useState('');
  const [additionalPayment, setAdditionalPayment] = useState('0');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [calculationType, setCalculationType] = useState('timeToPayoff'); // 'timeToPayoff' or 'paymentAmount'
  const [desiredMonths, setDesiredMonths] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  const handleBalanceChange = (e) => {
    const value = e.target.value;
    setBalance(value);
    setResults(null);
    setError('');
  };

  const handleInterestRateChange = (e) => {
    const value = e.target.value;
    setInterestRate(value);
    setResults(null);
    setError('');
  };

  const handleMinPaymentTypeChange = (type) => {
    setMinPaymentType(type);
    setResults(null);
    setError('');
  };

  const handleMinPaymentPercentageChange = (e) => {
    const value = e.target.value;
    setMinPaymentPercentage(value);
    setResults(null);
    setError('');
  };

  const handleMinPaymentAmountChange = (e) => {
    const value = e.target.value;
    setMinPaymentAmount(value);
    setResults(null);
    setError('');
  };

  const handleAdditionalPaymentChange = (e) => {
    const value = e.target.value;
    setAdditionalPayment(value);
    setResults(null);
    setError('');
  };

  const handlePaymentAmountChange = (e) => {
    const value = e.target.value;
    setPaymentAmount(value);
    setResults(null);
    setError('');
  };

  const handleDesiredMonthsChange = (e) => {
    const value = e.target.value;
    setDesiredMonths(value);
    setResults(null);
    setError('');
  };

  const handleCalculationTypeChange = (type) => {
    setCalculationType(type);
    setResults(null);
    setError('');
  };

  // Calculate minimum payment based on user input
  const calculateMinimumPayment = (currentBalance) => {
    if (minPaymentType === 'percentage') {
      const percentage = parseFloat(minPaymentPercentage) / 100;
      return Math.max(currentBalance * percentage, 25); // Most credit cards have a minimum payment of at least $25
    } else {
      return parseFloat(minPaymentAmount);
    }
  };

  const validateInputs = () => {
    setError('');

    if (!balance || isNaN(parseFloat(balance)) || parseFloat(balance) <= 0) {
      setError('Please enter a valid credit card balance (must be a positive number)');
      return false;
    }

    if (!interestRate || isNaN(parseFloat(interestRate)) || parseFloat(interestRate) < 0) {
      setError('Please enter a valid interest rate (must be a non-negative number)');
      return false;
    }

    if (minPaymentType === 'percentage') {
      if (!minPaymentPercentage || isNaN(parseFloat(minPaymentPercentage)) || parseFloat(minPaymentPercentage) <= 0) {
        setError('Please enter a valid minimum payment percentage (must be a positive number)');
        return false;
      }
    } else {
      if (!minPaymentAmount || isNaN(parseFloat(minPaymentAmount)) || parseFloat(minPaymentAmount) <= 0) {
        setError('Please enter a valid minimum payment amount (must be a positive number)');
        return false;
      }
    }

    if (additionalPayment && (isNaN(parseFloat(additionalPayment)) || parseFloat(additionalPayment) < 0)) {
      setError('Please enter a valid additional payment amount (must be a non-negative number)');
      return false;
    }

    if (calculationType === 'timeToPayoff') {
      if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
        setError('Please enter a valid monthly payment amount (must be a positive number)');
        return false;
      }
    } else {
      if (!desiredMonths || isNaN(parseInt(desiredMonths)) || parseInt(desiredMonths) <= 0) {
        setError('Please enter a valid number of months (must be a positive integer)');
        return false;
      }
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const initialBalance = parseFloat(balance);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const additionalPmt = additionalPayment ? parseFloat(additionalPayment) : 0;

    if (calculationType === 'timeToPayoff') {
      const monthlyPayment = parseFloat(paymentAmount);
      
      // Check if payment is sufficient to cover interest
      const minRequiredPayment = calculateMinimumPayment(initialBalance);
      if (monthlyPayment < minRequiredPayment) {
        setError(`Payment must be at least the minimum payment of ${formatCurrency(minRequiredPayment)}`);
        return;
      }

      // Calculate time to payoff
      let currentBalance = initialBalance;
      let months = 0;
      let totalInterest = 0;
      let totalPaid = 0;
      const amortizationSchedule = [];

      while (currentBalance > 0 && months < 1200) { // Cap at 100 years to prevent infinite loops
        const interestThisMonth = currentBalance * monthlyInterestRate;
        const principalThisMonth = Math.min(currentBalance, monthlyPayment - interestThisMonth);
        
        totalInterest += interestThisMonth;
        totalPaid += principalThisMonth + interestThisMonth;
        currentBalance -= principalThisMonth;
        
        amortizationSchedule.push({
          month: months + 1,
          payment: principalThisMonth + interestThisMonth,
          principal: principalThisMonth,
          interest: interestThisMonth,
          remainingBalance: currentBalance
        });
        
        months++;
        
        if (currentBalance <= 0.01) { // Account for rounding errors
          currentBalance = 0;
          break;
        }
      }

      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      setResults({
        initialBalance,
        monthlyPayment,
        months,
        years,
        remainingMonths,
        totalInterest,
        totalPaid,
        amortizationSchedule,
        calculationType: 'timeToPayoff'
      });
    } else {
      // Calculate payment amount needed to pay off in desired months
      const months = parseInt(desiredMonths);
      
      // Formula: PMT = PV * r * (1+r)^n / ((1+r)^n - 1)
      // Where: PMT = payment, PV = present value (balance), r = monthly interest rate, n = number of months
      let requiredPayment;
      
      if (monthlyInterestRate === 0) {
        // If interest rate is 0, simple division
        requiredPayment = initialBalance / months;
      } else {
        const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months);
        const denominator = Math.pow(1 + monthlyInterestRate, months) - 1;
        requiredPayment = initialBalance * (numerator / denominator);
      }
      
      // Calculate amortization schedule
      let currentBalance = initialBalance;
      let totalInterest = 0;
      let totalPaid = 0;
      const amortizationSchedule = [];

      for (let i = 0; i < months; i++) {
        const interestThisMonth = currentBalance * monthlyInterestRate;
        const principalThisMonth = Math.min(currentBalance, requiredPayment - interestThisMonth);
        
        totalInterest += interestThisMonth;
        totalPaid += principalThisMonth + interestThisMonth;
        currentBalance -= principalThisMonth;
        
        amortizationSchedule.push({
          month: i + 1,
          payment: principalThisMonth + interestThisMonth,
          principal: principalThisMonth,
          interest: interestThisMonth,
          remainingBalance: currentBalance
        });
        
        if (currentBalance <= 0.01) { // Account for rounding errors
          currentBalance = 0;
          break;
        }
      }

      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      setResults({
        initialBalance,
        monthlyPayment: requiredPayment,
        months,
        years,
        remainingMonths,
        totalInterest,
        totalPaid,
        amortizationSchedule,
        calculationType: 'paymentAmount'
      });
    }
  };

  const handleReset = () => {
    setBalance('');
    setInterestRate('');
    setMinPaymentType('percentage');
    setMinPaymentPercentage('2');
    setMinPaymentAmount('');
    setAdditionalPayment('0');
    setPaymentAmount('');
    setDesiredMonths('');
    setResults(null);
    setError('');
    setShowSteps(false);
    setShowAmortization(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <SEO
        title="Credit Card Payoff Calculator - Debt Repayment Planner"
        description="Calculate how long it will take to pay off your credit card debt or determine the monthly payment needed to become debt-free in a specific timeframe."
        keywords="credit card payoff calculator, debt payoff calculator, credit card debt, debt repayment, debt free, interest calculator, minimum payment"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Credit Card Payoff Calculator</h1>
        <p className="calculator-description">
          Calculate how long it will take to pay off your credit card debt or determine the monthly payment needed to become debt-free in a specific timeframe.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FaCreditCard className="mr-2 text-primary-500" /> 
                Credit Card Payoff Calculator
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleCalculationTypeChange('timeToPayoff')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    calculationType === 'timeToPayoff'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  How long to pay off?
                </button>
                <button
                  type="button"
                  onClick={() => handleCalculationTypeChange('paymentAmount')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    calculationType === 'paymentAmount'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  What payment is needed?
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
                Current Credit Card Balance
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="balance"
                  value={balance}
                  onChange={handleBalanceChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter current balance"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Interest Rate (APR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  className="block w-full pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter annual interest rate"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Payment
              </label>
              <div className="flex space-x-4 mb-2">
                <button
                  type="button"
                  onClick={() => handleMinPaymentTypeChange('percentage')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    minPaymentType === 'percentage'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Percentage of Balance
                </button>
                <button
                  type="button"
                  onClick={() => handleMinPaymentTypeChange('fixed')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    minPaymentType === 'fixed'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Fixed Amount
                </button>
              </div>
              
              {minPaymentType === 'percentage' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={minPaymentPercentage}
                    onChange={handleMinPaymentPercentageChange}
                    className="block w-full pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter minimum payment percentage"
                    min="1"
                    max="100"
                    step="0.1"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    value={minPaymentAmount}
                    onChange={handleMinPaymentAmountChange}
                    className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter fixed minimum payment"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            {calculationType === 'timeToPayoff' ? (
              <div className="mb-4">
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    id="paymentAmount"
                    value={paymentAmount}
                    onChange={handlePaymentAmountChange}
                    className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter monthly payment"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label htmlFor="desiredMonths" className="block text-sm font-medium text-gray-700 mb-1">
                  Desired Payoff Time (months)
                </label>
                <input
                  type="number"
                  id="desiredMonths"
                  value={desiredMonths}
                  onChange={handleDesiredMonthsChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter number of months"
                  min="1"
                  step="1"
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
                    {calculationType === 'timeToPayoff' ? 'Time to Pay Off' : 'Required Monthly Payment'}
                  </h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {calculationType === 'timeToPayoff' ? (
                      <>
                        {results.years > 0 ? `${results.years} year${results.years !== 1 ? 's' : ''}` : ''}
                        {results.years > 0 && results.remainingMonths > 0 ? ' and ' : ''}
                        {results.remainingMonths > 0 || results.years === 0 ? `${results.remainingMonths} month${results.remainingMonths !== 1 ? 's' : ''}` : ''}
                      </>
                    ) : (
                      formatCurrency(results.monthlyPayment)
                    )}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Interest Paid
                  </h3>
                  <p className="text-2xl font-bold text-secondary-600">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Original Balance
                  </h3>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(results.initialBalance)}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Amount Paid
                  </h3>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(results.totalPaid)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-2 md:space-y-0">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Calculation Details' : 'Show Calculation Details'}
                </button>
                
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaChartLine className="mr-1" />
                  {showAmortization ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Details:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>1. Initial Credit Card Balance: {formatCurrency(results.initialBalance)}</p>
                    <p>2. Annual Interest Rate (APR): {parseFloat(interestRate).toFixed(2)}%</p>
                    <p>3. Monthly Interest Rate: {(parseFloat(interestRate) / 12).toFixed(4)}%</p>
                    
                    {calculationType === 'timeToPayoff' ? (
                      <>
                        <p>4. Monthly Payment: {formatCurrency(results.monthlyPayment)}</p>
                        <p>5. Total Months to Pay Off: {results.months} months ({results.years} years and {results.remainingMonths} months)</p>
                      </>
                    ) : (
                      <>
                        <p>4. Desired Payoff Time: {results.months} months ({results.years} years and {results.remainingMonths} months)</p>
                        <p>5. Required Monthly Payment: {formatCurrency(results.monthlyPayment)}</p>
                      </>
                    )}
                    
                    <p>6. Total Interest Paid: {formatCurrency(results.totalInterest)}</p>
                    <p>7. Total Amount Paid: {formatCurrency(results.totalPaid)}</p>
                    <p>8. Interest as Percentage of Original Balance: {((results.totalInterest / results.initialBalance) * 100).toFixed(2)}%</p>
                  </div>
                </div>
              )}
              
              {showAmortization && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4 overflow-x-auto">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Amortization Schedule:</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.amortizationSchedule.slice(0, 24).map((row) => (
                        <tr key={row.month}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.payment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.principal)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.interest)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.remainingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {results.amortizationSchedule.length > 24 && (
                    <p className="text-sm text-gray-500 mt-4">
                      Showing first 24 months of {results.amortizationSchedule.length} total months.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Credit Card Debt Payoff</h2>
          <div className="space-y-2">
            <p>
              <strong>Credit card debt</strong> can be expensive due to high interest rates, often ranging from 15% to 25% APR or higher.
            </p>
            <p>
              <strong>Minimum payments</strong> are typically calculated as a percentage of your balance (usually 1-3%) or a fixed amount (often $25-$35), whichever is greater.
            </p>
            <p>
              Paying only the minimum payment will result in:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A much longer time to pay off the debt</li>
              <li>Significantly more interest paid over time</li>
              <li>Less money available for other financial goals</li>
            </ul>
            <p>
              <strong>Strategies to pay off credit card debt faster:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pay more than the minimum payment whenever possible</li>
              <li>Consider balance transfer offers with lower interest rates</li>
              <li>Focus on paying off highest-interest cards first (avalanche method)</li>
              <li>Or pay off smallest balances first for psychological wins (snowball method)</li>
            </ul>
            <p>
              <strong>Note:</strong> This calculator assumes a fixed interest rate and no additional charges or purchases on the card during the payoff period.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CreditCardPayoffCalculator;
