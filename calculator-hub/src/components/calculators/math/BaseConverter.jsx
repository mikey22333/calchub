import React, { useState } from 'react';
import { FaExchangeAlt, FaRedo, FaInfoCircle, FaCopy } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const BaseConverter = () => {
  const [number, setNumber] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const baseOptions = [
    { value: 2, label: 'Binary (Base 2)' },
    { value: 3, label: 'Ternary (Base 3)' },
    { value: 4, label: 'Quaternary (Base 4)' },
    { value: 5, label: 'Quinary (Base 5)' },
    { value: 6, label: 'Senary (Base 6)' },
    { value: 7, label: 'Septenary (Base 7)' },
    { value: 8, label: 'Octal (Base 8)' },
    { value: 9, label: 'Nonary (Base 9)' },
    { value: 10, label: 'Decimal (Base 10)' },
    { value: 11, label: 'Undecimal (Base 11)' },
    { value: 12, label: 'Duodecimal (Base 12)' },
    { value: 13, label: 'Tridecimal (Base 13)' },
    { value: 14, label: 'Tetradecimal (Base 14)' },
    { value: 15, label: 'Pentadecimal (Base 15)' },
    { value: 16, label: 'Hexadecimal (Base 16)' },
    { value: 32, label: 'Base 32' },
    { value: 36, label: 'Base 36' },
  ];

  const handleInputChange = (e) => {
    setNumber(e.target.value);
    setResult(null);
    setError('');
    setCopySuccess('');
  };

  const handleFromBaseChange = (e) => {
    setFromBase(parseInt(e.target.value));
    setResult(null);
    setError('');
    setCopySuccess('');
  };

  const handleToBaseChange = (e) => {
    setToBase(parseInt(e.target.value));
    setResult(null);
    setError('');
    setCopySuccess('');
  };

  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setResult(null);
    setError('');
    setCopySuccess('');
  };

  const validateInput = () => {
    setError('');
    
    if (!number) {
      setError('Please enter a number');
      return false;
    }
    
    // Check if the input is valid for the given base
    const validChars = getValidCharsForBase(fromBase);
    const regex = new RegExp(`^[${validChars}]+$`, 'i');
    
    if (!regex.test(number)) {
      setError(`Invalid character for base ${fromBase}. Valid characters are: ${validChars}`);
      return false;
    }
    
    return true;
  };

  // Get valid characters for a given base
  const getValidCharsForBase = (base) => {
    let chars = '0123456789';
    if (base > 10) {
      chars += 'abcdefghijklmnopqrstuvwxyz'.substring(0, base - 10);
    } else {
      chars = chars.substring(0, base);
    }
    return chars;
  };

  // Convert number from one base to another
  const convertBase = (num, fromBase, toBase) => {
    // Convert from source base to decimal
    const decimalSteps = [];
    let decimal = 0;
    const digits = num.toLowerCase().split('').reverse();
    
    digits.forEach((digit, index) => {
      const digitValue = '0123456789abcdefghijklmnopqrstuvwxyz'.indexOf(digit);
      const contribution = digitValue * Math.pow(fromBase, index);
      decimal += contribution;
      
      decimalSteps.push({
        digit,
        position: index,
        value: digitValue,
        calculation: `${digitValue} × ${fromBase}^${index} = ${contribution}`,
        runningTotal: decimal
      });
    });
    
    // If the target base is 10, we're done
    if (toBase === 10) {
      return {
        result: decimal.toString(),
        decimalValue: decimal,
        decimalSteps,
        targetBaseSteps: []
      };
    }
    
    // Convert from decimal to target base
    const targetBaseSteps = [];
    let result = '';
    let remainder = decimal;
    
    while (remainder > 0) {
      const quotient = Math.floor(remainder / toBase);
      const currentRemainder = remainder % toBase;
      const digitChar = '0123456789abcdefghijklmnopqrstuvwxyz'[currentRemainder];
      
      targetBaseSteps.push({
        remainder,
        division: `${remainder} ÷ ${toBase} = ${quotient} remainder ${currentRemainder}`,
        digit: digitChar
      });
      
      result = digitChar + result;
      remainder = quotient;
    }
    
    // Handle zero case
    if (result === '') {
      result = '0';
    }
    
    return {
      result,
      decimalValue: decimal,
      decimalSteps,
      targetBaseSteps
    };
  };

  const convert = () => {
    if (!validateInput()) {
      setResult(null);
      return;
    }
    
    try {
      const conversionResult = convertBase(number, fromBase, toBase);
      
      setResult({
        input: number,
        fromBase,
        toBase,
        ...conversionResult
      });
    } catch (err) {
      setError('Error converting between bases.');
    }
  };

  const handleReset = () => {
    setNumber('');
    setFromBase(10);
    setToBase(2);
    setResult(null);
    setError('');
    setShowSteps(false);
    setCopySuccess('');
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.result)
        .then(() => {
          setCopySuccess('Copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        })
        .catch(() => {
          setCopySuccess('Failed to copy');
        });
    }
  };

  // Format the number with separators for readability
  const formatWithSeparators = (str, base) => {
    if (!str) return '';
    
    // Different grouping based on base
    let groupSize;
    switch (base) {
      case 2: groupSize = 4; break;   // Binary: groups of 4
      case 8: groupSize = 3; break;   // Octal: groups of 3
      case 16: groupSize = 2; break;  // Hex: groups of 2
      default: groupSize = 3; break;  // Others: groups of 3
    }
    
    // Add separators
    let result = '';
    for (let i = 0; i < str.length; i++) {
      if (i > 0 && (str.length - i) % groupSize === 0) {
        result += ' ';
      }
      result += str[i];
    }
    
    return result;
  };

  return (
    <>
      <SEO
        title="Number Base Converter"
        description="Convert numbers between different bases including binary, decimal, hexadecimal, octal, and more with step-by-step explanations."
        keywords="base converter, binary converter, decimal converter, hexadecimal converter, octal converter, number system converter"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Number Base Converter</h1>
        <p className="calculator-description">
          Convert numbers between different number systems including binary, decimal, hexadecimal, octal, and more with step-by-step explanations.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaExchangeAlt className="mr-2 text-primary-500" /> Convert Between Bases
            </h2>
            
            <div className="mb-4">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Enter a Number *
              </label>
              <input
                type="text"
                id="number"
                value={number}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={`Enter a number in base ${fromBase}`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="fromBase" className="block text-sm font-medium text-gray-700 mb-1">
                  From Base
                </label>
                <select
                  id="fromBase"
                  value={fromBase}
                  onChange={handleFromBaseChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {baseOptions.map(option => (
                    <option key={`from-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="toBase" className="block text-sm font-medium text-gray-700 mb-1">
                  To Base
                </label>
                <div className="flex items-center">
                  <select
                    id="toBase"
                    value={toBase}
                    onChange={handleToBaseChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {baseOptions.map(option => (
                      <option key={`to-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={swapBases}
                    className="ml-2 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    title="Swap bases"
                  >
                    <FaExchangeAlt />
                  </button>
                </div>
              </div>
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={convert}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Convert
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
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-1">
                      {baseOptions.find(b => b.value === result.fromBase)?.label}:
                    </h3>
                    <p className="text-lg font-mono">{formatWithSeparators(result.input, result.fromBase)}</p>
                  </div>
                  
                  <FaExchangeAlt className="text-gray-400 mx-4" />
                  
                  <div className="flex-grow">
                    <h3 className="text-md font-medium text-gray-800 mb-1">
                      {baseOptions.find(b => b.value === result.toBase)?.label}:
                    </h3>
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-primary-600 font-mono break-all mr-2">
                        {formatWithSeparators(result.result, result.toBase)}
                      </p>
                      <button
                        onClick={copyToClipboard}
                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                        title="Copy to clipboard"
                      >
                        <FaCopy />
                      </button>
                      {copySuccess && (
                        <span className="text-green-600 text-sm ml-2">{copySuccess}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {result.toBase !== 10 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-800 mb-1">
                      Decimal Value:
                    </h3>
                    <p className="text-lg font-mono">{result.decimalValue}</p>
                  </div>
                )}
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
                  {result.fromBase !== 10 && (
                    <div className="mb-4">
                      <h3 className="text-md font-medium text-gray-800 mb-2">
                        Step 1: Convert from Base {result.fromBase} to Decimal
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        To convert {result.input}<sub>{result.fromBase}</sub> to decimal, multiply each digit by its place value and sum the results:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left">Position</th>
                              <th className="px-4 py-2 text-left">Digit</th>
                              <th className="px-4 py-2 text-left">Calculation</th>
                              <th className="px-4 py-2 text-left">Running Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.decimalSteps.map((step, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-4 py-2">{step.position}</td>
                                <td className="px-4 py-2">{step.digit.toUpperCase()}</td>
                                <td className="px-4 py-2">{step.calculation}</td>
                                <td className="px-4 py-2">{step.runningTotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Therefore, {result.input}<sub>{result.fromBase}</sub> = {result.decimalValue}<sub>10</sub>
                      </p>
                    </div>
                  )}
                  
                  {result.toBase !== 10 && (
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">
                        {result.fromBase !== 10 ? 'Step 2' : 'Step 1'}: Convert from Decimal to Base {result.toBase}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        To convert {result.decimalValue}<sub>10</sub> to base {result.toBase}, divide repeatedly by {result.toBase} and collect the remainders in reverse order:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left">Division</th>
                              <th className="px-4 py-2 text-left">Remainder (Digit)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.targetBaseSteps.map((step, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-4 py-2">{step.division}</td>
                                <td className="px-4 py-2">{step.digit.toUpperCase()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Reading the remainders from bottom to top gives us {result.result}<sub>{result.toBase}</sub>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Number Systems</h2>
          <div className="space-y-2">
            <p>
              Different number systems use different bases to represent numbers. The base determines how many unique digits are used.
            </p>
            <div className="mt-3">
              <h3 className="font-medium">Common Number Systems:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                <li><strong>Binary (Base 2):</strong> Uses 0 and 1. Used in computing.</li>
                <li><strong>Octal (Base 8):</strong> Uses 0-7. Sometimes used in computing.</li>
                <li><strong>Decimal (Base 10):</strong> Uses 0-9. Our standard number system.</li>
                <li><strong>Hexadecimal (Base 16):</strong> Uses 0-9 and A-F. Common in computing for representing binary data compactly.</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Number systems with bases higher than 10 use letters to represent digits greater than 9. For example, in hexadecimal, A=10, B=11, ..., F=15.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default BaseConverter;
