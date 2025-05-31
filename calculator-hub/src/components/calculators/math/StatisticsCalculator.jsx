import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const StatisticsCalculator = () => {
  const [numbers, setNumbers] = useState(['', '', '', '', '']);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [dataInput, setDataInput] = useState('individual'); // 'individual' or 'bulk'
  const [bulkData, setBulkData] = useState('');

  const handleInputChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
    setResults(null);
    setError('');
  };

  const handleBulkDataChange = (e) => {
    setBulkData(e.target.value);
    setResults(null);
    setError('');
  };

  const handleDataInputChange = (type) => {
    setDataInput(type);
    setResults(null);
    setError('');
  };

  const addNumberField = () => {
    setNumbers([...numbers, '']);
    setResults(null);
  };

  const removeNumberField = (index) => {
    if (numbers.length > 2) {
      const newNumbers = [...numbers];
      newNumbers.splice(index, 1);
      setNumbers(newNumbers);
      setResults(null);
    }
  };

  const validateInputs = () => {
    setError('');
    
    if (dataInput === 'individual') {
      // Filter out empty strings and convert to numbers
      const validNumbers = numbers
        .filter(num => num.trim() !== '')
        .map(num => parseFloat(num.trim()));
      
      if (validNumbers.length < 2) {
        setError('Please enter at least two valid numbers');
        return null;
      }
      
      // Check if all inputs are valid numbers
      if (validNumbers.length !== numbers.filter(num => num.trim() !== '').length) {
        setError('Please enter valid numbers');
        return null;
      }
      
      return validNumbers;
    } else {
      // Parse bulk data
      if (!bulkData.trim()) {
        setError('Please enter data');
        return null;
      }
      
      // Split by commas, spaces, tabs, or newlines
      const dataArray = bulkData
        .split(/[,\s\n\t]+/)
        .filter(item => item.trim() !== '')
        .map(item => parseFloat(item.trim()));
      
      if (dataArray.length < 2) {
        setError('Please enter at least two valid numbers');
        return null;
      }
      
      // Check if all inputs are valid numbers
      if (dataArray.some(isNaN)) {
        setError('Please enter valid numbers separated by commas, spaces, or new lines');
        return null;
      }
      
      return dataArray;
    }
  };

  // Calculate mean (average)
  const calculateMean = (data) => {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  };

  // Calculate median
  const calculateMedian = (data) => {
    const sortedData = [...data].sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedData.length / 2);
    
    if (sortedData.length % 2 === 0) {
      // Even number of elements
      return (sortedData[middleIndex - 1] + sortedData[middleIndex]) / 2;
    } else {
      // Odd number of elements
      return sortedData[middleIndex];
    }
  };

  // Calculate mode
  const calculateMode = (data) => {
    // Count occurrences of each value
    const counts = {};
    data.forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });
    
    // Find the maximum count
    let maxCount = 0;
    for (const value in counts) {
      if (counts[value] > maxCount) {
        maxCount = counts[value];
      }
    }
    
    // If all values appear only once, there is no mode
    if (maxCount === 1) {
      return {
        modes: [],
        count: 0,
        explanation: 'No mode (all values appear only once)'
      };
    }
    
    // Find all values that have the maximum count
    const modes = [];
    for (const value in counts) {
      if (counts[value] === maxCount) {
        modes.push(parseFloat(value));
      }
    }
    
    // Sort modes for consistent output
    modes.sort((a, b) => a - b);
    
    return {
      modes,
      count: maxCount,
      explanation: modes.length === 1 
        ? `Mode: ${modes[0]} (appears ${maxCount} times)` 
        : `Multiple modes: ${modes.join(', ')} (each appears ${maxCount} times)`
    };
  };

  // Calculate range
  const calculateRange = (data) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return max - min;
  };

  // Calculate variance
  const calculateVariance = (data, mean) => {
    const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
    const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
    return sumSquaredDiff / data.length;
  };

  // Calculate standard deviation
  const calculateStandardDeviation = (variance) => {
    return Math.sqrt(variance);
  };

  // Calculate quartiles
  const calculateQuartiles = (data) => {
    const sortedData = [...data].sort((a, b) => a - b);
    
    // First quartile (Q1) - median of the lower half
    const lowerHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
    const q1 = calculateMedian(lowerHalf);
    
    // Third quartile (Q3) - median of the upper half
    const upperHalf = sortedData.slice(Math.ceil(sortedData.length / 2));
    const q3 = calculateMedian(upperHalf);
    
    // Interquartile range (IQR)
    const iqr = q3 - q1;
    
    return { q1, q3, iqr };
  };

  const calculate = () => {
    const validData = validateInputs();
    
    if (!validData) {
      setResults(null);
      return;
    }
    
    // Sort data for display
    const sortedData = [...validData].sort((a, b) => a - b);
    
    // Calculate statistics
    const mean = calculateMean(validData);
    const median = calculateMedian(validData);
    const modeResult = calculateMode(validData);
    const range = calculateRange(validData);
    const variance = calculateVariance(validData, mean);
    const standardDeviation = calculateStandardDeviation(variance);
    const quartiles = calculateQuartiles(validData);
    
    // Calculate sum and count
    const sum = validData.reduce((acc, val) => acc + val, 0);
    const count = validData.length;
    
    // Calculate min and max
    const min = Math.min(...validData);
    const max = Math.max(...validData);
    
    setResults({
      data: validData,
      sortedData,
      mean,
      median,
      mode: modeResult,
      range,
      variance,
      standardDeviation,
      quartiles,
      sum,
      count,
      min,
      max
    });
  };

  const handleReset = () => {
    setNumbers(['', '', '', '', '']);
    setBulkData('');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  // Format number with appropriate precision
  const formatNumber = (num) => {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    
    // For decimal numbers, show up to 4 decimal places
    return num.toFixed(4).replace(/\.?0+$/, '');
  };

  return (
    <>
      <SEO
        title="Average, Median & Mode Calculator"
        description="Calculate mean (average), median, mode, range, variance, standard deviation, and other statistical measures for a set of numbers."
        keywords="statistics calculator, average calculator, mean calculator, median calculator, mode calculator, standard deviation calculator, variance calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Average, Median & Mode Calculator</h1>
        <p className="calculator-description">
          Calculate mean (average), median, mode, and other statistical measures for a set of numbers. Get detailed explanations of statistical concepts.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> Enter Data
            </h2>
            
            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleDataInputChange('individual')}
                  className={`px-4 py-2 rounded-md ${
                    dataInput === 'individual'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Individual Values
                </button>
                <button
                  type="button"
                  onClick={() => handleDataInputChange('bulk')}
                  className={`px-4 py-2 rounded-md ${
                    dataInput === 'bulk'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Bulk Data
                </button>
              </div>
              
              {dataInput === 'individual' ? (
                <div className="space-y-3">
                  {numbers.map((number, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={number}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder={`Value ${index + 1}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNumberField(index)}
                        className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                        title="Remove value"
                        disabled={numbers.length <= 2}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addNumberField}
                    className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                  >
                    <FaPlus className="mr-1" /> Add another value
                  </button>
                </div>
              ) : (
                <div>
                  <label htmlFor="bulkData" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter multiple values (separated by commas, spaces, or new lines)
                  </label>
                  <textarea
                    id="bulkData"
                    value={bulkData}
                    onChange={handleBulkDataChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Example: 5, 10, 15, 20, 25"
                    rows={5}
                  />
                </div>
              )}
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

          {results && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Results:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Mean (Average)</h3>
                  <p className="text-2xl font-bold text-primary-600">{formatNumber(results.mean)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Sum of all values divided by the count
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Median</h3>
                  <p className="text-2xl font-bold text-secondary-600">{formatNumber(results.median)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Middle value when data is sorted
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Mode</h3>
                  {results.mode.modes.length > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-tertiary-600">
                        {results.mode.modes.map(formatNumber).join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {results.mode.modes.length === 1 
                          ? `Appears ${results.mode.count} times`
                          : `Each appears ${results.mode.count} times`}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg text-gray-700">No mode (all values appear once)</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Range & Quartiles</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Range:</p>
                      <p className="text-lg font-medium">{formatNumber(results.range)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Min:</p>
                      <p className="text-lg font-medium">{formatNumber(results.min)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max:</p>
                      <p className="text-lg font-medium">{formatNumber(results.max)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IQR:</p>
                      <p className="text-lg font-medium">{formatNumber(results.quartiles.iqr)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Q1 (25%):</p>
                      <p className="text-lg font-medium">{formatNumber(results.quartiles.q1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Q3 (75%):</p>
                      <p className="text-lg font-medium">{formatNumber(results.quartiles.q3)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Variance & Std. Deviation</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Variance:</p>
                      <p className="text-lg font-medium">{formatNumber(results.variance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Standard Deviation:</p>
                      <p className="text-lg font-medium">{formatNumber(results.standardDeviation)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Count:</p>
                      <p className="text-lg font-medium">{results.count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sum:</p>
                      <p className="text-lg font-medium">{formatNumber(results.sum)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Data Set:</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {results.data.map((value, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                        {formatNumber(value)}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-md font-medium text-gray-800 mb-2">Sorted Data:</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {results.sortedData.map((value, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                        {formatNumber(value)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Mean Calculation:</h4>
                      <p className="text-sm text-gray-700">
                        Sum of all values ({formatNumber(results.sum)}) ÷ Count ({results.count}) = {formatNumber(results.mean)}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Median Calculation:</h4>
                      <p className="text-sm text-gray-700">
                        {results.sortedData.length % 2 === 0 
                          ? `Average of middle two values: (${formatNumber(results.sortedData[Math.floor(results.sortedData.length / 2) - 1])} + ${formatNumber(results.sortedData[Math.floor(results.sortedData.length / 2)])}) ÷ 2 = ${formatNumber(results.median)}`
                          : `Middle value: ${formatNumber(results.median)} (position ${Math.floor(results.sortedData.length / 2) + 1} of ${results.sortedData.length})`
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Mode Calculation:</h4>
                      <p className="text-sm text-gray-700">
                        {results.mode.explanation}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Variance Calculation:</h4>
                      <p className="text-sm text-gray-700">
                        Average of squared differences from the mean = {formatNumber(results.variance)}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Standard Deviation:</h4>
                      <p className="text-sm text-gray-700">
                        Square root of variance = √{formatNumber(results.variance)} = {formatNumber(results.standardDeviation)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Statistical Measures Explained</h2>
          <div className="space-y-2">
            <p>
              <strong>Mean (Average):</strong> Sum of all values divided by the count. Sensitive to outliers.
            </p>
            <p>
              <strong>Median:</strong> Middle value when data is sorted. Less sensitive to outliers than the mean.
            </p>
            <p>
              <strong>Mode:</strong> Most frequently occurring value(s) in the data set.
            </p>
            <p>
              <strong>Range:</strong> Difference between the maximum and minimum values.
            </p>
            <p>
              <strong>Variance:</strong> Average of squared differences from the mean, measuring data spread.
            </p>
            <p>
              <strong>Standard Deviation:</strong> Square root of variance, indicating data dispersion.
            </p>
            <p>
              <strong>Quartiles:</strong> Values that divide the data into four equal parts when sorted.
            </p>
            <p>
              <strong>Interquartile Range (IQR):</strong> Difference between the third (Q3) and first (Q1) quartiles.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default StatisticsCalculator;
