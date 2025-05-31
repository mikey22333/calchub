import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const FactorialCalculator = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleInputChange = (e) => {
    setNumber(e.target.value);
    setResult(null);
    setError('');
  };

  const validateInput = () => {
    setError('');
    
    if (!number) {
      setError('Please enter a number');
      return false;
    }
    
    const parsedNum = parseInt(number);
    
    if (isNaN(parsedNum)) {
      setError('Please enter a valid number');
      return false;
    }
    
    if (parsedNum < 0) {
      setError('Factorial is not defined for negative numbers');
      return false;
    }
    
    if (parsedNum > 170) {
      setError('Number is too large. Maximum supported value is 170');
      return false;
    }
    
    if (!Number.isInteger(parsedNum)) {
      setError('Please enter an integer');
      return false;
    }
    
    return true;
  };

  // Calculate factorial
  const calculateFactorial = (n) => {
    // Base cases
    if (n === 0 || n === 1) {
      return {
        result: 1,
        steps: ['0! = 1'] // Special case for 0
      };
    }
    
    let factorial = 1;
    const steps = [];
    
    steps.push(`${n}! = ${n} × ${n-1}!`);
    
    // Generate steps for smaller values
    for (let i = n; i >= 2; i--) {
      if (i === n) {
        steps.push(`${n}! = ${n}`);
      } else {
        steps.push(`${n}! = ${n} × ${i}`);
      }
      
      for (let j = i - 1; j >= 2; j--) {
        steps[steps.length - 1] += ` × ${j}`;
      }
      
      if (i > 2) {
        steps[steps.length - 1] += ' × 1';
      }
    }
    
    // Calculate the actual factorial
    for (let i = 2; i <= n; i++) {
      factorial *= i;
    }
    
    // Add the final result step
    steps.push(`${n}! = ${factorial}`);
    
    return {
      result: factorial,
      steps
    };
  };

  const calculate = () => {
    if (!validateInput()) {
      setResult(null);
      return;
    }
    
    const n = parseInt(number);
    
    try {
      const { result, steps } = calculateFactorial(n);
      setResult({
        number: n,
        factorial: result,
        steps
      });
    } catch (err) {
      setError('Error calculating factorial. The number might be too large.');
    }
  };

  const handleReset = () => {
    setNumber('');
    setResult(null);
    setError('');
    setShowSteps(false);
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    return num.toLocaleString('en-US');
  };

  return (
    <>
      <SEO
        title="Factorial Calculator"
        description="Calculate factorials of numbers with step-by-step explanations. Learn what factorials are and how they're used in mathematics."
        keywords="factorial calculator, n factorial, mathematics, permutations, combinations, math calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Factorial Calculator</h1>
        <p className="calculator-description">
          Calculate the factorial of a number and see step-by-step explanations. Factorial (n!) is the product of all positive integers less than or equal to n.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> Calculate Factorial
            </h2>
            
            <div className="mb-4">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Enter a Number (0-170) *
              </label>
              <input
                type="number"
                id="number"
                value={number}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter a non-negative integer"
                min="0"
                max="170"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: Factorials grow very quickly. Values above 170 will exceed JavaScript's number precision.
              </p>
            </div>
            
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

          {result && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Result:</h2>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold mr-2">{result.number}! =</span>
                  <span className="text-2xl font-bold text-primary-600 break-all">
                    {formatNumber(result.factorial)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Steps' : 'Show Steps'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Steps:</h3>
                  <div className="space-y-2">
                    {result.steps.map((step, index) => (
                      <div key={index} className="text-gray-700">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">What is a Factorial?</h2>
          <div className="space-y-2">
            <p>
              The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.
            </p>
            <p>
              <strong>Formula:</strong> n! = n × (n-1) × (n-2) × ... × 3 × 2 × 1
            </p>
            <p>
              <strong>Special case:</strong> 0! = 1 (by definition)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Factorials are used in permutations, combinations, probability theory, and many other areas of mathematics.
            </p>
            <div className="mt-3">
              <h3 className="font-medium">Examples:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                <li>1! = 1</li>
                <li>2! = 2 × 1 = 2</li>
                <li>3! = 3 × 2 × 1 = 6</li>
                <li>4! = 4 × 3 × 2 × 1 = 24</li>
                <li>5! = 5 × 4 × 3 × 2 × 1 = 120</li>
              </ul>
            </div>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default FactorialCalculator;
