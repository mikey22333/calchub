import { useState } from 'react';

const RatioCalculator = () => {
  const [ratioType, setRatioType] = useState('solve');
  
  // Solve for X
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [solveResult, setSolveResult] = useState(null);
  
  // Simplify ratio
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [simplifyResult, setSimplifyResult] = useState(null);
  
  // Combine ratios
  const [ratio1A, setRatio1A] = useState('');
  const [ratio1B, setRatio1B] = useState('');
  const [ratio2A, setRatio2A] = useState('');
  const [ratio2B, setRatio2B] = useState('');
  const [combineResult, setCombineResult] = useState(null);
  
  // Divide in ratio
  const [totalValue, setTotalValue] = useState('');
  const [ratioA, setRatioA] = useState('');
  const [ratioB, setRatioB] = useState('');
  const [divideResult, setDivideResult] = useState(null);
  
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

  // Simplify a ratio
  const simplifyRatio = (a, b) => {
    const gcd = findGCD(a, b);
    return {
      a: a / gcd,
      b: b / gcd
    };
  };

  // Solve for X in a:b = c:x
  const solveForX = () => {
    setError('');
    setSolveResult(null);
    
    if (!a || !b || !c) {
      setError('Please fill in all required fields');
      return;
    }
    
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);
    
    if (aVal === 0 || bVal === 0) {
      setError('Values cannot be zero');
      return;
    }
    
    // a:b = c:x, so x = (b*c)/a
    const x = (bVal * cVal) / aVal;
    
    setSolveResult({
      x: x,
      ratio: `${cVal}:${x.toFixed(2)}`
    });
  };

  // Simplify a ratio
  const simplify = () => {
    setError('');
    setSimplifyResult(null);
    
    if (!num1 || !num2) {
      setError('Please fill in both numbers');
      return;
    }
    
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    
    if (a === 0 || b === 0) {
      setError('Values cannot be zero');
      return;
    }
    
    const simplified = simplifyRatio(a, b);
    
    setSimplifyResult({
      a: simplified.a,
      b: simplified.b,
      ratio: `${simplified.a}:${simplified.b}`,
      decimal: (a / b).toFixed(4)
    });
  };

  // Combine two ratios
  const combineRatios = () => {
    setError('');
    setCombineResult(null);
    
    if (!ratio1A || !ratio1B || !ratio2A || !ratio2B) {
      setError('Please fill in all fields');
      return;
    }
    
    const a1 = parseFloat(ratio1A);
    const b1 = parseFloat(ratio1B);
    const a2 = parseFloat(ratio2A);
    const b2 = parseFloat(ratio2B);
    
    if (a1 === 0 || b1 === 0 || a2 === 0 || b2 === 0) {
      setError('Values cannot be zero');
      return;
    }
    
    // Combined ratio = (a1*a2):(b1*b2)
    const combinedA = a1 * a2;
    const combinedB = b1 * b2;
    
    const simplified = simplifyRatio(combinedA, combinedB);
    
    setCombineResult({
      a: simplified.a,
      b: simplified.b,
      ratio: `${simplified.a}:${simplified.b}`
    });
  };

  // Divide a value in a given ratio
  const divideInRatio = () => {
    setError('');
    setDivideResult(null);
    
    if (!totalValue || !ratioA || !ratioB) {
      setError('Please fill in all fields');
      return;
    }
    
    const total = parseFloat(totalValue);
    const a = parseFloat(ratioA);
    const b = parseFloat(ratioB);
    
    if (a === 0 || b === 0) {
      setError('Ratio values cannot be zero');
      return;
    }
    
    const sum = a + b;
    const valueA = (a / sum) * total;
    const valueB = (b / sum) * total;
    
    setDivideResult({
      a: valueA,
      b: valueB
    });
  };

  // Handle form submission based on ratio type
  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch (ratioType) {
      case 'solve':
        solveForX();
        break;
      case 'simplify':
        simplify();
        break;
      case 'combine':
        combineRatios();
        break;
      case 'divide':
        divideInRatio();
        break;
      default:
        break;
    }
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Ratio Calculator</h1>
      <p className="calculator-description">
        Calculate and manipulate ratios with this versatile ratio calculator.
      </p>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
      }}>
        {/* Ratio Type Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Select Calculation Type
          </label>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
          }}>
            <button
              type="button"
              onClick={() => setRatioType('solve')}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: ratioType === 'solve' ? '#0284c7' : '#f3f4f6',
                color: ratioType === 'solve' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '120px',
              }}
            >
              Solve for X
            </button>
            <button
              type="button"
              onClick={() => setRatioType('simplify')}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: ratioType === 'simplify' ? '#0284c7' : '#f3f4f6',
                color: ratioType === 'simplify' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '120px',
              }}
            >
              Simplify Ratio
            </button>
            <button
              type="button"
              onClick={() => setRatioType('combine')}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: ratioType === 'combine' ? '#0284c7' : '#f3f4f6',
                color: ratioType === 'combine' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '120px',
              }}
            >
              Combine Ratios
            </button>
            <button
              type="button"
              onClick={() => setRatioType('divide')}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: ratioType === 'divide' ? '#0284c7' : '#f3f4f6',
                color: ratioType === 'divide' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '120px',
              }}
            >
              Divide in Ratio
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Solve for X */}
          {ratioType === 'solve' && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#0284c7', textAlign: 'center' }}>
                Solve for X in a:b = c:x
              </h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  placeholder="a"
                  style={{
                    width: '70px',
                    padding: '0.625rem',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>:</span>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  placeholder="b"
                  style={{
                    width: '70px',
                    padding: '0.625rem',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0.5rem' }}>=</span>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  placeholder="c"
                  style={{
                    width: '70px',
                    padding: '0.625rem',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>:</span>
                <span style={{ 
                  width: '70px',
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#f3f4f6',
                }}>
                  x
                </span>
              </div>
              
              {solveResult && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bae6fd',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0284c7' }}>
                    x = {formatNumber(solveResult.x)}
                  </p>
                  <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>
                    The ratio {c}:{formatNumber(solveResult.x)} is equivalent to {a}:{b}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Simplify Ratio */}
          {ratioType === 'simplify' && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#0284c7', textAlign: 'center' }}>
                Simplify a Ratio
              </h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  placeholder="First number"
                  style={{
                    width: '100px',
                    padding: '0.625rem',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>:</span>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  placeholder="Second number"
                  style={{
                    width: '100px',
                    padding: '0.625rem',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
              </div>
              
              {simplifyResult && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bae6fd',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0284c7' }}>
                    Simplified Ratio: {simplifyResult.a}:{simplifyResult.b}
                  </p>
                  <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>
                    Decimal Equivalent: {simplifyResult.decimal}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Combine Ratios */}
          {ratioType === 'combine' && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#0284c7', textAlign: 'center' }}>
                Combine Two Ratios
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>First Ratio:</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}>
                  <input
                    type="number"
                    value={ratio1A}
                    onChange={(e) => setRatio1A(e.target.value)}
                    placeholder="a"
                    style={{
                      width: '80px',
                      padding: '0.625rem',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    required
                  />
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>:</span>
                  <input
                    type="number"
                    value={ratio1B}
                    onChange={(e) => setRatio1B(e.target.value)}
                    placeholder="b"
                    style={{
                      width: '80px',
                      padding: '0.625rem',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    required
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Second Ratio:</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}>
                  <input
                    type="number"
                    value={ratio2A}
                    onChange={(e) => setRatio2A(e.target.value)}
                    placeholder="c"
                    style={{
                      width: '80px',
                      padding: '0.625rem',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    required
                  />
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>:</span>
                  <input
                    type="number"
                    value={ratio2B}
                    onChange={(e) => setRatio2B(e.target.value)}
                    placeholder="d"
                    style={{
                      width: '80px',
                      padding: '0.625rem',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    required
                  />
                </div>
              </div>
              
              {combineResult && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bae6fd',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0284c7' }}>
                    Combined Ratio: {combineResult.a}:{combineResult.b}
                  </p>
                  <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>
                    {ratio1A}:{ratio1B} combined with {ratio2A}:{ratio2B}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Divide in Ratio */}
          {ratioType === 'divide' && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#0284c7', textAlign: 'center' }}>
                Divide a Value in Ratio
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Total Value to Divide
                </label>
                <input
                  type="number"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  placeholder="Enter total value"
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Ratio to Divide By:</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}>
                  <input
                    type="number"
                    value={ratioA}
                    onChange={(e) => setRatioA(e.target.value)}
                    placeholder="a"
                    style={{
                      width: '80px',
                      padding: '0.625rem',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    required
                  />
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>:</span>
                  <input
                    type="number"
                    value={ratioB}
                    onChange={(e) => setRatioB(e.target.value)}
                    placeholder="b"
                    style={{
                      width: '80px',
                      padding: '0.625rem',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    required
                  />
                </div>
              </div>
              
              {divideResult && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bae6fd',
                }}>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0284c7', textAlign: 'center', marginBottom: '0.5rem' }}>
                    Division Result
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>First Part ({ratioA}):</span>
                    <span style={{ fontWeight: '600' }}>{formatNumber(divideResult.a)}</span>
                    
                    <span style={{ fontWeight: '500' }}>Second Part ({ratioB}):</span>
                    <span style={{ fontWeight: '600' }}>{formatNumber(divideResult.b)}</span>
                    
                    <span style={{ fontWeight: '500' }}>Total:</span>
                    <span style={{ fontWeight: '600' }}>{formatNumber(parseFloat(totalValue))}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#b91c1c', 
              backgroundColor: '#fee2e2', 
              padding: '0.75rem', 
              borderRadius: '0.375rem',
              marginTop: '1rem',
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          {/* Calculate Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '0.75rem 2rem',
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
          </div>
        </form>
      </div>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>About Ratios:</h3>
        <p style={{ marginBottom: '1rem' }}>
          A ratio is a relationship between two or more numbers, indicating how many times one value contains or is contained within the other. Ratios are commonly written as "a:b" or "a to b".
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          This calculator can help you:
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
          <li><strong>Solve for X</strong> - Find the missing value in a proportion (a:b = c:x)</li>
          <li><strong>Simplify Ratios</strong> - Reduce a ratio to its simplest form</li>
          <li><strong>Combine Ratios</strong> - Multiply two ratios together</li>
          <li><strong>Divide in Ratio</strong> - Split a value into parts according to a given ratio</li>
        </ul>
      </div>
    </div>
  );
};

export default RatioCalculator;
