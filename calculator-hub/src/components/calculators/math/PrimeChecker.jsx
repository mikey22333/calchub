import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const PrimeChecker = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

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
      setError('Please enter a positive number');
      return false;
    }
    
    if (parsedNum > 10000000) {
      setError('Number is too large. Maximum supported value is 10,000,000');
      return false;
    }
    
    if (!Number.isInteger(parsedNum)) {
      setError('Please enter an integer');
      return false;
    }
    
    return true;
  };

  // Check if a number is prime
  const isPrime = (n) => {
    // 0 and 1 are not prime numbers
    if (n < 2) {
      return {
        isPrime: false,
        explanation: n === 0 ? 
          '0 is neither prime nor composite by definition.' : 
          '1 is neither prime nor composite by definition.',
        factors: [n],
        divisibilityChecks: []
      };
    }
    
    // 2 and 3 are prime
    if (n <= 3) {
      return {
        isPrime: true,
        explanation: `${n} is a prime number because it has only two factors: 1 and itself.`,
        factors: [1, n],
        divisibilityChecks: []
      };
    }
    
    // Check if n is divisible by 2 or 3
    if (n % 2 === 0) {
      return {
        isPrime: false,
        explanation: `${n} is divisible by 2, so it's not a prime number.`,
        factors: findFactors(n),
        divisibilityChecks: [{
          divisor: 2,
          result: `${n} ÷ 2 = ${n/2} (divisible)`
        }]
      };
    }
    
    if (n % 3 === 0) {
      return {
        isPrime: false,
        explanation: `${n} is divisible by 3, so it's not a prime number.`,
        factors: findFactors(n),
        divisibilityChecks: [{
          divisor: 2,
          result: `${n} ÷ 2 = ${n/2} with remainder ${n%2} (not divisible)`
        }, {
          divisor: 3,
          result: `${n} ÷ 3 = ${Math.floor(n/3)} (divisible)`
        }]
      };
    }
    
    // Check all numbers of form 6k±1 up to sqrt(n)
    const sqrt = Math.sqrt(n);
    const divisibilityChecks = [
      {
        divisor: 2,
        result: `${n} ÷ 2 = ${n/2} with remainder ${n%2} (not divisible)`
      },
      {
        divisor: 3,
        result: `${n} ÷ 3 = ${Math.floor(n/3)} with remainder ${n%3} (not divisible)`
      }
    ];
    
    for (let i = 5; i <= sqrt; i += 6) {
      // Check if n is divisible by i
      if (n % i === 0) {
        divisibilityChecks.push({
          divisor: i,
          result: `${n} ÷ ${i} = ${n/i} (divisible)`
        });
        
        return {
          isPrime: false,
          explanation: `${n} is divisible by ${i}, so it's not a prime number.`,
          factors: findFactors(n),
          divisibilityChecks
        };
      }
      
      divisibilityChecks.push({
        divisor: i,
        result: `${n} ÷ ${i} = ${Math.floor(n/i)} with remainder ${n%i} (not divisible)`
      });
      
      // Check if n is divisible by i+2
      if (n % (i + 2) === 0) {
        divisibilityChecks.push({
          divisor: i + 2,
          result: `${n} ÷ ${i+2} = ${n/(i+2)} (divisible)`
        });
        
        return {
          isPrime: false,
          explanation: `${n} is divisible by ${i+2}, so it's not a prime number.`,
          factors: findFactors(n),
          divisibilityChecks
        };
      }
      
      divisibilityChecks.push({
        divisor: i + 2,
        result: `${n} ÷ ${i+2} = ${Math.floor(n/(i+2))} with remainder ${n%(i+2)} (not divisible)`
      });
    }
    
    // If we reach here, n is prime
    return {
      isPrime: true,
      explanation: `${n} is a prime number because it's only divisible by 1 and itself.`,
      factors: [1, n],
      divisibilityChecks,
      maxChecked: Math.floor(sqrt)
    };
  };

  // Find all factors of a number
  const findFactors = (n) => {
    const factors = [];
    
    // Find all factors up to the square root
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        
        // If i is not the square root, add the corresponding factor
        if (i !== n / i) {
          factors.push(n / i);
        }
      }
    }
    
    // Sort the factors in ascending order
    return factors.sort((a, b) => a - b);
  };

  // Find prime factorization
  const findPrimeFactorization = (n) => {
    if (n < 2) return [];
    
    const primeFactors = [];
    let temp = n;
    
    // Check divisibility by 2
    while (temp % 2 === 0) {
      primeFactors.push(2);
      temp /= 2;
    }
    
    // Check divisibility by odd numbers starting from 3
    for (let i = 3; i <= Math.sqrt(temp); i += 2) {
      while (temp % i === 0) {
        primeFactors.push(i);
        temp /= i;
      }
    }
    
    // If temp is a prime number greater than 2
    if (temp > 2) {
      primeFactors.push(temp);
    }
    
    return primeFactors;
  };

  // Format prime factorization for display
  const formatPrimeFactorization = (factors) => {
    if (factors.length === 0) return 'N/A';
    
    // Count occurrences of each factor
    const factorCounts = {};
    factors.forEach(factor => {
      factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    });
    
    // Format as product of powers
    return Object.entries(factorCounts)
      .map(([factor, count]) => count === 1 ? factor : `${factor}^${count}`)
      .join(' × ');
  };

  const check = () => {
    if (!validateInput()) {
      setResult(null);
      return;
    }
    
    const n = parseInt(number);
    
    try {
      const primeCheckResult = isPrime(n);
      const primeFactors = findPrimeFactorization(n);
      
      setResult({
        number: n,
        ...primeCheckResult,
        primeFactors,
        primeFactorization: formatPrimeFactorization(primeFactors)
      });
    } catch (err) {
      setError('Error checking if the number is prime.');
    }
  };

  const handleReset = () => {
    setNumber('');
    setResult(null);
    setError('');
    setShowDetails(false);
  };

  return (
    <>
      <SEO
        title="Prime Number Checker"
        description="Check if a number is prime, find all its factors, and get its prime factorization with detailed explanations."
        keywords="prime number checker, prime factorization, prime factors, number theory, math calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Prime Number Checker</h1>
        <p className="calculator-description">
          Check if a number is prime, find all its factors, and get its prime factorization with detailed explanations.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> Check Prime Number
            </h2>
            
            <div className="mb-4">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Enter a Number *
              </label>
              <input
                type="number"
                id="number"
                value={number}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter a positive integer"
                min="0"
                step="1"
              />
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={check}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Check
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
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-3">{result.number}</span>
                  <span className={`text-xl font-bold ${result.isPrime ? 'text-green-600' : 'text-red-600'}`}>
                    is {result.isPrime ? 'a prime number' : 'not a prime number'}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{result.explanation}</p>
              </div>
              
              {!result.isPrime && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Factors:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.factors.map((factor, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                        {factor}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-md font-medium text-gray-800 mt-4 mb-2">Prime Factorization:</h3>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <span className="text-lg font-medium">
                      {result.number} = {result.primeFactorization}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {showDetails && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Divisibility Checks:</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    To determine if {result.number} is prime, we check if it's divisible by any number from 2 up to √{result.number} ≈ {result.maxChecked}.
                  </p>
                  <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                    {result.divisibilityChecks.map((check, index) => (
                      <li key={index}>{check.result}</li>
                    ))}
                  </ul>
                  {result.isPrime && (
                    <p className="text-sm text-gray-700 mt-2">
                      Since {result.number} is not divisible by any number from 2 to {result.maxChecked}, it is a prime number.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">What is a Prime Number?</h2>
          <div className="space-y-2">
            <p>
              A <strong>prime number</strong> is a natural number greater than 1 that is not a product of two smaller natural numbers.
            </p>
            <p>
              In other words, a prime number has exactly two factors: 1 and itself.
            </p>
            <div className="mt-3">
              <h3 className="font-medium">Examples:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                <li>2, 3, 5, 7, 11, 13, 17, 19, 23, 29... are prime numbers</li>
                <li>4 is not prime because 4 = 2 × 2</li>
                <li>6 is not prime because 6 = 2 × 3</li>
                <li>9 is not prime because 9 = 3 × 3</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Prime numbers play a fundamental role in number theory and have applications in cryptography, computer science, and many other fields.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default PrimeChecker;
