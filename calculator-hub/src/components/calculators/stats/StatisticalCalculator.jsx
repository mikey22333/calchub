import React, { useState } from 'react';
import { FaCalculator, FaChartBar, FaSort, FaSortAmountUp } from 'react-icons/fa';

const StatisticalCalculator = () => {
  const [inputData, setInputData] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [dataSet, setDataSet] = useState([]);

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

  const calculateStatistics = () => {
    if (!inputData.trim()) {
      setError('Please enter numeric data separated by commas or spaces');
      return;
    }

    const data = parseData(inputData);
    setDataSet(data);

    if (data.length === 0) {
      setError('No valid numeric data found');
      return;
    }

    // Sort the data for calculations
    const sortedData = [...data].sort((a, b) => a - b);

    // Calculate mean (average)
    const sum = sortedData.reduce((acc, val) => acc + val, 0);
    const mean = sum / sortedData.length;

    // Calculate median
    let median;
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
    let modes = [];
    for (const num in frequency) {
      if (frequency[num] > maxFrequency) {
        maxFrequency = frequency[num];
        modes = [parseFloat(num)];
      } else if (frequency[num] === maxFrequency) {
        modes.push(parseFloat(num));
      }
    }

    // If all values appear the same number of times, there is no mode
    const mode = maxFrequency === 1 ? 'No mode (all values appear once)' : modes.join(', ');

    // Calculate range
    const range = sortedData[sortedData.length - 1] - sortedData[0];

    // Calculate variance
    const variance = sortedData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sortedData.length;

    // Calculate standard deviation
    const stdDev = Math.sqrt(variance);

    // Calculate quartiles
    const q1Index = Math.floor(sortedData.length * 0.25);
    const q3Index = Math.floor(sortedData.length * 0.75);
    const q1 = sortedData.length % 4 === 0 
      ? (sortedData[q1Index - 1] + sortedData[q1Index]) / 2 
      : sortedData[q1Index];
    const q3 = sortedData.length % 4 === 0 
      ? (sortedData[q3Index - 1] + sortedData[q3Index]) / 2 
      : sortedData[q3Index];
    
    // Calculate interquartile range (IQR)
    const iqr = q3 - q1;

    setResults({
      count: sortedData.length,
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode,
      range: range.toFixed(4),
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
      q1: q1.toFixed(4),
      q3: q3.toFixed(4),
      iqr: iqr.toFixed(4),
      min: sortedData[0],
      max: sortedData[sortedData.length - 1]
    });
  };

  const handleClear = () => {
    setInputData('');
    setResults(null);
    setError('');
    setDataSet([]);
  };

  const handleSampleData = () => {
    const sampleData = '42, 37, 51, 22, 45, 33, 67, 55, 29, 40';
    setInputData(sampleData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <FaChartBar className="mr-2 text-blue-600" /> Statistical Calculator
        </h2>
        <p className="text-gray-600">Calculate mean, median, mode, and other statistical measures</p>
      </div>

      <div className="mb-6">
        <label htmlFor="dataInput" className="block text-sm font-medium text-gray-700 mb-2">
          Enter numeric data (separated by commas or spaces):
        </label>
        <div className="flex">
          <textarea
            id="dataInput"
            rows="4"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={inputData}
            onChange={handleInputChange}
            placeholder="Example: 42, 37, 51, 22, 45, 33, 67, 55, 29, 40"
          />
        </div>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={handleSampleData}
            className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
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
          onClick={calculateStatistics}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
        >
          <FaCalculator className="mr-2" /> Calculate Statistics
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
            <FaSort className="mr-2 text-blue-600" /> Statistical Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Data Points</h4>
              <p className="text-lg font-semibold">{results.count}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Range</h4>
              <p className="text-lg font-semibold">{results.range}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Mean (Average)</h4>
              <p className="text-lg font-semibold">{results.mean}</p>
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
              <h4 className="text-sm font-medium text-gray-500 mb-1">Standard Deviation</h4>
              <p className="text-lg font-semibold">{results.stdDev}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Variance</h4>
              <p className="text-lg font-semibold">{results.variance}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Min / Max</h4>
              <p className="text-lg font-semibold">{results.min} / {results.max}</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">First Quartile (Q1)</h4>
              <p className="text-lg font-semibold">{results.q1}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Third Quartile (Q3)</h4>
              <p className="text-lg font-semibold">{results.q3}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Interquartile Range (IQR)</h4>
              <p className="text-lg font-semibold">{results.iqr}</p>
            </div>
          </div>
          
          {dataSet.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaSortAmountUp className="mr-2 text-blue-600" /> Sorted Data
              </h4>
              <div className="bg-white p-3 rounded-md border border-gray-200 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-600 font-mono">
                  {dataSet.sort((a, b) => a - b).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-medium text-gray-700 mb-2">About Statistical Calculations</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Mean</strong>: The average of all values in the dataset.</li>
          <li><strong>Median</strong>: The middle value when data is sorted.</li>
          <li><strong>Mode</strong>: The most frequently occurring value(s).</li>
          <li><strong>Range</strong>: The difference between the maximum and minimum values.</li>
          <li><strong>Standard Deviation</strong>: Measures the amount of variation or dispersion in the dataset.</li>
          <li><strong>Quartiles</strong>: Values that divide the dataset into quarters.</li>
          <li><strong>IQR</strong>: The interquartile range, which is the difference between Q3 and Q1.</li>
        </ul>
      </div>
    </div>
  );
};

export default StatisticalCalculator;
