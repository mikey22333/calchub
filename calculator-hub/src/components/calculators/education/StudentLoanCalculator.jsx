import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaRedo, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const StudentLoanCalculator = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    paymentFrequency: 'monthly',
    gracePeriod: '0',
    additionalPayment: '0',
  });
  
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showAmortization, setShowAmortization] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Payment frequency options
  const paymentFrequencies = {
    monthly: { label: 'Monthly', paymentsPerYear: 12 },
    biweekly: { label: 'Bi-weekly', paymentsPerYear: 26 },
    weekly: { label: 'Weekly', paymentsPerYear: 52 },
  };

  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
    { code: 'EUR', symbol: '€', label: 'Euro (€)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  ];

  // Get currency symbol
  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  };

  // Format currency
  const formatCurrency = (amount, currencyCode = currency) => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setResults(null);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    if (results) {
      calculateLoan(); // Recalculate with new currency
    }
  };

  const validateInputs = () => {
    setError('');
    
    const { loanAmount, interestRate, loanTerm } = formData;
    
    if (!loanAmount || !interestRate || !loanTerm) {
      setError('Please fill in all required fields');
      return false;
    }
    
    const loanAmountNum = Number(loanAmount);
    const interestRateNum = Number(interestRate);
    const loanTermNum = Number(loanTerm);
    
    if (isNaN(loanAmountNum) || loanAmountNum <= 0) {
      setError('Please enter a valid loan amount');
      return false;
    }
    
    if (isNaN(interestRateNum) || interestRateNum < 0 || interestRateNum > 30) {
      setError('Please enter a valid interest rate between 0 and 30');
      return false;
    }
    
    if (isNaN(loanTermNum) || loanTermNum <= 0 || loanTermNum > 50) {
      setError('Please enter a valid loan term between 1 and 50 years');
      return false;
    }
    
    return true;
  };

  const calculateLoan = () => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }
    
    const loanAmount = parseFloat(formData.loanAmount);
    const annualInterestRate = parseFloat(formData.interestRate) / 100;
    const loanTermYears = parseInt(formData.loanTerm);
    const gracePeriodMonths = parseInt(formData.gracePeriod);
    const additionalPayment = parseFloat(formData.additionalPayment) || 0;
    const frequency = formData.paymentFrequency;
    
    // Calculate payments per year based on frequency
    const paymentsPerYear = paymentFrequencies[frequency].paymentsPerYear;
    
    // Calculate total number of payments
    const totalPayments = loanTermYears * paymentsPerYear;
    
    // Calculate periodic interest rate
    const periodicInterestRate = annualInterestRate / paymentsPerYear;
    
    // Calculate standard payment amount (without additional payment)
    let standardPayment = 0;
    if (annualInterestRate === 0) {
      // For zero interest loans
      standardPayment = loanAmount / totalPayments;
    } else {
      // Standard amortization formula
      standardPayment = loanAmount * 
        (periodicInterestRate * Math.pow(1 + periodicInterestRate, totalPayments)) / 
        (Math.pow(1 + periodicInterestRate, totalPayments) - 1);
    }
    
    // Calculate payment with additional payment
    const paymentAmount = standardPayment + additionalPayment;
    
    // Generate amortization schedule
    const amortizationSchedule = [];
    let balance = loanAmount;
    let totalInterest = 0;
    let paymentNumber = 1;
    let actualPayments = 0;
    
    // Add grace period (interest accrues but no payments)
    if (gracePeriodMonths > 0) {
      for (let i = 1; i <= gracePeriodMonths; i++) {
        const interestPayment = balance * periodicInterestRate;
        balance += interestPayment;
        totalInterest += interestPayment;
        
        amortizationSchedule.push({
          paymentNumber: i,
          payment: 0,
          principal: 0,
          interest: interestPayment,
          balance: balance,
          type: 'grace'
        });
      }
      paymentNumber = gracePeriodMonths + 1;
    }
    
    // Regular payments
    while (balance > 0 && paymentNumber <= totalPayments + gracePeriodMonths) {
      const interestPayment = balance * periodicInterestRate;
      let principalPayment = paymentAmount - interestPayment;
      
      // Adjust last payment if it would overpay
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      const payment = principalPayment + interestPayment;
      balance -= principalPayment;
      totalInterest += interestPayment;
      actualPayments++;
      
      amortizationSchedule.push({
        paymentNumber: paymentNumber,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance,
        type: 'payment'
      });
      
      // Break if balance is paid off
      if (balance <= 0) break;
      
      paymentNumber++;
    }
    
    // Calculate total payment
    const totalPayment = loanAmount + totalInterest;
    
    // Calculate time saved (in months) due to additional payments
    const timeSaved = totalPayments - actualPayments;
    const timeSavedYears = Math.floor(timeSaved / paymentsPerYear);
    const timeSavedMonths = Math.round((timeSaved % paymentsPerYear) * (12 / paymentsPerYear));
    
    // Calculate money saved on interest due to additional payments
    const standardTotalInterest = standardPayment * totalPayments - loanAmount;
    const interestSaved = standardTotalInterest - totalInterest;
    
    setResults({
      paymentAmount: standardPayment,
      totalPaymentWithExtra: paymentAmount,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      numberOfPayments: actualPayments,
      amortizationSchedule: amortizationSchedule,
      timeSavedYears: timeSavedYears,
      timeSavedMonths: timeSavedMonths,
      interestSaved: interestSaved,
      paymentFrequency: frequency,
      additionalPayment: additionalPayment
    });
  };

  const handleReset = () => {
    setFormData({
      loanAmount: '',
      interestRate: '',
      loanTerm: '',
      paymentFrequency: 'monthly',
      gracePeriod: '0',
      additionalPayment: '0',
    });
    setResults(null);
    setError('');
    setShowAmortization(false);
  };

  // Generate summary of payments by year
  const generateYearlySummary = () => {
    if (!results || !results.amortizationSchedule) return [];
    
    const yearlySummary = [];
    let currentYear = 1;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    let paymentCount = 0;
    
    results.amortizationSchedule.forEach((payment, index) => {
      if (payment.type === 'payment') {
        yearlyPrincipal += payment.principal;
        yearlyInterest += payment.interest;
        paymentCount++;
        
        const paymentsPerYear = paymentFrequencies[results.paymentFrequency].paymentsPerYear;
        
        // If we've reached a year's worth of payments or it's the last payment
        if (paymentCount % paymentsPerYear === 0 || index === results.amortizationSchedule.length - 1) {
          yearlySummary.push({
            year: currentYear,
            principal: yearlyPrincipal,
            interest: yearlyInterest,
            total: yearlyPrincipal + yearlyInterest,
            balance: payment.balance
          });
          
          currentYear++;
          yearlyPrincipal = 0;
          yearlyInterest = 0;
        }
      }
    });
    
    return yearlySummary;
  };

  return (
    <>
      <SEO
        title="Student Loan Calculator"
        description="Calculate student loan payments, interest costs, and create a repayment schedule to help plan your education financing."
        keywords="student loan calculator, education loans, loan repayment, student debt, college loans, loan amortization, financial aid"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Student Loan Calculator</h1>
        <p className="calculator-description">
          Calculate your student loan payments, total interest, and create a detailed repayment schedule to help plan your education financing.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-primary-500" /> Loan Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getCurrencySymbol(currency)}</span>
                  </div>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 25000"
                    min="0"
                    step="100"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      id="currency"
                      name="currency"
                      value={currency}
                      onChange={handleCurrencyChange}
                      className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      {currencies.map(curr => (
                        <option key={curr.code} value={curr.code}>{curr.code}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%) *
                </label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 5.5"
                  min="0"
                  max="30"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (years) *
                </label>
                <input
                  type="number"
                  id="loanTerm"
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 10"
                  min="1"
                  max="50"
                  step="1"
                />
              </div>
              
              <div>
                <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  id="paymentFrequency"
                  name="paymentFrequency"
                  value={formData.paymentFrequency}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.entries(paymentFrequencies).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="gracePeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Grace Period (months)
                </label>
                <input
                  type="number"
                  id="gracePeriod"
                  name="gracePeriod"
                  value={formData.gracePeriod}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 6"
                  min="0"
                  max="60"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Period after graduation before payments begin (interest still accrues)
                </p>
              </div>
              
              <div>
                <label htmlFor="additionalPayment" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Payment
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getCurrencySymbol(currency)}</span>
                  </div>
                  <input
                    type="number"
                    id="additionalPayment"
                    name="additionalPayment"
                    value={formData.additionalPayment}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 50"
                    min="0"
                    step="10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Extra amount to pay each period (reduces total interest and time)
                </p>
              </div>
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculateLoan}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Calculate Loan
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
              <h2 className="text-lg font-semibold mb-4">Loan Summary:</h2>
              
              <div className="bg-white p-4 rounded border border-gray-300 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">{paymentFrequencies[results.paymentFrequency].label} Payment</h3>
                    <div className="text-2xl font-bold text-primary-600">{formatCurrency(results.paymentAmount)}</div>
                    {results.additionalPayment > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        With extra: {formatCurrency(results.totalPaymentWithExtra)}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Total Interest</h3>
                    <div className="text-2xl font-bold text-secondary-600">{formatCurrency(results.totalInterest)}</div>
                    {results.interestSaved > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        You save: {formatCurrency(results.interestSaved)}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center p-4 bg-accent-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Total Payment</h3>
                    <div className="text-2xl font-bold text-accent-600">{formatCurrency(results.totalPayment)}</div>
                    <p className="text-sm text-gray-600 mt-1">
                      {results.numberOfPayments} payments
                    </p>
                  </div>
                </div>
                
                {(results.timeSavedYears > 0 || results.timeSavedMonths > 0) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      <span>
                        With your additional payment of {formatCurrency(results.additionalPayment)} per {paymentFrequencies[results.paymentFrequency].label.toLowerCase()} payment, 
                        you'll pay off your loan {results.timeSavedYears > 0 ? `${results.timeSavedYears} year${results.timeSavedYears !== 1 ? 's' : ''}` : ''} 
                        {results.timeSavedYears > 0 && results.timeSavedMonths > 0 ? ' and ' : ''}
                        {results.timeSavedMonths > 0 ? `${results.timeSavedMonths} month${results.timeSavedMonths !== 1 ? 's' : ''}` : ''} earlier!
                      </span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="flex items-center gap-2 bg-primary-100 hover:bg-primary-200 text-primary-800 py-2 px-4 rounded-md transition-colors"
                >
                  <FaChartLine />
                  <span>{showAmortization ? 'Hide' : 'Show'} Payment Schedule</span>
                </button>
              </div>
              
              {showAmortization && (
                <div className="bg-white rounded border border-gray-300 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium">Yearly Payment Summary</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payment</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generateYearlySummary().map((year) => (
                          <tr key={year.year} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Year {year.year}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.principal)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.interest)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.total)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Understanding Student Loans</h2>
          <div className="space-y-2">
            <p>
              This calculator helps you understand the financial impact of your student loans:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Grace Period:</strong> Many student loans offer a grace period after graduation before payments begin, but interest may still accrue during this time</li>
              <li><strong>Additional Payments:</strong> Even small extra payments can significantly reduce your total interest and loan term</li>
              <li><strong>Payment Frequency:</strong> More frequent payments (weekly or bi-weekly) can help you pay off your loan faster</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Note: This calculator provides estimates. Actual loan terms and conditions may vary. Consult with your loan provider for specific details about your student loans.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default StudentLoanCalculator;
