import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaWeightHanging } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const IdealWeightCalculator = () => {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [frame, setFrame] = useState('medium');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setResults(null);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
    setResults(null);
  };

  const handleHeightUnitChange = (e) => {
    setHeightUnit(e.target.value);
    setResults(null);
  };

  const handleFrameChange = (e) => {
    setFrame(e.target.value);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      setError('Please enter a valid height');
      return false;
    }
    
    // Additional validation for reasonable height values
    const heightInCm = heightUnit === 'cm' ? parseFloat(height) : parseFloat(height) * 2.54;
    if (heightInCm < 50 || heightInCm > 250) {
      setError('Please enter a reasonable height (50-250 cm or 20-98 inches)');
      return false;
    }
    
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    // Convert height to cm for calculations
    let heightInCm = parseFloat(height);
    if (heightUnit === 'in') {
      heightInCm = heightInCm * 2.54;
    }
    
    // Convert height to meters for BMI calculation
    const heightInM = heightInCm / 100;
    
    // Convert height to inches for other formulas
    const heightInInches = heightInCm / 2.54;
    
    // Calculate ideal weight using different formulas
    
    // 1. Devine Formula (commonly used for medication dosing)
    let devineWeight;
    if (gender === 'male') {
      devineWeight = 50 + 2.3 * (heightInInches - 60);
    } else {
      devineWeight = 45.5 + 2.3 * (heightInInches - 60);
    }
    
    // 2. Robinson Formula
    let robinsonWeight;
    if (gender === 'male') {
      robinsonWeight = 52 + 1.9 * (heightInInches - 60);
    } else {
      robinsonWeight = 49 + 1.7 * (heightInInches - 60);
    }
    
    // 3. Miller Formula
    let millerWeight;
    if (gender === 'male') {
      millerWeight = 56.2 + 1.41 * (heightInInches - 60);
    } else {
      millerWeight = 53.1 + 1.36 * (heightInInches - 60);
    }
    
    // 4. Hamwi Formula
    let hamwiWeight;
    if (gender === 'male') {
      hamwiWeight = 48 + 2.7 * (heightInInches - 60);
    } else {
      hamwiWeight = 45.5 + 2.2 * (heightInInches - 60);
    }
    
    // 5. BMI-based ideal weight (BMI of 22 is often considered ideal)
    const bmiIdealWeight = 22 * (heightInM * heightInM);
    
    // Apply frame size adjustments
    let frameMultiplier = 1;
    if (frame === 'small') {
      frameMultiplier = 0.9;
    } else if (frame === 'large') {
      frameMultiplier = 1.1;
    }
    
    // Calculate average of all formulas
    const averageWeight = (devineWeight + robinsonWeight + millerWeight + hamwiWeight) / 4;
    
    // Apply frame adjustment to all weights
    const adjustedDevineWeight = devineWeight * frameMultiplier;
    const adjustedRobinsonWeight = robinsonWeight * frameMultiplier;
    const adjustedMillerWeight = millerWeight * frameMultiplier;
    const adjustedHamwiWeight = hamwiWeight * frameMultiplier;
    const adjustedAverageWeight = averageWeight * frameMultiplier;
    
    // Calculate healthy weight range (BMI 18.5-24.9)
    const minHealthyWeight = 18.5 * (heightInM * heightInM);
    const maxHealthyWeight = 24.9 * (heightInM * heightInM);
    
    setResults({
      heightInCm,
      heightInInches,
      devineWeight,
      robinsonWeight,
      millerWeight,
      hamwiWeight,
      bmiIdealWeight,
      averageWeight,
      adjustedDevineWeight,
      adjustedRobinsonWeight,
      adjustedMillerWeight,
      adjustedHamwiWeight,
      adjustedAverageWeight,
      minHealthyWeight,
      maxHealthyWeight,
      frame,
      frameMultiplier
    });
  };

  const handleReset = () => {
    setGender('male');
    setHeight('');
    setHeightUnit('cm');
    setFrame('medium');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  const formatWeight = (weight) => {
    return weight.toFixed(1);
  };

  return (
    <>
      <SEO
        title="Ideal Weight Calculator - Find Your Healthy Weight Range"
        description="Calculate your ideal weight based on height, gender, and body frame using multiple scientific formulas. Get personalized weight recommendations and healthy weight ranges."
        keywords="ideal weight calculator, healthy weight, ideal body weight, weight calculator, BMI, Devine formula, Robinson formula, Miller formula, Hamwi formula"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Ideal Weight Calculator</h1>
        <p className="calculator-description">
          Calculate your ideal weight based on height, gender, and body frame using multiple scientific formulas.
          This calculator provides weight recommendations from different methods and a healthy weight range.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaWeightHanging className="mr-2 text-primary-500" /> 
              Ideal Weight Calculator
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={handleGenderChange}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={handleGenderChange}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={handleHeightChange}
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder={heightUnit === 'cm' ? 'Enter height in cm' : 'Enter height in inches'}
                  min="0"
                  step="0.1"
                />
                <select
                  value={heightUnit}
                  onChange={handleHeightUnitChange}
                  className="rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Frame Size
              </label>
              <select
                value={frame}
                onChange={handleFrameChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Body frame size affects your ideal weight. If you're unsure, choose Medium.
              </p>
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
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Your Ideal Weight
                </h3>
                <p className="text-2xl font-bold text-primary-600">
                  {formatWeight(results.adjustedAverageWeight)} kg
                </p>
                <p className="text-sm text-gray-600">
                  Based on the average of multiple formulas, adjusted for your {results.frame} frame size.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Healthy Weight Range (BMI 18.5-24.9)
                </h3>
                <p className="text-xl font-bold text-secondary-600">
                  {formatWeight(results.minHealthyWeight)} - {formatWeight(results.maxHealthyWeight)} kg
                </p>
                <p className="text-sm text-gray-600">
                  Based on the BMI (Body Mass Index) healthy weight range.
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Detailed Results' : 'Show Detailed Results'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Detailed Results by Formula:</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formula</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard (kg)</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjusted for {results.frame} Frame (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Devine Formula</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.devineWeight)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.adjustedDevineWeight)}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Robinson Formula</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.robinsonWeight)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.adjustedRobinsonWeight)}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Miller Formula</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.millerWeight)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.adjustedMillerWeight)}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hamwi Formula</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.hamwiWeight)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.adjustedHamwiWeight)}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BMI-based (BMI=22)</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWeight(results.bmiIdealWeight)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">N/A</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatWeight(results.averageWeight)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatWeight(results.adjustedAverageWeight)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-1">Calculation Details:</h4>
                    <p className="text-sm text-gray-600 mb-2">Height: {results.heightInCm.toFixed(1)} cm ({results.heightInInches.toFixed(1)} inches)</p>
                    <p className="text-sm text-gray-600 mb-2">Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)}</p>
                    <p className="text-sm text-gray-600 mb-2">Frame Size: {frame.charAt(0).toUpperCase() + frame.slice(1)} (Adjustment factor: {results.frameMultiplier.toFixed(1)})</p>
                    
                    <h4 className="font-medium text-gray-700 mt-3 mb-1">Formula Explanations:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      <li><strong>Devine Formula:</strong> Originally developed for medication dosing. For men: 50 kg + 2.3 kg per inch over 5 feet. For women: 45.5 kg + 2.3 kg per inch over 5 feet.</li>
                      <li><strong>Robinson Formula:</strong> For men: 52 kg + 1.9 kg per inch over 5 feet. For women: 49 kg + 1.7 kg per inch over 5 feet.</li>
                      <li><strong>Miller Formula:</strong> For men: 56.2 kg + 1.41 kg per inch over 5 feet. For women: 53.1 kg + 1.36 kg per inch over 5 feet.</li>
                      <li><strong>Hamwi Formula:</strong> For men: 48 kg + 2.7 kg per inch over 5 feet. For women: 45.5 kg + 2.2 kg per inch over 5 feet.</li>
                      <li><strong>BMI-based:</strong> Weight corresponding to a BMI of 22, which is in the middle of the healthy BMI range.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Ideal Weight</h2>
          <div className="space-y-2">
            <p>
              <strong>Ideal weight</strong> is an estimated weight range that is considered healthy for your height, gender, and body frame.
            </p>
            <p>
              It's important to understand that ideal weight is not a perfect measure of health, and there are many factors that contribute to overall health beyond weight alone.
            </p>
            <p>
              <strong>Different formulas for calculating ideal weight:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The Devine, Robinson, Miller, and Hamwi formulas were developed between the 1960s and 1980s for different purposes, including medication dosing.</li>
              <li>BMI-based calculations use the Body Mass Index formula, with a BMI of 18.5-24.9 considered the healthy range.</li>
            </ul>
            <p>
              <strong>Body frame size</strong> affects your ideal weight. People with larger frames typically have heavier bones and may weigh more at the same height.
            </p>
            <p>
              Remember that ideal weight calculations are just estimates. Your personal ideal weight may vary based on muscle mass, body composition, age, and other factors.
            </p>
            <p>
              Always consult with healthcare professionals for personalized advice about your weight and health.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default IdealWeightCalculator;
