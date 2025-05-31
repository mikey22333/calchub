import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaHeartbeat } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const HeartRateZoneCalculator = () => {
  const [age, setAge] = useState('');
  const [restingHeartRate, setRestingHeartRate] = useState('');
  const [method, setMethod] = useState('karvonen');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleAgeChange = (e) => {
    setAge(e.target.value);
    setResults(null);
  };

  const handleRestingHeartRateChange = (e) => {
    setRestingHeartRate(e.target.value);
    setResults(null);
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0) {
      setError('Please enter a valid age');
      return false;
    }
    
    if (method === 'karvonen' && (!restingHeartRate || isNaN(parseInt(restingHeartRate)) || parseInt(restingHeartRate) <= 0)) {
      setError('Please enter a valid resting heart rate');
      return false;
    }
    
    // Additional validation for reasonable age values
    const ageValue = parseInt(age);
    if (ageValue < 1 || ageValue > 120) {
      setError('Please enter a reasonable age (1-120 years)');
      return false;
    }
    
    // Additional validation for reasonable resting heart rate values
    if (method === 'karvonen') {
      const rhrValue = parseInt(restingHeartRate);
      if (rhrValue < 30 || rhrValue > 120) {
        setError('Please enter a reasonable resting heart rate (30-120 bpm)');
        return false;
      }
    }
    
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const ageValue = parseInt(age);
    
    // Calculate maximum heart rate using different formulas
    
    // 1. Traditional formula (220 - age)
    const traditionalMaxHR = 220 - ageValue;
    
    // 2. Tanaka formula (208 - 0.7 × age)
    const tanakaMaxHR = 208 - (0.7 * ageValue);
    
    // 3. Gellish formula (207 - 0.7 × age)
    const gellishMaxHR = 207 - (0.7 * ageValue);
    
    // 4. Fairburn formula (Women: 209 - 0.9 × age, Men: 208 - 0.8 × age)
    // We'll use an average since we don't collect gender
    const fairburnMaxHR = 208.5 - (0.85 * ageValue);
    
    // 5. Londeree and Moeschberger formula (206.3 - 0.711 × age)
    const londereeMaxHR = 206.3 - (0.711 * ageValue);
    
    // Calculate average of all formulas
    const maxHR = Math.round((traditionalMaxHR + tanakaMaxHR + gellishMaxHR + fairburnMaxHR + londereeMaxHR) / 5);
    
    let zones;
    
    if (method === 'percentage') {
      // Percentage of Max HR method
      zones = [
        { name: 'Zone 1 - Very Light (Recovery)', min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6), description: 'Very easy, used for warm-up and recovery' },
        { name: 'Zone 2 - Light (Endurance)', min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), description: 'Comfortable pace, improves general endurance' },
        { name: 'Zone 3 - Moderate (Aerobic)', min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8), description: 'Challenging but sustainable, improves aerobic fitness' },
        { name: 'Zone 4 - Hard (Threshold)', min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9), description: 'Difficult, improves anaerobic threshold' },
        { name: 'Zone 5 - Maximum (Anaerobic)', min: Math.round(maxHR * 0.9), max: maxHR, description: 'Very intense, improves maximum performance and speed' }
      ];
    } else if (method === 'karvonen') {
      // Karvonen method (Heart Rate Reserve)
      const rhrValue = parseInt(restingHeartRate);
      const hrr = maxHR - rhrValue; // Heart Rate Reserve
      
      zones = [
        { name: 'Zone 1 - Very Light (Recovery)', min: Math.round(rhrValue + (hrr * 0.5)), max: Math.round(rhrValue + (hrr * 0.6)), description: 'Very easy, used for warm-up and recovery' },
        { name: 'Zone 2 - Light (Endurance)', min: Math.round(rhrValue + (hrr * 0.6)), max: Math.round(rhrValue + (hrr * 0.7)), description: 'Comfortable pace, improves general endurance' },
        { name: 'Zone 3 - Moderate (Aerobic)', min: Math.round(rhrValue + (hrr * 0.7)), max: Math.round(rhrValue + (hrr * 0.8)), description: 'Challenging but sustainable, improves aerobic fitness' },
        { name: 'Zone 4 - Hard (Threshold)', min: Math.round(rhrValue + (hrr * 0.8)), max: Math.round(rhrValue + (hrr * 0.9)), description: 'Difficult, improves anaerobic threshold' },
        { name: 'Zone 5 - Maximum (Anaerobic)', min: Math.round(rhrValue + (hrr * 0.9)), max: maxHR, description: 'Very intense, improves maximum performance and speed' }
      ];
    }
    
    setResults({
      age: ageValue,
      restingHeartRate: method === 'karvonen' ? parseInt(restingHeartRate) : null,
      maxHR,
      traditionalMaxHR,
      tanakaMaxHR,
      gellishMaxHR,
      fairburnMaxHR,
      londereeMaxHR,
      method,
      zones
    });
  };

  const handleReset = () => {
    setAge('');
    setRestingHeartRate('');
    setMethod('karvonen');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  // Function to determine color based on zone
  const getZoneColor = (zoneIndex) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-orange-100 border-orange-300 text-orange-800',
      'bg-red-100 border-red-300 text-red-800'
    ];
    return colors[zoneIndex] || colors[0];
  };

  return (
    <>
      <SEO
        title="Heart Rate Zone Calculator - Training Zones for Exercise"
        description="Calculate your heart rate training zones based on age and resting heart rate. Optimize your workout intensity for better fitness results."
        keywords="heart rate zone calculator, training zones, heart rate calculator, exercise intensity, cardio zones, target heart rate"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Heart Rate Zone Calculator</h1>
        <p className="calculator-description">
          Calculate your heart rate training zones based on your age and resting heart rate.
          Use these zones to optimize your workout intensity for better fitness results.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaHeartbeat className="mr-2 text-primary-500" /> 
              Heart Rate Zone Calculator
            </h2>

            <div className="mb-4">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={handleAgeChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter your age in years"
                min="0"
                step="1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Method
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="method"
                    value="karvonen"
                    checked={method === 'karvonen'}
                    onChange={handleMethodChange}
                  />
                  <span className="ml-2">Karvonen Method (Heart Rate Reserve)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="method"
                    value="percentage"
                    checked={method === 'percentage'}
                    onChange={handleMethodChange}
                  />
                  <span className="ml-2">Percentage of Max HR</span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                The Karvonen method is more personalized as it accounts for your resting heart rate.
              </p>
            </div>

            {method === 'karvonen' && (
              <div className="mb-4">
                <label htmlFor="restingHeartRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Resting Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  id="restingHeartRate"
                  value={restingHeartRate}
                  onChange={handleRestingHeartRateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter your resting heart rate"
                  min="0"
                  step="1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Measure your heart rate when you first wake up, before getting out of bed.
                </p>
              </div>
            )}

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
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Estimated Maximum Heart Rate
                </h3>
                <p className="text-2xl font-bold text-primary-600">
                  {results.maxHR} bpm
                </p>
                <p className="text-sm text-gray-600">
                  Based on your age: {results.age} years
                  {results.restingHeartRate && `, Resting HR: ${results.restingHeartRate} bpm`}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Your Heart Rate Training Zones
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Using the {results.method === 'karvonen' ? 'Karvonen' : 'Percentage of Max HR'} method
                </p>
                
                <div className="space-y-3">
                  {results.zones.map((zone, index) => (
                    <div key={index} className={`p-3 rounded-md border ${getZoneColor(index)}`}>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{zone.name}</h4>
                        <p className="font-bold">{zone.min} - {zone.max} bpm</p>
                      </div>
                      <p className="text-sm mt-1">{zone.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Calculation Details' : 'Show Calculation Details'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Details:</h3>
                  
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-medium">Maximum Heart Rate Formulas:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Traditional: 220 - {results.age} = {results.traditionalMaxHR} bpm</li>
                      <li>Tanaka: 208 - (0.7 × {results.age}) = {results.tanakaMaxHR.toFixed(1)} bpm</li>
                      <li>Gellish: 207 - (0.7 × {results.age}) = {results.gellishMaxHR.toFixed(1)} bpm</li>
                      <li>Fairburn: 208.5 - (0.85 × {results.age}) = {results.fairburnMaxHR.toFixed(1)} bpm</li>
                      <li>Londeree: 206.3 - (0.711 × {results.age}) = {results.londereeMaxHR.toFixed(1)} bpm</li>
                    </ul>
                    <p>Average Max HR (rounded): {results.maxHR} bpm</p>
                    
                    {results.method === 'karvonen' && (
                      <>
                        <p className="font-medium mt-3">Karvonen Method (Heart Rate Reserve):</p>
                        <p>Heart Rate Reserve (HRR) = Max HR - Resting HR = {results.maxHR} - {results.restingHeartRate} = {results.maxHR - results.restingHeartRate} bpm</p>
                        <p>Zone Formula: Resting HR + (HRR × Zone Percentage)</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {results.zones.map((zone, index) => (
                            <li key={index}>
                              {zone.name}: {results.restingHeartRate} + ({results.maxHR - results.restingHeartRate} × {index === 4 ? '0.9-1.0' : `0.${5 + index}-0.${6 + index}`}) = {zone.min}-{zone.max} bpm
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    {results.method === 'percentage' && (
                      <>
                        <p className="font-medium mt-3">Percentage of Max HR Method:</p>
                        <p>Zone Formula: Max HR × Zone Percentage</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {results.zones.map((zone, index) => (
                            <li key={index}>
                              {zone.name}: {results.maxHR} × {index === 4 ? '0.9-1.0' : `0.${5 + index}-0.${6 + index}`} = {zone.min}-{zone.max} bpm
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Heart Rate Training Zones</h2>
          <div className="space-y-2">
            <p>
              <strong>Heart rate training zones</strong> are ranges of heart rates that correspond to different exercise intensities. Training in specific zones helps target different fitness goals.
            </p>
            
            <p>
              <strong>The five training zones:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Zone 1 (50-60%):</strong> Very light intensity, good for recovery, warm-up, and cool-down.</li>
              <li><strong>Zone 2 (60-70%):</strong> Light intensity, improves basic endurance and fat burning. Good for longer workouts.</li>
              <li><strong>Zone 3 (70-80%):</strong> Moderate intensity, improves aerobic fitness and efficiency. The "aerobic zone."</li>
              <li><strong>Zone 4 (80-90%):</strong> Hard intensity, improves anaerobic threshold. Challenging but sustainable for shorter periods.</li>
              <li><strong>Zone 5 (90-100%):</strong> Maximum intensity, improves maximum performance, speed, and power. Only sustainable for short bursts.</li>
            </ul>
            
            <p>
              <strong>Calculation methods:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Percentage of Max HR:</strong> Simple method that uses a percentage of your estimated maximum heart rate.</li>
              <li><strong>Karvonen Method:</strong> More personalized as it accounts for your resting heart rate, calculating zones based on your heart rate reserve (HRR).</li>
            </ul>
            
            <p>
              <strong>Measuring your resting heart rate:</strong> For the most accurate reading, measure your heart rate first thing in the morning before getting out of bed. Count your pulse for 60 seconds or use a heart rate monitor.
            </p>
            
            <p>
              <strong>Note:</strong> These calculations provide estimates. Factors like fitness level, genetics, medication, and environmental conditions can affect your actual heart rate response. For personalized training advice, consider consulting with a fitness professional.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default HeartRateZoneCalculator;
