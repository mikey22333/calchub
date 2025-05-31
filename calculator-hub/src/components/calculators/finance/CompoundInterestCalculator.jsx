import { useState } from 'react';
import { FaMoneyBillWave, FaPercentage, FaCalendarAlt } from 'react-icons/fa';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState('annually');
  const [additionalContribution, setAdditionalContribution] = useState('');
  const [contributionFrequency, setContributionFrequency] = useState('monthly');
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
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

  // Calculate compound interest
  const calculateCompoundInterest = () => {
    setError('');
    
    // Validate inputs
    if (!principal || !rate || !time) {
      setError('Please fill in all required fields');
      return;
    }
    
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const a = additionalContribution ? parseFloat(additionalContribution) : 0;
    
    if (p <= 0 || r <= 0 || t <= 0) {
      setError('Principal, rate, and time must be positive numbers');
      return;
    }
    
    let n = 1; // Compounding frequency per year
    switch (compoundingFrequency) {
      case 'annually':
        n = 1;
        break;
      case 'semi-annually':
        n = 2;
        break;
      case 'quarterly':
        n = 4;
        break;
      case 'monthly':
        n = 12;
        break;
      case 'daily':
        n = 365;
        break;
      default:
        n = 1;
    }
    
    let contributionsPerYear = 0;
    switch (contributionFrequency) {
      case 'annually':
        contributionsPerYear = 1;
        break;
      case 'semi-annually':
        contributionsPerYear = 2;
        break;
      case 'quarterly':
        contributionsPerYear = 4;
        break;
      case 'monthly':
        contributionsPerYear = 12;
        break;
      case 'bi-weekly':
        contributionsPerYear = 26;
        break;
      case 'weekly':
        contributionsPerYear = 52;
        break;
      default:
        contributionsPerYear = 12;
    }
    
    // Calculate compound interest without additional contributions
    const compoundAmount = p * Math.pow(1 + r/n, n*t);
    const interestEarned = compoundAmount - p;
    
    // Calculate compound interest with additional contributions
    let futureValue = p;
    let totalContributions = 0;
    const yearlyData = [];
    
    if (a > 0) {
      const contributionAmount = a;
      const contributionsPerPeriod = contributionsPerYear / n;
      const periodsTotal = n * t;
      
      for (let i = 1; i <= periodsTotal; i++) {
        // Apply interest for the period
        futureValue = futureValue * (1 + r/n);
        
        // Add contributions for this period
        for (let j = 0; j < contributionsPerPeriod; j++) {
          futureValue += contributionAmount;
          totalContributions += contributionAmount;
        }
        
        // Store yearly data
        if (i % n === 0) {
          const year = i / n;
          yearlyData.push({
            year,
            balance: futureValue,
            interest: futureValue - p - totalContributions,
            contributions: totalContributions
          });
        }
      }
    } else {
      // Without additional contributions, just calculate yearly balances
      for (let year = 1; year <= t; year++) {
        const balance = p * Math.pow(1 + r/n, n*year);
        yearlyData.push({
          year,
          balance,
          interest: balance - p,
          contributions: 0
        });
      }
    }
    
    setResults({
      principalAmount: p,
      interestRate: r,
      timePeriod: t,
      compoundingFrequency: n,
      futureValue: a > 0 ? futureValue : compoundAmount,
      interestEarned: a > 0 ? futureValue - p - totalContributions : interestEarned,
      totalContributions,
      yearlyData
    });
  };

  // Format currency
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateCompoundInterest();
  };

  // Handle form reset
  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setCompoundingFrequency('annually');
    setAdditionalContribution('');
    setContributionFrequency('monthly');
    // Don't reset currency to preserve user preference
    setResults(null);
    setError('');
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Compound Interest Calculator</h1>
      <p className="calculator-description">
        Calculate how your investments will grow over time with compound interest.
      </p>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '1fr 1fr',
        }
      }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Currency Selector */}
            <div className="input-group">
              <label htmlFor="currency" className="input-label">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
                style={{ 
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                }}
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Principal Amount */}
            <div className="input-group">
              <label htmlFor="principal" className="input-label">
                Initial Investment
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}>
                  <FaMoneyBillWave />
                </span>
                <input
                  type="number"
                  id="principal"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="1000"
                  className="input-field"
                  style={{ 
                    paddingLeft: '1.5rem',
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                  required
                />
              </div>
            </div>

            {/* Annual Interest Rate */}
            <div className="input-group">
              <label htmlFor="rate" className="input-label">
                Annual Interest Rate (%) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="5"
                  className="input-field"
                  style={{ 
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                  step="0.01"
                  required
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}>
                  %
                </span>
              </div>
            </div>

            {/* Time Period */}
            <div className="input-group">
              <label htmlFor="time" className="input-label">
                Time Period (Years) *
              </label>
              <input
                type="number"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10"
                className="input-field"
                style={{ 
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
                required
              />
            </div>

            {/* Compounding Frequency */}
            <div className="input-group">
              <label htmlFor="compoundingFrequency" className="input-label">
                Compounding Frequency
              </label>
              <select
                id="compoundingFrequency"
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(e.target.value)}
                className="select-field"
                style={{ 
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="annually">Annually</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Additional Contribution */}
            <div className="input-group">
              <label htmlFor="additionalContribution" className="input-label">
                Regular Contribution (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}>
                  <FaMoneyBillWave />
                </span>
                <input
                  type="number"
                  id="additionalContribution"
                  value={additionalContribution}
                  onChange={(e) => setAdditionalContribution(e.target.value)}
                  placeholder="100"
                  className="input-field"
                  style={{ 
                    paddingLeft: '1.5rem',
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>

            {/* Contribution Frequency */}
            <div className="input-group">
              <label htmlFor="contributionFrequency" className="input-label">
                Contribution Frequency
              </label>
              <select
                id="contributionFrequency"
                value={contributionFrequency}
                onChange={(e) => setContributionFrequency(e.target.value)}
                className="select-field"
                style={{ 
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  flex: '1',
                  padding: '0.625rem 1.25rem',
                  backgroundColor: '#0284c7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary"
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                Clear
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#b91c1c', 
                backgroundColor: '#fee2e2', 
                padding: '0.75rem', 
                borderRadius: '0.375rem',
                marginTop: '0.5rem',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Results Section */}
        <div style={{ 
          backgroundColor: results ? '#f0f9ff' : 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.3s',
        }}>
          {results ? (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#0284c7' }}>
                Results Summary
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Initial Investment:</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(results.principalAmount)}</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Interest Rate:</span>
                <span style={{ fontWeight: '600' }}>{(results.interestRate * 100).toFixed(2)}%</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Time Period:</span>
                <span style={{ fontWeight: '600' }}>{results.timePeriod} years</span>
                
                {results.totalContributions > 0 && (
                  <>
                    <span style={{ fontWeight: '500', color: '#4b5563' }}>Total Contributions:</span>
                    <span style={{ fontWeight: '600' }}>{formatCurrency(results.totalContributions)}</span>
                  </>
                )}
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Interest Earned:</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>{formatCurrency(results.interestEarned)}</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Future Value:</span>
                <span style={{ fontWeight: '700', color: '#0284c7', fontSize: '1.125rem' }}>
                  {formatCurrency(results.futureValue)}
                </span>
              </div>
              
              {/* Yearly Breakdown */}
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0284c7' }}>
                Yearly Breakdown
              </h4>
              
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Year</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Balance</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((data) => (
                      <tr key={data.year} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.5rem', textAlign: 'left' }}>{data.year}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(data.balance)}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', color: '#16a34a' }}>{formatCurrency(data.interest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#6b7280',
              textAlign: 'center',
              padding: '2rem 0',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style={{ marginBottom: '1rem', color: '#9ca3af' }}>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Results will appear here
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Fill out the form and click "Calculate" to see your compound interest results.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>How compound interest works:</h3>
        <p style={{ marginBottom: '1rem' }}>
          Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. It's the result of reinvesting interest, rather than paying it out, so that interest in the next period is earned on the principal sum plus previously accumulated interest.
        </p>
        <p>
          The formula for compound interest is: A = P(1 + r/n)^(nt), where:
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>A = Final amount</li>
          <li>P = Principal (initial investment)</li>
          <li>r = Annual interest rate (decimal)</li>
          <li>n = Number of times interest is compounded per year</li>
          <li>t = Time period in years</li>
        </ul>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
