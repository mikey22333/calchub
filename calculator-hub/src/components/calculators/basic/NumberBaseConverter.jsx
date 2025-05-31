import React, { useState } from 'react';
import { FaExchangeAlt, FaRedo } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const NumberBaseConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState(10);
  const [outputBase, setOutputBase] = useState(2);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const bases = [
    { value: 2, label: 'Binary (Base 2)' },
    { value: 8, label: 'Octal (Base 8)' },
    { value: 10, label: 'Decimal (Base 10)' },
    { value: 16, label: 'Hexadecimal (Base 16)' },
  ];

  const validateInput = (value, base) => {
    let regex;
    switch (parseInt(base)) {
      case 2:
        regex = /^[01]*$/;
        break;
      case 8:
        regex = /^[0-7]*$/;
        break;
      case 10:
        regex = /^[0-9]*$/;
        break;
      case 16:
        regex = /^[0-9A-Fa-f]*$/;
        break;
      default:
        return false;
    }
    return regex.test(value);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value === '') {
      setError('');
      setResult('');
      return;
    }
    
    if (!validateInput(value, inputBase)) {
      setError(`Invalid character for base ${inputBase}`);
      setResult('');
      return;
    }
    
    setError('');
  };

  const handleConvert = () => {
    if (!inputValue) {
      setError('Please enter a value to convert');
      return;
    }

    try {
      // Convert input to decimal first
      const decimalValue = parseInt(inputValue, parseInt(inputBase));
      
      if (isNaN(decimalValue)) {
        setError('Invalid input for the selected base');
        setResult('');
        return;
      }
      
      // Then convert from decimal to output base
      const convertedValue = decimalValue.toString(parseInt(outputBase));
      setResult(convertedValue.toUpperCase());
      setError('');
    } catch (err) {
      setError('Conversion error: ' + err.message);
      setResult('');
    }
  };

  const handleReset = () => {
    setInputValue('');
    setInputBase(10);
    setOutputBase(2);
    setResult('');
    setError('');
  };

  const handleSwapBases = () => {
    setInputBase(outputBase);
    setOutputBase(inputBase);
    setInputValue(result);
    setResult('');
  };

  return (
    <>
      <SEO
        title="Number Base Converter"
        description="Convert numbers between different number systems including binary, octal, decimal, and hexadecimal."
        keywords="number base converter, binary converter, decimal converter, hexadecimal converter, octal converter, base conversion"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Number Base Converter</h1>
        <p className="calculator-description">
          Convert numbers between different number systems including binary, octal, decimal, and hexadecimal.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="inputBase" className="block text-sm font-medium text-gray-700 mb-1">
                From Base
              </label>
              <select
                id="inputBase"
                value={inputBase}
                onChange={(e) => setInputBase(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {bases.map((base) => (
                  <option key={base.value} value={base.value}>
                    {base.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="outputBase" className="block text-sm font-medium text-gray-700 mb-1">
                To Base
              </label>
              <select
                id="outputBase"
                value={outputBase}
                onChange={(e) => setOutputBase(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {bases.map((base) => (
                  <option key={base.value} value={base.value}>
                    {base.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-1">
              Input Value
            </label>
            <input
              type="text"
              id="inputValue"
              value={inputValue}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder={`Enter a base ${inputBase} number`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={handleConvert}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Convert
            </button>
            <button
              onClick={handleSwapBases}
              className="bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
              title="Swap bases"
            >
              <FaExchangeAlt />
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
              <h2 className="text-lg font-semibold mb-2">Result:</h2>
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="font-mono text-lg break-all">{result}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Base {inputBase} → Base {outputBase}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Number Base Conversion</h2>
          <div className="space-y-2">
            <p>
              Number base conversion is the process of converting a number from one number system to another. The most common number systems are:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Binary (Base 2):</strong> Uses only 0 and 1</li>
              <li><strong>Octal (Base 8):</strong> Uses digits 0-7</li>
              <li><strong>Decimal (Base 10):</strong> Uses digits 0-9</li>
              <li><strong>Hexadecimal (Base 16):</strong> Uses digits 0-9 and letters A-F</li>
            </ul>
            <p>
              This calculator allows you to convert numbers between these common number systems.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default NumberBaseConverter;
