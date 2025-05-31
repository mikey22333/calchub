import { useState } from 'react';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [state, setState] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // 2023 Federal Tax Brackets (simplified for demonstration)
  const federalTaxBrackets = {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 578125, rate: 0.35 },
      { min: 578126, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22001, max: 89450, rate: 0.12 },
      { min: 89451, max: 190750, rate: 0.22 },
      { min: 190751, max: 364200, rate: 0.24 },
      { min: 364201, max: 462500, rate: 0.32 },
      { min: 462501, max: 693750, rate: 0.35 },
      { min: 693751, max: Infinity, rate: 0.37 }
    ],
    head: [
      { min: 0, max: 15700, rate: 0.10 },
      { min: 15701, max: 59850, rate: 0.12 },
      { min: 59851, max: 95350, rate: 0.22 },
      { min: 95351, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 578100, rate: 0.35 },
      { min: 578101, max: Infinity, rate: 0.37 }
    ]
  };

  // State Tax Rates (simplified for demonstration)
  const stateTaxRates = {
    'alabama': 0.05,
    'alaska': 0.00,
    'arizona': 0.0459,
    'arkansas': 0.055,
    'california': 0.0950,
    'colorado': 0.0455,
    'connecticut': 0.0699,
    'delaware': 0.066,
    'florida': 0.00,
    'georgia': 0.0575,
    'hawaii': 0.11,
    'idaho': 0.06,
    'illinois': 0.0495,
    'indiana': 0.0323,
    'iowa': 0.0575,
    'kansas': 0.057,
    'kentucky': 0.05,
    'louisiana': 0.0425,
    'maine': 0.0715,
    'maryland': 0.0575,
    'massachusetts': 0.05,
    'michigan': 0.0425,
    'minnesota': 0.0985,
    'mississippi': 0.05,
    'missouri': 0.0495,
    'montana': 0.0675,
    'nebraska': 0.0684,
    'nevada': 0.00,
    'new hampshire': 0.05,
    'new jersey': 0.1075,
    'new mexico': 0.059,
    'new york': 0.109,
    'north carolina': 0.0499,
    'north dakota': 0.0290,
    'ohio': 0.0399,
    'oklahoma': 0.0475,
    'oregon': 0.099,
    'pennsylvania': 0.0307,
    'rhode island': 0.0599,
    'south carolina': 0.07,
    'south dakota': 0.00,
    'tennessee': 0.00,
    'texas': 0.00,
    'utah': 0.0495,
    'vermont': 0.0875,
    'virginia': 0.0575,
    'washington': 0.00,
    'west virginia': 0.065,
    'wisconsin': 0.0765,
    'wyoming': 0.00,
    'district of columbia': 0.0895
  };

  // Standard Deduction for 2023
  const standardDeduction = {
    single: 13850,
    married: 27700,
    head: 20800
  };

  // Calculate federal tax using progressive brackets
  const calculateFederalTax = (taxableIncome, status) => {
    const brackets = federalTaxBrackets[status];
    let tax = 0;
    
    for (let i = 0; i < brackets.length; i++) {
      const { min, max, rate } = brackets[i];
      
      if (taxableIncome > min) {
        const taxableAmount = Math.min(taxableIncome - min, max - min);
        tax += taxableAmount * rate;
      }
      
      if (taxableIncome <= max) break;
    }
    
    return tax;
  };

  // Calculate state tax (simplified)
  const calculateStateTax = (taxableIncome, stateCode) => {
    const stateRate = stateTaxRates[stateCode.toLowerCase()] || 0;
    return taxableIncome * stateRate;
  };

  // Calculate FICA taxes (Social Security and Medicare)
  const calculateFicaTaxes = (income) => {
    const socialSecurityRate = 0.062;
    const medicareRate = 0.0145;
    const socialSecurityWageCap = 160200; // 2023 wage cap
    
    const socialSecurityTax = Math.min(income, socialSecurityWageCap) * socialSecurityRate;
    const medicareTax = income * medicareRate;
    
    return {
      socialSecurityTax,
      medicareTax,
      totalFicaTax: socialSecurityTax + medicareTax
    };
  };

  // Calculate all taxes
  const calculateTaxes = () => {
    setError('');
    
    if (!income) {
      setError('Please enter your income');
      return;
    }
    
    const incomeValue = parseFloat(income);
    
    if (isNaN(incomeValue) || incomeValue < 0) {
      setError('Please enter a valid income amount');
      return;
    }
    
    // Calculate taxable income after standard deduction
    const deduction = standardDeduction[filingStatus];
    const taxableIncome = Math.max(0, incomeValue - deduction);
    
    // Calculate federal income tax
    const federalTax = calculateFederalTax(taxableIncome, filingStatus);
    
    // Calculate state income tax if a state is selected
    const stateTax = state ? calculateStateTax(taxableIncome, state) : 0;
    
    // Calculate FICA taxes
    const ficaTaxes = calculateFicaTaxes(incomeValue);
    
    // Calculate total tax and effective tax rate
    const totalTax = federalTax + stateTax + ficaTaxes.totalFicaTax;
    const effectiveTaxRate = (totalTax / incomeValue) * 100;
    
    // Calculate take-home pay
    const takeHomePay = incomeValue - totalTax;
    
    setResults({
      income: incomeValue,
      standardDeduction: deduction,
      taxableIncome,
      federalTax,
      stateTax,
      socialSecurityTax: ficaTaxes.socialSecurityTax,
      medicareTax: ficaTaxes.medicareTax,
      totalTax,
      effectiveTaxRate,
      takeHomePay,
      monthlyTakeHome: takeHomePay / 12
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTaxes();
  };

  // Clear all inputs and results
  const handleClear = () => {
    setIncome('');
    setFilingStatus('single');
    setState('');
    setResults(null);
    setError('');
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Income Tax Calculator</h1>
      <p className="calculator-description">
        Estimate your federal, state, and FICA taxes based on your income and filing status.
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
            {/* Annual Income */}
            <div className="input-group">
              <label htmlFor="income" className="input-label">
                Annual Income (Before Taxes) *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}>
                  $
                </span>
                <input
                  type="number"
                  id="income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="50000"
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

            {/* Filing Status */}
            <div className="input-group">
              <label htmlFor="filingStatus" className="input-label">
                Filing Status
              </label>
              <select
                id="filingStatus"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
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
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>

            {/* State */}
            <div className="input-group">
              <label htmlFor="state" className="input-label">
                State (Optional)
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
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
                <option value="">Select a state</option>
                <option value="alabama">Alabama</option>
                <option value="alaska">Alaska</option>
                <option value="arizona">Arizona</option>
                <option value="arkansas">Arkansas</option>
                <option value="california">California</option>
                <option value="colorado">Colorado</option>
                <option value="connecticut">Connecticut</option>
                <option value="delaware">Delaware</option>
                <option value="district of columbia">District of Columbia</option>
                <option value="florida">Florida</option>
                <option value="georgia">Georgia</option>
                <option value="hawaii">Hawaii</option>
                <option value="idaho">Idaho</option>
                <option value="illinois">Illinois</option>
                <option value="indiana">Indiana</option>
                <option value="iowa">Iowa</option>
                <option value="kansas">Kansas</option>
                <option value="kentucky">Kentucky</option>
                <option value="louisiana">Louisiana</option>
                <option value="maine">Maine</option>
                <option value="maryland">Maryland</option>
                <option value="massachusetts">Massachusetts</option>
                <option value="michigan">Michigan</option>
                <option value="minnesota">Minnesota</option>
                <option value="mississippi">Mississippi</option>
                <option value="missouri">Missouri</option>
                <option value="montana">Montana</option>
                <option value="nebraska">Nebraska</option>
                <option value="nevada">Nevada</option>
                <option value="new hampshire">New Hampshire</option>
                <option value="new jersey">New Jersey</option>
                <option value="new mexico">New Mexico</option>
                <option value="new york">New York</option>
                <option value="north carolina">North Carolina</option>
                <option value="north dakota">North Dakota</option>
                <option value="ohio">Ohio</option>
                <option value="oklahoma">Oklahoma</option>
                <option value="oregon">Oregon</option>
                <option value="pennsylvania">Pennsylvania</option>
                <option value="rhode island">Rhode Island</option>
                <option value="south carolina">South Carolina</option>
                <option value="south dakota">South Dakota</option>
                <option value="tennessee">Tennessee</option>
                <option value="texas">Texas</option>
                <option value="utah">Utah</option>
                <option value="vermont">Vermont</option>
                <option value="virginia">Virginia</option>
                <option value="washington">Washington</option>
                <option value="west virginia">West Virginia</option>
                <option value="wisconsin">Wisconsin</option>
                <option value="wyoming">Wyoming</option>
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
                Tax Breakdown
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Gross Income:</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(results.income)}</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Standard Deduction:</span>
                <span style={{ fontWeight: '600' }}>-{formatCurrency(results.standardDeduction)}</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Taxable Income:</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(results.taxableIncome)}</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>Federal Income Tax:</span>
                <span style={{ fontWeight: '600', color: '#dc2626', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  -{formatCurrency(results.federalTax)}
                </span>
                
                {results.stateTax > 0 && (
                  <>
                    <span style={{ fontWeight: '500', color: '#4b5563' }}>State Income Tax:</span>
                    <span style={{ fontWeight: '600', color: '#dc2626' }}>
                      -{formatCurrency(results.stateTax)}
                    </span>
                  </>
                )}
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Social Security Tax:</span>
                <span style={{ fontWeight: '600', color: '#dc2626' }}>
                  -{formatCurrency(results.socialSecurityTax)}
                </span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Medicare Tax:</span>
                <span style={{ fontWeight: '600', color: '#dc2626' }}>
                  -{formatCurrency(results.medicareTax)}
                </span>
                
                <span style={{ fontWeight: '500', color: '#4b5563', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>Total Tax:</span>
                <span style={{ fontWeight: '600', color: '#dc2626', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  -{formatCurrency(results.totalTax)}
                </span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Effective Tax Rate:</span>
                <span style={{ fontWeight: '600' }}>
                  {results.effectiveTaxRate.toFixed(2)}%
                </span>
                
                <span style={{ fontWeight: '700', color: '#4b5563', fontSize: '1.125rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  Annual Take-Home Pay:
                </span>
                <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '1.125rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  {formatCurrency(results.takeHomePay)}
                </span>
                
                <span style={{ fontWeight: '600', color: '#4b5563' }}>Monthly Take-Home Pay:</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>
                  {formatCurrency(results.monthlyTakeHome)}
                </span>
              </div>
              
              {/* Tax Breakdown Chart (simplified visual) */}
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0284c7' }}>
                Tax Distribution
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  display: 'flex',
                }}>
                  {/* Federal Tax */}
                  <div style={{ 
                    width: `${(results.federalTax / results.income) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    {results.federalTax / results.income > 0.05 ? 'Fed' : ''}
                  </div>
                  
                  {/* State Tax */}
                  <div style={{ 
                    width: `${(results.stateTax / results.income) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#f97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    {results.stateTax / results.income > 0.05 ? 'State' : ''}
                  </div>
                  
                  {/* FICA Tax */}
                  <div style={{ 
                    width: `${((results.socialSecurityTax + results.medicareTax) / results.income) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    {(results.socialSecurityTax + results.medicareTax) / results.income > 0.05 ? 'FICA' : ''}
                  </div>
                  
                  {/* Take-Home */}
                  <div style={{ 
                    width: `${(results.takeHomePay / results.income) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    {results.takeHomePay / results.income > 0.1 ? 'Take-Home Pay' : ''}
                  </div>
                </div>
                
                {/* Legend */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
                    <span>Federal: {((results.federalTax / results.income) * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#f97316', borderRadius: '2px' }}></div>
                    <span>State: {((results.stateTax / results.income) * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#8b5cf6', borderRadius: '2px' }}></div>
                    <span>FICA: {(((results.socialSecurityTax + results.medicareTax) / results.income) * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div>
                    <span>Take-Home: {((results.takeHomePay / results.income) * 100).toFixed(1)}%</span>
                  </div>
                </div>
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
                Tax calculation results will appear here
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Enter your income and filing status, then click "Calculate" to see your estimated taxes.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>About this calculator:</h3>
        <p style={{ marginBottom: '1rem' }}>
          This tax calculator provides an estimate of your federal, state, and FICA (Social Security and Medicare) taxes based on your annual income and filing status. The calculator uses 2023 tax brackets and rates.
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Note:</strong> This calculator provides estimates only and should not be used for tax preparation purposes. The actual tax calculation may differ based on:
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Additional deductions or credits you may qualify for</li>
          <li>Additional income sources (investments, self-employment, etc.)</li>
          <li>Local taxes not included in this calculator</li>
          <li>Changes in tax law</li>
        </ul>
        <p>
          For accurate tax calculations, consult a tax professional or use official tax preparation software.
        </p>
      </div>
    </div>
  );
};

export default TaxCalculator;
