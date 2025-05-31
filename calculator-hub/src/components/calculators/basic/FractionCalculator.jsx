import { useState } from 'react';

const FractionCalculator = () => {
  const [numerator1, setNumerator1] = useState('');
  const [denominator1, setDenominator1] = useState('');
  const [numerator2, setNumerator2] = useState('');
  const [denominator2, setDenominator2] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState({ numerator: '', denominator: '', decimal: '', mixed: '' });
  const [error, setError] = useState('');

  // Find the greatest common divisor (GCD) using Euclidean algorithm
  const findGCD = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Find the least common multiple (LCM) - reserved for future functionality
  const _findLCM = (a, b) => {
    return Math.abs(a * b) / findGCD(a, b);
  };

  // Reduce a fraction to its simplest form
  const reduceFraction = (numerator, denominator) => {
    if (numerator === 0) return { numerator: 0, denominator: 1 };
    
    const gcd = findGCD(numerator, denominator);
    let reducedNumerator = numerator / gcd;
    let reducedDenominator = denominator / gcd;
    
    // Ensure the denominator is positive
    if (reducedDenominator < 0) {
      reducedNumerator = -reducedNumerator;
      reducedDenominator = -reducedDenominator;
    }
    
    return { numerator: reducedNumerator, denominator: reducedDenominator };
  };

  // Convert improper fraction to mixed number
  const toMixedNumber = (numerator, denominator) => {
    if (denominator === 0) return 'Undefined';
    if (numerator === 0) return '0';
    
    const isNegative = (numerator < 0 && denominator > 0) || (numerator > 0 && denominator < 0);
    numerator = Math.abs(numerator);
    denominator = Math.abs(denominator);
    
    const wholePart = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    
    if (remainder === 0) {
      return isNegative ? `-${wholePart}` : `${wholePart}`;
    }
    
    const { numerator: reducedNumerator, denominator: reducedDenominator } = 
      reduceFraction(remainder, denominator);
    
    if (wholePart === 0) {
      return isNegative 
        ? `-${reducedNumerator}/${reducedDenominator}`
        : `${reducedNumerator}/${reducedDenominator}`;
    }
    
    return isNegative 
      ? `-${wholePart} ${reducedNumerator}/${reducedDenominator}`
      : `${wholePart} ${reducedNumerator}/${reducedDenominator}`;
  };

  // Calculate the result of the fraction operation
  const calculateResult = () => {
    setError('');
    
    // Validate inputs
    if (!numerator1 || !denominator1 || !numerator2 || !denominator2) {
      setError('Please fill in all fields');
      return;
    }
    
    const num1 = parseInt(numerator1);
    const den1 = parseInt(denominator1);
    const num2 = parseInt(numerator2);
    const den2 = parseInt(denominator2);
    
    if (den1 === 0 || den2 === 0) {
      setError('Denominator cannot be zero');
      return;
    }
    
    let resultNum, resultDen;
    
    switch (operation) {
      case '+':
        // a/b + c/d = (ad + bc)/bd
        resultNum = num1 * den2 + num2 * den1;
        resultDen = den1 * den2;
        break;
      case '-':
        // a/b - c/d = (ad - bc)/bd
        resultNum = num1 * den2 - num2 * den1;
        resultDen = den1 * den2;
        break;
      case '*':
        // a/b * c/d = ac/bd
        resultNum = num1 * num2;
        resultDen = den1 * den2;
        break;
      case '/':
        // a/b / c/d = ad/bc
        if (num2 === 0) {
          setError('Cannot divide by zero');
          return;
        }
        resultNum = num1 * den2;
        resultDen = den1 * num2;
        break;
      default:
        setError('Invalid operation');
        return;
    }
    
    const { numerator: reducedNum, denominator: reducedDen } = reduceFraction(resultNum, resultDen);
    const decimalResult = reducedNum / reducedDen;
    const mixedNumber = toMixedNumber(reducedNum, reducedDen);
    
    setResult({
      numerator: reducedNum,
      denominator: reducedDen,
      decimal: decimalResult.toFixed(4),
      mixed: mixedNumber
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateResult();
  };

  // Clear all inputs and results
  const handleClear = () => {
    setNumerator1('');
    setDenominator1('');
    setNumerator2('');
    setDenominator2('');
    setOperation('+');
    setResult({ numerator: '', denominator: '', decimal: '', mixed: '' });
    setError('');
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Fraction Calculator</h1>
      <p className="calculator-description">
        Perform arithmetic operations with fractions and convert between different fraction formats.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* First Fraction */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="number"
                value={numerator1}
                onChange={(e) => setNumerator1(e.target.value)}
                placeholder="Numerator"
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  borderBottom: '2px solid #0284c7',
                }}
              />
              <div style={{ width: '80px', height: '2px', backgroundColor: '#0284c7' }}></div>
              <input
                type="number"
                value={denominator1}
                onChange={(e) => setDenominator1(e.target.value)}
                placeholder="Denominator"
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0 0 0.375rem 0.375rem',
                  borderTop: 'none',
                }}
              />
            </div>

            {/* Operation Selector */}
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: '#f9fafb',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>

            {/* Second Fraction */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="number"
                value={numerator2}
                onChange={(e) => setNumerator2(e.target.value)}
                placeholder="Numerator"
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  borderBottom: '2px solid #0284c7',
                }}
              />
              <div style={{ width: '80px', height: '2px', backgroundColor: '#0284c7' }}></div>
              <input
                type="number"
                value={denominator2}
                onChange={(e) => setDenominator2(e.target.value)}
                placeholder="Denominator"
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0 0 0.375rem 0.375rem',
                  borderTop: 'none',
                }}
              />
            </div>

            {/* Equals Sign */}
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>=</div>

            {/* Result Fraction */}
            {result.numerator !== '' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '80px',
                  padding: '0.5rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  borderBottom: '2px solid #0284c7',
                  backgroundColor: '#f0f9ff',
                  fontWeight: 'bold',
                }}>
                  {result.numerator}
                </div>
                <div style={{ width: '80px', height: '2px', backgroundColor: '#0284c7' }}></div>
                <div style={{
                  width: '80px',
                  padding: '0.5rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0 0 0.375rem 0.375rem',
                  borderTop: 'none',
                  backgroundColor: '#f0f9ff',
                  fontWeight: 'bold',
                }}>
                  {result.denominator}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
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
              textAlign: 'center',
              fontWeight: '500',
            }}>
              {error}
            </div>
          )}

          {/* Results Section */}
          {result.numerator !== '' && !error && (
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.375rem',
              border: '1px solid #bae6fd',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0284c7' }}>Results:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>Fraction:</span>
                <span>{result.numerator}/{result.denominator}</span>
                
                <span style={{ fontWeight: '500' }}>Decimal:</span>
                <span>{result.decimal}</span>
                
                <span style={{ fontWeight: '500' }}>Mixed Number:</span>
                <span>{result.mixed}</span>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>How to use:</h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
          <li>Enter the numerator and denominator for both fractions</li>
          <li>Select the operation you want to perform (+, −, ×, ÷)</li>
          <li>Click "Calculate" to see the result</li>
          <li>The result will be shown as a reduced fraction, decimal, and mixed number</li>
          <li>Use "Clear" to reset all inputs and start over</li>
        </ul>
      </div>
    </div>
  );
};

export default FractionCalculator;
