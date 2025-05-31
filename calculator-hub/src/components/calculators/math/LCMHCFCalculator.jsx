import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const LCMHCFCalculator = () => {
  const [numbers, setNumbers] = useState(['', '']);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleInputChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
    setResults(null);
    setError('');
  };

  const addNumberField = () => {
    if (numbers.length < 10) {
      setNumbers([...numbers, '']);
    }
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
    
    // Check if all inputs are valid numbers
    const validNumbers = numbers.map(num => {
      const parsedNum = parseInt(num.trim());
      return !isNaN(parsedNum) && parsedNum > 0 && Number.isInteger(parsedNum);
    });
    
    if (validNumbers.includes(false)) {
      setError('Please enter valid positive integers for all fields');
      return false;
    }
    
    return true;
  };

  // Calculate GCD (HCF) of two numbers using Euclidean algorithm
  const calculateGCD = (a, b) => {
    // Ensure a is greater than or equal to b
    if (b > a) {
      [a, b] = [b, a];
    }
    
    // Store steps for showing the calculation
    const steps = [];
    
    while (b !== 0) {
      const remainder = a % b;
      steps.push(`${a} = ${b} × ${Math.floor(a / b)} + ${remainder}`);
      [a, b] = [b, remainder];
    }
    
    return { gcd: a, steps };
  };

  // Calculate LCM of two numbers
  const calculateLCM = (a, b) => {
    const { gcd } = calculateGCD(a, b);
    return (a * b) / gcd;
  };

  // Calculate GCD of multiple numbers
  const calculateMultipleGCD = (nums) => {
    let result = nums[0];
    const allSteps = [];
    
    for (let i = 1; i < nums.length; i++) {
      const { gcd, steps } = calculateGCD(result, nums[i]);
      allSteps.push({
        pair: `GCD(${result}, ${nums[i]})`,
        steps
      });
      result = gcd;
    }
    
    return { gcd: result, steps: allSteps };
  };

  // Calculate LCM of multiple numbers
  const calculateMultipleLCM = (nums) => {
    let result = nums[0];
    const steps = [];
    
    for (let i = 1; i < nums.length; i++) {
      const previousLCM = result;
      const currentNum = nums[i];
      const { gcd } = calculateGCD(result, currentNum);
      result = (result * currentNum) / gcd;
      
      steps.push({
        pair: `LCM(${previousLCM}, ${currentNum})`,
        calculation: `(${previousLCM} × ${currentNum}) ÷ GCD(${previousLCM}, ${currentNum}) = (${previousLCM} × ${currentNum}) ÷ ${gcd} = ${result}`
      });
    }
    
    return { lcm: result, steps };
  };

  const calculate = () => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }
    
    // Convert inputs to integers
    const nums = numbers.map(num => parseInt(num.trim()));
    
    // Calculate HCF (GCD)
    const gcdResult = calculateMultipleGCD(nums);
    
    // Calculate LCM
    const lcmResult = calculateMultipleLCM(nums);
    
    setResults({
      numbers: nums,
      hcf: gcdResult.gcd,
      lcm: lcmResult.lcm,
      gcdSteps: gcdResult.steps,
      lcmSteps: lcmResult.steps
    });
  };

  const handleReset = () => {
    setNumbers(['', '']);
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  return (
    <>
      <SEO
        title="LCM & HCF Calculator"
        description="Calculate the Least Common Multiple (LCM) and Highest Common Factor (HCF) of multiple numbers with step-by-step explanations."
        keywords="LCM calculator, HCF calculator, GCD calculator, greatest common divisor, least common multiple, math calculator, number theory"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">LCM & HCF Calculator</h1>
        <p className="calculator-description">
          Calculate the Least Common Multiple (LCM) and Highest Common Factor (HCF) of multiple numbers with step-by-step explanations.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> Enter Numbers
            </h2>
            
            <div className="space-y-4">
              {numbers.map((number, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <label htmlFor={`number-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Number {index + 1} {index < 2 && '*'}
                    </label>
                    <input
                      type="number"
                      id={`number-${index}`}
                      value={number}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter a positive integer"
                      min="1"
                      step="1"
                    />
                  </div>
                  {numbers.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeNumberField(index)}
                      className="mt-6 p-2 text-red-500 hover:text-red-700 focus:outline-none"
                      title="Remove number"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              
              {numbers.length < 10 && (
                <button
                  type="button"
                  onClick={addNumberField}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaPlus className="mr-1" /> Add another number
                </button>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Highest Common Factor (HCF)</h3>
                  <p className="text-2xl font-bold text-primary-600">{results.hcf}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Also known as Greatest Common Divisor (GCD)
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Least Common Multiple (LCM)</h3>
                  <p className="text-2xl font-bold text-secondary-600">{results.lcm}</p>
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
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">HCF Calculation Steps:</h3>
                    {results.gcdSteps.map((stepGroup, groupIndex) => (
                      <div key={groupIndex} className="mb-3">
                        <p className="font-medium">{stepGroup.pair}:</p>
                        <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                          {stepGroup.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">LCM Calculation Steps:</h3>
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                      {results.lcmSteps.map((step, index) => (
                        <li key={index}>
                          <span className="font-medium">{step.pair}:</span> {step.calculation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">What are LCM and HCF?</h2>
          <div className="space-y-2">
            <p>
              <strong>Highest Common Factor (HCF)</strong> or Greatest Common Divisor (GCD) is the largest positive integer that divides each of the given numbers without a remainder.
            </p>
            <p>
              <strong>Least Common Multiple (LCM)</strong> is the smallest positive integer that is divisible by all of the given numbers.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Example: For numbers 12 and 18, the HCF is 6 and the LCM is 36.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default LCMHCFCalculator;
