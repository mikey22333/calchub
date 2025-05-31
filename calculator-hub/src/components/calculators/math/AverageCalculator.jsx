import React, { useState } from 'react';
import { FaCalculator, FaEquals } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const AverageCalculator = () => {
  const [inputData, setInputData] = useState('');
  const [averageType, setAverageType] = useState('arithmetic');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputData(e.target.value);
    setError('');
  };

  const parseData = (input) => {
    // Remove any extra spaces and split by commas, spaces, or new lines
    const cleanInput = input.trim().replace(/\s+/g, ' ');
    const values = cleanInput.split(/[\s,]+/).filter(val => val !== '');
    
    // Convert strings to numbers and filter out non-numeric values
    const numbers = values.map(val => parseFloat(val)).filter(num => !isNaN(num));
    
    return numbers;
  };

  const calculateAverage = () => {
    if (!inputData.trim()) {
      setError('Please enter numeric data separated by commas or spaces');
      return;
    }

    const data = parseData(inputData);

    if (data.length === 0) {
      setError('No valid numeric data found');
      return;
    }

    let arithmeticMean = 0;
    let geometricMean = 0;
    let harmonicMean = 0;
    let median = 0;
    let mode = [];
    let sum = 0;
    let product = 1;
    let reciprocalSum = 0;

    // Sort the data for calculations
    const sortedData = [...data].sort((a, b) => a - b);

    // Calculate arithmetic mean (average)
    sum = sortedData.reduce((acc, val) => acc + val, 0);
    arithmeticMean = sum / sortedData.length;

    // Calculate geometric mean
    // Check if any values are negative or zero
    const hasNegativeOrZero = sortedData.some(num => num <= 0);
    if (!hasNegativeOrZero) {
      product = sortedData.reduce((acc, val) => acc * val, 1);
      geometricMean = Math.pow(product, 1 / sortedData.length);
    }

    // Calculate harmonic mean
    // Check if any values are zero
    const hasZero = sortedData.some(num => num === 0);
    if (!hasZero) {
      reciprocalSum = sortedData.reduce((acc, val) => acc + (1 / val), 0);
      harmonicMean = sortedData.length / reciprocalSum;
    }

    // Calculate median
    const mid = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      median = (sortedData[mid - 1] + sortedData[mid]) / 2;
    } else {
      median = sortedData[mid];
    }

    // Calculate mode (most frequent value)
    const frequency = {};
    sortedData.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });

    let maxFrequency = 0;
    for (const num in frequency) {
      if (frequency[num] > maxFrequency) {
        maxFrequency = frequency[num];
        mode = [parseFloat(num)];
      } else if (frequency[num] === maxFrequency) {
        mode.push(parseFloat(num));
      }
    }

    // If all values appear the same number of times, there is no mode
    const modeResult = maxFrequency === 1 ? 'No mode (all values appear once)' : mode.join(', ');

    setResults({
      count: sortedData.length,
      sum: sum.toFixed(4),
      arithmeticMean: arithmeticMean.toFixed(4),
      geometricMean: hasNegativeOrZero ? 'Not applicable for negative or zero values' : geometricMean.toFixed(4),
      harmonicMean: hasZero ? 'Not applicable when values include zero' : harmonicMean.toFixed(4),
      median: median.toFixed(4),
      mode: modeResult,
      min: sortedData[0],
      max: sortedData[sortedData.length - 1],
      range: (sortedData[sortedData.length - 1] - sortedData[0]).toFixed(4)
    });
  };

  const handleClear = () => {
    setInputData('');
    setResults(null);
    setError('');
  };

  const handleSampleData = () => {
    const sampleData = '15, 23, 42, 18, 37, 29, 15, 42';
    setInputData(sampleData);
  };

  return (
    <>
      <SEO 
        title="Average Calculator" 
        description="Calculate arithmetic mean, geometric mean, harmonic mean, median, and mode from a set of numbers."
        keywords="average calculator, mean calculator, median calculator, mode calculator, arithmetic mean"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Average Calculator</h1>
        <p className="calculator-description">
          Calculate different types of averages including arithmetic mean, geometric mean, harmonic mean, median, and mode.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <label htmlFor="dataInput" className="block text-sm font-medium text-gray-700 mb-2">
            Enter numeric data (separated by commas or spaces):
          </label>
          <div className="flex">
            <textarea
              id="dataInput"
              rows="4"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={inputData}
              onChange={handleInputChange}
              placeholder="Example: 15, 23, 42, 18, 37, 29, 15, 42"
            />
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleSampleData}
              className="px-3 py-1 text-xs text-primary-600 border border-primary-300 rounded hover:bg-primary-50"
            >
              Use Sample Data
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={calculateAverage}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaCalculator className="mr-2" /> Calculate Averages
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            Clear
          </button>
        </div>

        {results && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaEquals className="mr-2 text-primary-600" /> Average Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Number of Values</h4>
                <p className="text-lg font-semibold">{results.count}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Sum</h4>
                <p className="text-lg font-semibold">{results.sum}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Arithmetic Mean</h4>
                <p className="text-lg font-semibold">{results.arithmeticMean}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Geometric Mean</h4>
                <p className="text-lg font-semibold">{results.geometricMean}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Harmonic Mean</h4>
                <p className="text-lg font-semibold">{results.harmonicMean}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Median</h4>
                <p className="text-lg font-semibold">{results.median}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Mode</h4>
                <p className="text-lg font-semibold">{results.mode}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Range</h4>
                <p className="text-lg font-semibold">{results.range}</p>
              </div>
            </div>
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default AverageCalculator;
