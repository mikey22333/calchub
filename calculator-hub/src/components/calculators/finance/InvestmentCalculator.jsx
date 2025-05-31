import { useState } from 'react';

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [investmentLength, setInvestmentLength] = useState('');
  const [inflationRate, setInflationRate] = useState('2.5');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Calculate investment growth
  const calculateInvestment = () => {
    setError('');
    
    // Validate inputs
    if (!initialInvestment || !annualReturn || !investmentLength) {
      setError('Please fill in all required fields');
      return;
    }
    
    const principal = parseFloat(initialInvestment);
    const monthlyContrib = parseFloat(monthlyContribution) || 0;
    const annualReturnRate = parseFloat(annualReturn) / 100;
    const monthlyReturnRate = Math.pow(1 + annualReturnRate, 1/12) - 1;
    const years = parseFloat(investmentLength);
    const months = years * 12;
    const inflation = parseFloat(inflationRate) / 100;
    
    if (principal < 0 || monthlyContrib < 0 || annualReturnRate < 0 || years <= 0) {
      setError('Please enter valid positive values');
      return;
    }
    
    // Calculate future value
    let futureValue = principal;
    let totalContributions = principal;
    const yearlyData = [];
    
    for (let month = 1; month <= months; month++) {
      // Apply monthly return
      futureValue = futureValue * (1 + monthlyReturnRate);
      
      // Add monthly contribution
      if (monthlyContrib > 0) {
        futureValue += monthlyContrib;
        totalContributions += monthlyContrib;
      }
      
      // Store yearly data
      if (month % 12 === 0) {
        const year = month / 12;
        const yearlyValue = futureValue;
        const inflationAdjustedValue = futureValue / Math.pow(1 + inflation, year);
        const totalInterest = yearlyValue - totalContributions;
        
        yearlyData.push({
          year,
          balance: yearlyValue,
          inflationAdjustedBalance: inflationAdjustedValue,
          totalContributions,
          totalInterest
        });
      }
    }
    
    // Calculate inflation-adjusted future value
    const inflationAdjustedValue = futureValue / Math.pow(1 + inflation, years);
    
    setResults({
      futureValue,
      totalContributions,
      totalInterest: futureValue - totalContributions,
      inflationAdjustedValue,
      yearlyData
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateInvestment();
  };

  // Clear all inputs and results
  const handleClear = () => {
    setInitialInvestment('');
    setMonthlyContribution('');
    setAnnualReturn('');
    setInvestmentLength('');
    setInflationRate('2.5');
    setResults(null);
    setError('');
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Investment Calculator</h1>
      <p className="calculator-description">
        Project the growth of your investments over time and see the impact of regular contributions.
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
            {/* Initial Investment */}
            <div className="input-group">
              <label htmlFor="initialInvestment" className="input-label">
                Initial Investment *
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
                  id="initialInvestment"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="10000"
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

            {/* Monthly Contribution */}
            <div className="input-group">
              <label htmlFor="monthlyContribution" className="input-label">
                Monthly Contribution
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
                  id="monthlyContribution"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="500"
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

            {/* Annual Return Rate */}
            <div className="input-group">
              <label htmlFor="annualReturn" className="input-label">
                Expected Annual Return (%) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  id="annualReturn"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  placeholder="7"
                  className="input-field"
                  style={{ 
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                  step="0.1"
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

            {/* Investment Length */}
            <div className="input-group">
              <label htmlFor="investmentLength" className="input-label">
                Investment Time Period (Years) *
              </label>
              <input
                type="number"
                id="investmentLength"
                value={investmentLength}
                onChange={(e) => setInvestmentLength(e.target.value)}
                placeholder="20"
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

            {/* Inflation Rate */}
            <div className="input-group">
              <label htmlFor="inflationRate" className="input-label">
                Expected Inflation Rate (%)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  id="inflationRate"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="2.5"
                  className="input-field"
                  style={{ 
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                  step="0.1"
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
                Investment Summary
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Total Contributions:</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(results.totalContributions)}</span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Total Interest Earned:</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>{formatCurrency(results.totalInterest)}</span>
                
                <span style={{ fontWeight: '700', color: '#4b5563', fontSize: '1.125rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  Future Value:
                </span>
                <span style={{ fontWeight: '700', color: '#0284c7', fontSize: '1.125rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  {formatCurrency(results.futureValue)}
                </span>
                
                <span style={{ fontWeight: '500', color: '#4b5563' }}>Inflation-Adjusted Value:</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(results.inflationAdjustedValue)}</span>
              </div>
              
              {/* Growth Chart (simplified visual) */}
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0284c7' }}>
                Investment Growth
              </h4>
              
              <div style={{ 
                height: '200px',
                position: 'relative',
                marginBottom: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                padding: '1rem',
              }}>
                {/* Y-axis labels */}
                <div style={{ 
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  width: '60px',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                }}>
                  <div>{formatCurrency(results.futureValue)}</div>
                  <div>{formatCurrency(results.futureValue * 0.75)}</div>
                  <div>{formatCurrency(results.futureValue * 0.5)}</div>
                  <div>{formatCurrency(results.futureValue * 0.25)}</div>
                  <div>$0</div>
                </div>
                
                {/* Chart area */}
                <div style={{ 
                  marginLeft: '60px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '2px',
                }}>
                  {results.yearlyData.map((data, index) => {
                    const heightPercentage = (data.balance / results.futureValue) * 100;
                    const contributionPercentage = (data.totalContributions / data.balance) * 100;
                    const interestPercentage = 100 - contributionPercentage;
                    
                    return (
                      <div 
                        key={index}
                        style={{
                          flex: '1',
                          height: `${heightPercentage}%`,
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                        }}
                      >
                        {/* Interest portion */}
                        <div style={{
                          height: `${interestPercentage}%`,
                          backgroundColor: '#93c5fd',
                          borderTopLeftRadius: '2px',
                          borderTopRightRadius: '2px',
                        }}></div>
                        
                        {/* Contribution portion */}
                        <div style={{
                          height: `${contributionPercentage}%`,
                          backgroundColor: '#3b82f6',
                        }}></div>
                        
                        {/* Year label (show every 5 years) */}
                        {data.year % 5 === 0 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                          }}>
                            {data.year}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                marginBottom: '1rem',
                fontSize: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
                  <span>Contributions</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#93c5fd', borderRadius: '2px' }}></div>
                  <span>Interest</span>
                </div>
              </div>
              
              {/* Yearly Breakdown */}
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0284c7' }}>
                Yearly Breakdown
              </h4>
              
              <div style={{ 
                maxHeight: '150px', 
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Year</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Balance</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Interest</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Inflation Adj.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((data, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.5rem', textAlign: 'left' }}>{data.year}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(data.balance)}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', color: '#16a34a' }}>{formatCurrency(data.totalInterest)}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>{formatCurrency(data.inflationAdjustedBalance)}</td>
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
                Investment results will appear here
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Fill out the form and click "Calculate" to see your projected investment growth.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>About this calculator:</h3>
        <p style={{ marginBottom: '1rem' }}>
          This investment calculator helps you project the growth of your investments over time. It takes into account your initial investment, monthly contributions, expected rate of return, and time horizon. The calculator also adjusts for inflation to show you the real purchasing power of your future investment.
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Key terms:</strong>
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Initial Investment:</strong> The amount you start with</li>
          <li><strong>Monthly Contribution:</strong> The amount you add each month</li>
          <li><strong>Annual Return:</strong> The expected yearly growth rate of your investment</li>
          <li><strong>Inflation Rate:</strong> The expected rate at which the purchasing power of money decreases over time</li>
          <li><strong>Future Value:</strong> The projected total value of your investment at the end of the time period</li>
          <li><strong>Inflation-Adjusted Value:</strong> The future value adjusted for inflation, showing the real purchasing power</li>
        </ul>
        <p>
          <strong>Note:</strong> This calculator assumes a constant rate of return and inflation rate. Actual investment performance may vary significantly due to market conditions, fees, taxes, and other factors.
        </p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
