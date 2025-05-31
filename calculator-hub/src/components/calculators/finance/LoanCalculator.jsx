import { useState, useEffect } from 'react';
import AdBanner from '../../layout/AdBanner';
import { FaMoneyBillWave, FaCalculator, FaChartLine } from 'react-icons/fa';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [termType, setTermType] = useState('years'); // years or months
  const [currency, setCurrency] = useState('USD');
  const [emi, setEmi] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [showAmortization, setShowAmortization] = useState(false);
  
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

  const calculateLoan = () => {
    if (!loanAmount || !interestRate || !loanTerm) return;

    // Convert interest rate from annual percentage to monthly decimal
    const monthlyInterestRate = (interestRate / 100) / 12;
    
    // Convert loan term to months if in years
    const loanTermMonths = termType === 'years' ? loanTerm * 12 : parseInt(loanTerm);
    
    // Calculate EMI using formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiValue = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths) / 
                    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    
    setEmi(emiValue.toFixed(2));
    
    const totalPaymentValue = emiValue * loanTermMonths;
    setTotalPayment(totalPaymentValue.toFixed(2));
    
    const totalInterestValue = totalPaymentValue - loanAmount;
    setTotalInterest(totalInterestValue.toFixed(2));
    
    // Generate amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyInterestRate, emiValue, loanTermMonths);
  };

  const generateAmortizationSchedule = (principal, monthlyRate, monthlyPayment, months) => {
    let balance = principal;
    let schedule = [];
    
    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      if (balance < 0) balance = 0;
      
      schedule.push({
        month,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        balance: balance.toFixed(2)
      });
      
      if (balance === 0) break;
    }
    
    setAmortizationSchedule(schedule);
  };

  // Calculate loan whenever inputs change
  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      calculateLoan();
    }
  }, [loanAmount, interestRate, loanTerm, termType]);

  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    // Don't reset currency to preserve user preference
    setEmi(null);
    setTotalPayment(null);
    setTotalInterest(null);
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
    <div className="calculator-container">
      <h1 className="calculator-title">Loan/EMI Calculator</h1>
      <p className="calculator-description">
        Calculate your monthly loan payments (EMI - Equated Monthly Installment), total payment amount, 
        and total interest paid over the life of a loan. This calculator helps you plan your finances 
        for mortgages, auto loans, personal loans, and more.
      </p>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label htmlFor="loanAmount" className="input-label">
              Loan Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMoneyBillWave className="text-gray-400" />
              </div>
              <input
                type="number"
                id="loanAmount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="input-field pl-8"
                placeholder="Enter loan amount"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="currency" className="input-label">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-field"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="interestRate" className="input-label">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="input-field pr-8"
              placeholder="Enter interest rate"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="loanTerm" className="input-label">
            Loan Term
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="loanTerm"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="input-field"
              placeholder="Enter loan term"
              min="1"
            />
            <select
              value={termType}
              onChange={(e) => setTermType(e.target.value)}
              className="input-field w-32"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button className="btn-primary" onClick={calculateLoan}>
            Calculate
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <AdBanner position="middle" />

      {emi && (
        <div className="result-container">
          <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment (EMI)</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(parseFloat(emi))}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Payment</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(parseFloat(totalPayment))}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Interest</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(parseFloat(totalInterest))}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              className="btn-secondary w-full"
              onClick={() => setShowAmortization(!showAmortization)}
            >
              {showAmortization ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}
            </button>
            
            {showAmortization && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Principal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Interest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {amortizationSchedule.slice(0, 12).map((payment) => (
                      <tr key={payment.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(parseFloat(payment.principalPayment))}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(parseFloat(payment.interestPayment))}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(parseFloat(payment.balance))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {amortizationSchedule.length > 12 && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Showing first 12 months of {amortizationSchedule.length} total payments
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
