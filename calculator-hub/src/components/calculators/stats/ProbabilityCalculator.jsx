import React, { useState } from 'react';
import { FaDice, FaPercentage, FaRandom, FaEquals } from 'react-icons/fa';

const ProbabilityCalculator = () => {
  const [calculationType, setCalculationType] = useState('simple');
  const [favorableOutcomes, setFavorableOutcomes] = useState('');
  const [totalOutcomes, setTotalOutcomes] = useState('');
  const [probabilityA, setProbabilityA] = useState('');
  const [probabilityB, setProbabilityB] = useState('');
  const [independentEvents, setIndependentEvents] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const validateInput = (input, fieldName) => {
    const value = parseFloat(input);
    if (isNaN(value)) {
      setError(`Please enter a valid number for ${fieldName}`);
      return false;
    }
    
    if (value < 0) {
      setError(`${fieldName} cannot be negative`);
      return false;
    }
    
    return true;
  };

  const validateProbability = (input, fieldName) => {
    if (!validateInput(input, fieldName)) return false;
    
    const value = parseFloat(input);
    if (value < 0 || value > 1) {
      setError(`${fieldName} must be between 0 and 1`);
      return false;
    }
    
    return true;
  };

  const calculateSimpleProbability = () => {
    if (!validateInput(favorableOutcomes, 'favorable outcomes') || 
        !validateInput(totalOutcomes, 'total outcomes')) {
      return;
    }
    
    const favorable = parseFloat(favorableOutcomes);
    const total = parseFloat(totalOutcomes);
    
    if (favorable > total) {
      setError('Favorable outcomes cannot exceed total outcomes');
      return;
    }
    
    if (total === 0) {
      setError('Total outcomes cannot be zero');
      return;
    }
    
    const probability = favorable / total;
    const odds = `${favorable} : ${total - favorable}`;
    const percentage = probability * 100;
    
    setResults({
      probability: probability.toFixed(6),
      odds,
      percentage: percentage.toFixed(2) + '%',
      decimal: probability.toFixed(6),
      fraction: simplifyFraction(favorable, total)
    });
  };

  const calculateCompoundProbability = () => {
    if (!validateProbability(probabilityA, 'Probability A') || 
        !validateProbability(probabilityB, 'Probability B')) {
      return;
    }
    
    const probA = parseFloat(probabilityA);
    const probB = parseFloat(probabilityB);
    
    // Calculate intersection (AND)
    let intersection;
    if (independentEvents) {
      intersection = probA * probB;
    } else {
      // For dependent events, we need conditional probability
      // This is simplified as we can't know P(B|A) without more information
      intersection = Math.min(probA, probB) * 0.8; // Approximation
    }
    
    // Calculate union (OR)
    const union = probA + probB - intersection;
    
    // Calculate exclusive OR (XOR)
    const exclusiveOr = probA + probB - 2 * intersection;
    
    // Calculate complement (NOT A)
    const complementA = 1 - probA;
    const complementB = 1 - probB;
    
    setResults({
      intersection: intersection.toFixed(6),
      union: union.toFixed(6),
      exclusiveOr: exclusiveOr.toFixed(6),
      complementA: complementA.toFixed(6),
      complementB: complementB.toFixed(6),
      independentEvents
    });
  };

  const handleCalculate = () => {
    setError('');
    setResults(null);
    
    if (calculationType === 'simple') {
      calculateSimpleProbability();
    } else {
      calculateCompoundProbability();
    }
  };

  const handleClear = () => {
    setFavorableOutcomes('');
    setTotalOutcomes('');
    setProbabilityA('');
    setProbabilityB('');
    setIndependentEvents(true);
    setResults(null);
    setError('');
  };

  // Helper function to find the greatest common divisor (GCD)
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Helper function to simplify fractions
  const simplifyFraction = (numerator, denominator) => {
    if (numerator === 0) return '0/1';
    if (denominator === 0) return 'undefined';
    
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <FaDice className="mr-2 text-blue-600" /> Probability Calculator
        </h2>
        <p className="text-gray-600">Calculate probabilities for simple and compound events</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setCalculationType('simple')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
              calculationType === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Simple Probability
          </button>
          <button
            onClick={() => setCalculationType('compound')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
              calculationType === 'compound'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Compound Probability
          </button>
        </div>

        {calculationType === 'simple' ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="favorableOutcomes" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Favorable Outcomes
              </label>
              <input
                type="number"
                id="favorableOutcomes"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={favorableOutcomes}
                onChange={(e) => setFavorableOutcomes(e.target.value)}
                min="0"
                step="1"
                placeholder="e.g., 1 for rolling a six on a die"
              />
            </div>
            <div>
              <label htmlFor="totalOutcomes" className="block text-sm font-medium text-gray-700 mb-1">
                Total Number of Possible Outcomes
              </label>
              <input
                type="number"
                id="totalOutcomes"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={totalOutcomes}
                onChange={(e) => setTotalOutcomes(e.target.value)}
                min="1"
                step="1"
                placeholder="e.g., 6 for a standard die"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="probabilityA" className="block text-sm font-medium text-gray-700 mb-1">
                Probability of Event A (between 0 and 1)
              </label>
              <input
                type="number"
                id="probabilityA"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={probabilityA}
                onChange={(e) => setProbabilityA(e.target.value)}
                min="0"
                max="1"
                step="0.01"
                placeholder="e.g., 0.5 for a fair coin toss"
              />
            </div>
            <div>
              <label htmlFor="probabilityB" className="block text-sm font-medium text-gray-700 mb-1">
                Probability of Event B (between 0 and 1)
              </label>
              <input
                type="number"
                id="probabilityB"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={probabilityB}
                onChange={(e) => setProbabilityB(e.target.value)}
                min="0"
                max="1"
                step="0.01"
                placeholder="e.g., 0.5 for a fair coin toss"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="independentEvents"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={independentEvents}
                onChange={(e) => setIndependentEvents(e.target.checked)}
              />
              <label htmlFor="independentEvents" className="ml-2 block text-sm text-gray-700">
                Events are independent (one event doesn't affect the other)
              </label>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
        >
          <FaEquals className="mr-2" /> Calculate Probability
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
            <FaPercentage className="mr-2 text-blue-600" /> Probability Results
          </h3>
          
          {calculationType === 'simple' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Probability</h4>
                <p className="text-lg font-semibold">{results.probability}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Percentage</h4>
                <p className="text-lg font-semibold">{results.percentage}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Odds</h4>
                <p className="text-lg font-semibold">{results.odds}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Decimal</h4>
                <p className="text-lg font-semibold">{results.decimal}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fraction</h4>
                <p className="text-lg font-semibold">{results.fraction}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-sm text-gray-600">
                {results.independentEvents 
                  ? 'Calculated for independent events (events do not affect each other)' 
                  : 'Calculated for dependent events (events may affect each other)'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">P(A AND B) - Intersection</h4>
                  <p className="text-lg font-semibold">{results.intersection}</p>
                  <p className="text-xs text-gray-500 mt-1">Probability of both events occurring</p>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">P(A OR B) - Union</h4>
                  <p className="text-lg font-semibold">{results.union}</p>
                  <p className="text-xs text-gray-500 mt-1">Probability of either event occurring</p>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">P(A XOR B) - Exclusive OR</h4>
                  <p className="text-lg font-semibold">{results.exclusiveOr}</p>
                  <p className="text-xs text-gray-500 mt-1">Probability of exactly one event occurring</p>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">P(NOT A)</h4>
                  <p className="text-lg font-semibold">{results.complementA}</p>
                  <p className="text-xs text-gray-500 mt-1">Probability of event A not occurring</p>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">P(NOT B)</h4>
                  <p className="text-lg font-semibold">{results.complementB}</p>
                  <p className="text-xs text-gray-500 mt-1">Probability of event B not occurring</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-medium text-gray-700 mb-2">About Probability Calculations</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Simple Probability</strong>: P(Event) = Number of favorable outcomes / Total number of possible outcomes</li>
          <li><strong>Compound Probability</strong>: Calculations involving multiple events</li>
          <li><strong>Independent Events</strong>: Events where the outcome of one does not affect the probability of the other</li>
          <li><strong>Dependent Events</strong>: Events where the outcome of one affects the probability of the other</li>
          <li><strong>P(A AND B)</strong>: Probability of both events A and B occurring</li>
          <li><strong>P(A OR B)</strong>: Probability of either event A or event B or both occurring</li>
          <li><strong>P(A XOR B)</strong>: Probability of either event A or event B occurring, but not both</li>
        </ul>
      </div>
    </div>
  );
};

export default ProbabilityCalculator;
