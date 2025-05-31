import React, { useState, useEffect } from 'react';
import { FaHome, FaCalculator, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState(30);
  const [downPayment, setDownPayment] = useState('');
  const [downPaymentType, setDownPaymentType] = useState('percentage');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [propertyTax, setPropertyTax] = useState('');
  const [homeInsurance, setHomeInsurance] = useState('');
  const [pmi, setPmi] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  
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
    { code: 'ZAR', name: 'South African Rand (R)', symbol: 'R' },
    { code: 'AED', name: 'UAE Dirham (د.إ)', symbol: 'د.إ' },
    { code: 'PLN', name: 'Polish Złoty (zł)', symbol: 'zł' }
  ];

  // Calculate down payment amount when type or value changes
  useEffect(() => {
    if (loanAmount && downPayment) {
      const loanAmountValue = parseFloat(loanAmount);
      const downPaymentValue = parseFloat(downPayment);
      
      if (!isNaN(loanAmountValue) && !isNaN(downPaymentValue)) {
        if (downPaymentType === 'percentage') {
          const downPaymentAmount = (loanAmountValue * downPaymentValue) / 100;
          setResults(prevResults => 
            prevResults ? { ...prevResults, downPaymentAmount } : null
          );
        } else {
          const downPaymentPercentage = (downPaymentValue / loanAmountValue) * 100;
          setResults(prevResults => 
            prevResults ? { ...prevResults, downPaymentPercentage } : null
          );
        }
      }
    }
  }, [loanAmount, downPayment, downPaymentType]);

  const handleCalculate = () => {
    setError('');
    setResults(null);
    setAmortizationSchedule([]);
    setShowAmortization(false);

    // Validate inputs
    if (!loanAmount || !interestRate || !loanTerm) {
      setError('Please fill in all required fields');
      return;
    }

    const loanAmountValue = parseFloat(loanAmount);
    const interestRateValue = parseFloat(interestRate);
    const loanTermValue = parseInt(loanTerm);
    let downPaymentValue = parseFloat(downPayment) || 0;
    const propertyTaxValue = parseFloat(propertyTax) || 0;
    const homeInsuranceValue = parseFloat(homeInsurance) || 0;
    const pmiValue = parseFloat(pmi) || 0;

    if (isNaN(loanAmountValue) || isNaN(interestRateValue) || isNaN(loanTermValue)) {
      setError('Please enter valid numbers for loan amount, interest rate, and loan term');
      return;
    }

    if (loanAmountValue <= 0 || interestRateValue <= 0 || loanTermValue <= 0) {
      setError('Loan amount, interest rate, and loan term must be greater than zero');
      return;
    }

    // Calculate down payment amount
    let downPaymentAmount = 0;
    let downPaymentPercentage = 0;
    let homePriceValue = loanAmountValue;

    if (downPaymentValue > 0) {
      if (downPaymentType === 'percentage') {
        downPaymentAmount = (loanAmountValue * downPaymentValue) / 100;
        downPaymentPercentage = downPaymentValue;
        homePriceValue = loanAmountValue + downPaymentAmount;
      } else {
        downPaymentAmount = downPaymentValue;
        downPaymentPercentage = (downPaymentValue / loanAmountValue) * 100;
        homePriceValue = loanAmountValue + downPaymentAmount;
      }
    }

    // Calculate principal loan amount
    const principalLoanAmount = homePriceValue - downPaymentAmount;

    // Calculate payment frequency multiplier
    let paymentsPerYear = 12; // monthly by default
    let paymentFrequencyName = 'Monthly';
    
    switch (paymentFrequency) {
      case 'biweekly':
        paymentsPerYear = 26;
        paymentFrequencyName = 'Bi-weekly';
        break;
      case 'weekly':
        paymentsPerYear = 52;
        paymentFrequencyName = 'Weekly';
        break;
      case 'semimonthly':
        paymentsPerYear = 24;
        paymentFrequencyName = 'Semi-monthly';
        break;
      default:
        paymentsPerYear = 12;
        paymentFrequencyName = 'Monthly';
    }

    // Calculate total number of payments
    const totalPayments = loanTermValue * paymentsPerYear;
    
    // Calculate periodic interest rate
    const periodicInterestRate = (interestRateValue / 100) / paymentsPerYear;
    
    // Calculate mortgage payment (principal + interest)
    const mortgagePayment = principalLoanAmount * 
      (periodicInterestRate * Math.pow(1 + periodicInterestRate, totalPayments)) / 
      (Math.pow(1 + periodicInterestRate, totalPayments) - 1);
    
    // Calculate monthly additional costs
    const monthlyPropertyTax = propertyTaxValue / 12;
    const monthlyHomeInsurance = homeInsuranceValue / 12;
    const monthlyPmi = pmiValue / 12;
    
    // Calculate total monthly payment
    const totalMonthlyPayment = mortgagePayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyPmi;
    
    // Calculate total payment over loan term
    const totalPaymentOverTerm = totalMonthlyPayment * totalPayments;
    const totalInterestPaid = totalPaymentOverTerm - principalLoanAmount;

    // Generate amortization schedule
    const schedule = [];
    let remainingBalance = principalLoanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = remainingBalance * periodicInterestRate;
      const principalPayment = mortgagePayment - interestPayment;
      remainingBalance -= principalPayment;
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;

      // Only add to schedule for yearly intervals to keep it manageable
      if (i % paymentsPerYear === 0) {
        schedule.push({
          paymentNumber: i,
          paymentDate: `Year ${i / paymentsPerYear}`,
          principalPayment: principalPayment.toFixed(2),
          interestPayment: interestPayment.toFixed(2),
          totalPayment: mortgagePayment.toFixed(2),
          remainingBalance: Math.max(0, remainingBalance).toFixed(2),
          totalInterestPaid: totalInterest.toFixed(2),
          totalPrincipalPaid: totalPrincipal.toFixed(2)
        });
      }
    }

    setAmortizationSchedule(schedule);
    
    setResults({
      homePriceValue,
      principalLoanAmount,
      downPaymentAmount,
      downPaymentPercentage,
      mortgagePayment,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      monthlyPmi,
      totalMonthlyPayment,
      totalPaymentOverTerm,
      totalInterestPaid,
      paymentFrequencyName,
      paymentsPerYear,
      totalPayments
    });
  };

  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm(30);
    setDownPayment('');
    setDownPaymentType('percentage');
    setPaymentFrequency('monthly');
    setPropertyTax('');
    setHomeInsurance('');
    setPmi('');
    // Don't reset currency to preserve user preference
    setResults(null);
    setError('');
    setAmortizationSchedule([]);
    setShowAmortization(false);
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
        title="Mortgage Calculator"
        description="Calculate monthly mortgage payments, total interest, and generate amortization schedules for home loans."
        keywords="mortgage calculator, home loan calculator, mortgage payment, amortization schedule, house payment calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Mortgage Calculator</h1>
        <p className="calculator-description">
          Calculate monthly mortgage payments, total interest, and generate amortization schedules for home loans.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Home Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHome className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="loanAmount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 300000"
                  min="0"
                  step="1000"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (% per year)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaChartLine className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 5.5"
                  min="0"
                  max="30"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term (years)
              </label>
              <select
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="30">30 years</option>
                <option value="20">20 years</option>
                <option value="15">15 years</option>
                <option value="10">10 years</option>
                <option value="5">5 years</option>
              </select>
            </div>

            <div>
              <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency
              </label>
              <select
                id="paymentFrequency"
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="monthly">Monthly</option>
                <option value="semimonthly">Semi-monthly (24/year)</option>
                <option value="biweekly">Bi-weekly (26/year)</option>
                <option value="weekly">Weekly (52/year)</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={downPaymentType === 'percentage' ? 'e.g., 20' : 'e.g., 60000'}
                  min="0"
                  step={downPaymentType === 'percentage' ? '0.1' : '1000'}
                />
              </div>
              <select
                value={downPaymentType}
                onChange={(e) => setDownPaymentType(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="percentage">%</option>
                <option value="amount">$</option>
              </select>
            </div>
            {results && downPayment && (
              <p className="text-xs text-gray-500 mt-1">
                {downPaymentType === 'percentage' 
                  ? `$${results.downPaymentAmount?.toFixed(2)} (${downPayment}%)`
                  : `$${downPayment} (${results.downPaymentPercentage?.toFixed(2)}%)`
                }
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Additional Costs (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Tax ($/year)
                </label>
                <input
                  type="number"
                  id="propertyTax"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 3600"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="homeInsurance" className="block text-sm font-medium text-gray-700 mb-1">
                  Home Insurance ($/year)
                </label>
                <input
                  type="number"
                  id="homeInsurance"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 1200"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="pmi" className="block text-sm font-medium text-gray-700 mb-1">
                  PMI ($/month)
                </label>
                <input
                  type="number"
                  id="pmi"
                  value={pmi}
                  onChange={(e) => setPmi(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 100"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Private Mortgage Insurance (typically required if down payment is less than 20%)
                </p>
              </div>
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
            <FaCalculator className="mr-2" /> Calculate Mortgage
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
              <FaHome className="mr-2 text-primary-600" /> Mortgage Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">{results.paymentFrequencyName} Payment (Principal & Interest)</h4>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(results.mortgagePayment)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total {results.paymentFrequencyName} Payment</h4>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(results.totalMonthlyPayment)}</p>
                <p className="text-xs text-gray-500 mt-1">Including taxes, insurance, and PMI</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Loan Amount</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.principalLoanAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">After down payment of {formatCurrency(results.downPaymentAmount)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Interest Paid</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.totalInterestPaid)}</p>
                <p className="text-xs text-gray-500 mt-1">Over the life of the loan</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Cost</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.totalPaymentOverTerm)}</p>
                <p className="text-xs text-gray-500 mt-1">Principal + Interest over {loanTerm} years</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Property Tax</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.monthlyPropertyTax)}/month</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(parseFloat(propertyTax) || 0)}/year</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Home Insurance</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.monthlyHomeInsurance)}/month</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(parseFloat(homeInsurance) || 0)}/year</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">PMI</h4>
                <p className="text-lg font-semibold">{formatCurrency(results.monthlyPmi)}/month</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(results.monthlyPmi * 12)}/year</p>
              </div>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
              >
                {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
              </button>
            </div>
            
            {showAmortization && amortizationSchedule.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Year</th>
                      <th className="py-2 px-4 border-b text-right">Principal</th>
                      <th className="py-2 px-4 border-b text-right">Interest</th>
                      <th className="py-2 px-4 border-b text-right">Total Payment</th>
                      <th className="py-2 px-4 border-b text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.map((payment, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 border-b">{payment.paymentDate}</td>
                        <td className="py-2 px-4 border-b text-right">{formatCurrency(parseFloat(payment.principalPayment))}</td>
                        <td className="py-2 px-4 border-b text-right">{formatCurrency(parseFloat(payment.interestPayment))}</td>
                        <td className="py-2 px-4 border-b text-right">{formatCurrency(parseFloat(payment.totalPayment))}</td>
                        <td className="py-2 px-4 border-b text-right">{formatCurrency(parseFloat(payment.remainingBalance))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About Mortgage Calculations</h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              This calculator estimates your mortgage payments based on the information you provide. It uses the standard amortization formula to calculate principal and interest payments.
            </p>
            <p>
              The results include your monthly payment (principal and interest), as well as the total monthly payment including property taxes, home insurance, and private mortgage insurance (PMI) if applicable.
            </p>
            <p>
              For a more accurate estimate, consult with a mortgage lender who can provide specific rates and terms based on your financial situation and current market conditions.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default MortgageCalculator;
