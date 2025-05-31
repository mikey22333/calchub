import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const LogarithmCalculator = () => {
  const [number, setNumber] = useState('');
  const [base, setBase] = useState('10');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
    setResults(null);
  };

  const handleBaseChange = (e) => {
    setBase(e.target.value);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    if (!number || isNaN(parseFloat(number))) {
      setError('Please enter a valid number');
      return false;
    }
    
    const numberValue = parseFloat(number);
    if (numberValue <= 0) {
      setError('Number must be greater than zero');
      return false;
    }
    
    if (!base || isNaN(parseFloat(base))) {
      setError('Please enter a valid base');
      return false;
    }
    
    const baseValue = parseFloat(base);
    if (baseValue <= 0 || baseValue === 1) {
      setError('Base must be greater than zero and not equal to 1');
      return false;
    }
    
    return true;
  };

  const calculateLogarithm = () => {
    if (!validateInputs()) return;
    
    const numberValue = parseFloat(number);
    const baseValue = parseFloat(base);
    
    // Calculate logarithm with the specified base
    const logResult = Math.log(numberValue) / Math.log(baseValue);
    
    // Calculate common logarithms for comparison
    const logBase10 = Math.log10(numberValue);
    const logBaseE = Math.log(numberValue);
    const logBase2 = Math.log2(numberValue);
    
    setResults({
      logResult,
      logBase10,
      logBaseE,
      logBase2,
      number: numberValue,
      base: baseValue
    });
  };

  const handleReset = () => {
    setNumber('');
    setBase('10');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  return (
    <>
      <SEO
        title="Logarithm Calculator"
        description="Calculate logarithms with any base, including natural logarithms, common logarithms, and binary logarithms."
        keywords="logarithm calculator, log calculator, natural logarithm, common logarithm, binary logarithm, log base 10, log base e, log base 2"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Logarithm Calculator</h1>
        <p className="calculator-description">
          Calculate logarithms with any base, including natural logarithms (base e), common logarithms (base 10), and binary logarithms (base 2).
        </p>

        <AdBanner position="top" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Number (x)
              </label>
              <input
                type="number"
                id="number"
                value={number}
                onChange={handleNumberChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter a positive number"
                step="any"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be greater than zero
              </p>
            </div>
            
            <div>
              <label htmlFor="base" className="block text-sm font-medium text-gray-700 mb-1">
                Base (b)
              </label>
              <input
                type="number"
                id="base"
                value={base}
                onChange={handleBaseChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter a base"
                step="any"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be greater than zero and not equal to 1
              </p>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={calculateLogarithm}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaCalculator className="inline mr-2" /> Calculate
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Reset"
            >
              <FaRedo />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium text-primary-700 mb-2">
                log<sub>{results.base}</sub>({results.number}) = {results.logResult.toFixed(6)}
              </h3>
              <p className="text-sm text-gray-600">
                The logarithm of {results.number} with base {results.base} is {results.logResult.toFixed(6)}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-1">Common Logarithm (base 10)</h4>
                <p className="text-lg font-semibold text-secondary-600">
                  log<sub>10</sub>({results.number}) = {results.logBase10.toFixed(6)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-1">Natural Logarithm (base e)</h4>
                <p className="text-lg font-semibold text-secondary-600">
                  ln({results.number}) = {results.logBaseE.toFixed(6)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-1">Binary Logarithm (base 2)</h4>
                <p className="text-lg font-semibold text-secondary-600">
                  log<sub>2</sub>({results.number}) = {results.logBase2.toFixed(6)}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
              >
                <FaInfoCircle className="mr-1" />
                {showSteps ? 'Hide Calculation Steps' : 'Show Calculation Steps'}
              </button>
            </div>
            
            {showSteps && (
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Steps:</h3>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Step 1:</strong> To calculate log<sub>{results.base}</sub>({results.number}), we use the change of base formula:
                  </p>
                  <p className="pl-4">
                    log<sub>b</sub>(x) = log<sub>c</sub>(x) / log<sub>c</sub>(b)
                  </p>
                  <p>
                    <strong>Step 2:</strong> Using natural logarithm (base e) for calculation:
                  </p>
                  <p className="pl-4">
                    log<sub>{results.base}</sub>({results.number}) = ln({results.number}) / ln({results.base})
                  </p>
                  <p className="pl-4">
                    = {results.logBaseE.toFixed(6)} / {Math.log(results.base).toFixed(6)}
                  </p>
                  <p className="pl-4">
                    = {results.logResult.toFixed(6)}
                  </p>
                  
                  <p className="mt-4">
                    <strong>Note:</strong> Logarithm properties:
                  </p>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>log<sub>b</sub>(x × y) = log<sub>b</sub>(x) + log<sub>b</sub>(y)</li>
                    <li>log<sub>b</sub>(x / y) = log<sub>b</sub>(x) - log<sub>b</sub>(y)</li>
                    <li>log<sub>b</sub>(x<sup>n</sup>) = n × log<sub>b</sub>(x)</li>
                    <li>log<sub>b</sub>(b) = 1</li>
                    <li>log<sub>b</sub>(1) = 0</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Logarithms</h2>
          <div className="space-y-2">
            <p>
              A logarithm is the power to which a number (the base) must be raised to produce a given number. 
              If b<sup>y</sup> = x, then y is the logarithm of x to base b, written as y = log<sub>b</sub>(x).
            </p>
            
            <p>
              <strong>Common logarithm types:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Common logarithm (log<sub>10</sub>):</strong> Uses base 10, often written simply as "log" in many contexts.</li>
              <li><strong>Natural logarithm (ln):</strong> Uses base e (≈ 2.71828), the base of natural exponential functions.</li>
              <li><strong>Binary logarithm (log<sub>2</sub>):</strong> Uses base 2, commonly used in computer science and information theory.</li>
            </ul>
            
            <p>
              <strong>Applications of logarithms:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Simplifying multiplication into addition (log(a×b) = log(a) + log(b))</li>
              <li>Expressing quantities that vary greatly in scale (pH, decibels, Richter scale)</li>
              <li>Solving exponential equations</li>
              <li>Data analysis and visualization (log scales)</li>
              <li>Computer algorithms and computational complexity</li>
            </ul>
            
            <p>
              Logarithms are defined only for positive real numbers, as negative numbers and zero don't have real-valued logarithms in standard mathematics.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default LogarithmCalculator;
