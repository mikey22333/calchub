import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaTint, FaRunning, FaThermometerHalf } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [climate, setClimate] = useState('moderate');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    setResults(null);
  };

  const handleWeightUnitChange = (e) => {
    setWeightUnit(e.target.value);
    setResults(null);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
    setResults(null);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setResults(null);
  };

  const handleActivityLevelChange = (e) => {
    setActivityLevel(e.target.value);
    setResults(null);
  };

  const handleClimateChange = (e) => {
    setClimate(e.target.value);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      setError('Please enter a valid weight');
      return false;
    }
    
    if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0) {
      setError('Please enter a valid age');
      return false;
    }
    
    // Additional validation for reasonable weight values
    const weightInKg = weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    if (weightInKg < 20 || weightInKg > 300) {
      setError('Please enter a reasonable weight (20-300 kg or 44-660 lbs)');
      return false;
    }
    
    // Additional validation for reasonable age values
    const ageValue = parseInt(age);
    if (ageValue < 1 || ageValue > 120) {
      setError('Please enter a reasonable age (1-120 years)');
      return false;
    }
    
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    // Convert weight to kg for calculations
    let weightInKg = parseFloat(weight);
    if (weightUnit === 'lbs') {
      weightInKg = weightInKg * 0.453592;
    }
    
    const ageValue = parseInt(age);
    
    // Basic calculation based on weight (standard formula)
    // The standard recommendation is to drink 30-35 ml per kg of body weight
    let baseIntake = weightInKg * 0.033; // 33 ml per kg
    
    // Adjust for age
    let ageMultiplier = 1;
    if (ageValue < 18) {
      // Children and teenagers need more water per kg
      ageMultiplier = 1.1;
    } else if (ageValue > 55) {
      // Older adults may need slightly less
      ageMultiplier = 0.9;
    }
    
    // Adjust for gender
    let genderMultiplier = 1;
    if (gender === 'female') {
      // Women typically need slightly less water than men
      genderMultiplier = 0.9;
    }
    
    // Adjust for activity level
    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 0.8;
        break;
      case 'light':
        activityMultiplier = 0.95;
        break;
      case 'moderate':
        activityMultiplier = 1.1;
        break;
      case 'active':
        activityMultiplier = 1.25;
        break;
      case 'veryActive':
        activityMultiplier = 1.4;
        break;
      default:
        activityMultiplier = 1;
    }
    
    // Adjust for climate
    let climateMultiplier;
    switch (climate) {
      case 'cold':
        climateMultiplier = 0.9;
        break;
      case 'moderate':
        climateMultiplier = 1;
        break;
      case 'hot':
        climateMultiplier = 1.2;
        break;
      case 'veryHot':
        climateMultiplier = 1.4;
        break;
      default:
        climateMultiplier = 1;
    }
    
    // Calculate adjusted water intake
    const adjustedIntake = baseIntake * ageMultiplier * genderMultiplier * activityMultiplier * climateMultiplier;
    
    // Calculate range (±10%)
    const minIntake = adjustedIntake * 0.9;
    const maxIntake = adjustedIntake * 1.1;
    
    // Convert to other units
    const intakeInOunces = adjustedIntake * 33.814; // 1 liter = 33.814 US fluid ounces
    const intakeInCups = intakeInOunces / 8; // 1 cup = 8 fluid ounces
    
    // Calculate water from food (typically 20% of total water intake)
    const waterFromFood = adjustedIntake * 0.2;
    const waterToDrink = adjustedIntake - waterFromFood;
    
    // Calculate number of standard glasses (1 glass = 8 oz = 0.237 liters)
    const glassesOfWater = waterToDrink / 0.237;
    
    setResults({
      weightInKg,
      baseIntake,
      ageMultiplier,
      genderMultiplier,
      activityMultiplier,
      climateMultiplier,
      adjustedIntake,
      minIntake,
      maxIntake,
      intakeInOunces,
      intakeInCups,
      waterFromFood,
      waterToDrink,
      glassesOfWater
    });
  };

  const handleReset = () => {
    setWeight('');
    setWeightUnit('kg');
    setAge('');
    setGender('male');
    setActivityLevel('moderate');
    setClimate('moderate');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  const formatVolume = (volume, unit = 'L') => {
    if (unit === 'L') {
      return volume.toFixed(2) + ' L';
    } else if (unit === 'oz') {
      return Math.round(volume) + ' oz';
    } else if (unit === 'cups') {
      return volume.toFixed(1) + ' cups';
    } else if (unit === 'glasses') {
      return Math.round(volume) + ' glasses';
    }
    return volume.toFixed(2);
  };

  return (
    <>
      <SEO
        title="Water Intake Calculator - Daily Hydration Needs"
        description="Calculate your recommended daily water intake based on weight, age, gender, activity level, and climate. Stay properly hydrated for optimal health."
        keywords="water intake calculator, hydration calculator, daily water needs, water consumption, hydration needs, water requirements"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Water Intake Calculator</h1>
        <p className="calculator-description">
          Calculate your recommended daily water intake based on your weight, age, gender, activity level, and climate.
          Stay properly hydrated for optimal health and well-being.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaTint className="mr-2 text-primary-500" /> 
              Water Intake Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={handleWeightChange}
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder={weightUnit === 'kg' ? 'Enter weight in kg' : 'Enter weight in lbs'}
                    min="0"
                    step="0.1"
                  />
                  <select
                    value={weightUnit}
                    onChange={handleWeightUnitChange}
                    className="rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={handleAgeChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter age in years"
                  min="0"
                  step="1"
                />
              </div>
            </div>

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
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level <FaRunning className="inline ml-1 text-primary-500" />
              </label>
              <select
                id="activityLevel"
                value={activityLevel}
                onChange={handleActivityLevelChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="sedentary">Sedentary (Little to no exercise)</option>
                <option value="light">Light (Light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (Moderate exercise 3-5 days/week)</option>
                <option value="active">Active (Hard exercise 6-7 days/week)</option>
                <option value="veryActive">Very Active (Hard daily exercise & physical job or training twice a day)</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="climate" className="block text-sm font-medium text-gray-700 mb-1">
                Climate <FaThermometerHalf className="inline ml-1 text-primary-500" />
              </label>
              <select
                id="climate"
                value={climate}
                onChange={handleClimateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="cold">Cold (Below 50°F/10°C)</option>
                <option value="moderate">Moderate (50-70°F/10-21°C)</option>
                <option value="hot">Hot (70-90°F/21-32°C)</option>
                <option value="veryHot">Very Hot (Above 90°F/32°C)</option>
              </select>
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
                  Recommended Daily Water Intake
                </h3>
                <p className="text-2xl font-bold text-primary-600">
                  {formatVolume(results.adjustedIntake)}
                </p>
                <p className="text-sm text-gray-600">
                  Range: {formatVolume(results.minIntake)} - {formatVolume(results.maxIntake)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Water to Drink
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatVolume(results.waterToDrink)}
                  </p>
                  <p className="text-sm text-gray-600">
                    About {formatVolume(results.glassesOfWater, 'glasses')} (8 oz each)
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    In US Cups
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatVolume(results.intakeInCups, 'cups')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatVolume(results.intakeInOunces, 'oz')}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Water from Food
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatVolume(results.waterFromFood)}
                  </p>
                  <p className="text-sm text-gray-600">
                    About 20% of your total needs
                  </p>
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
                    <p>1. Base water intake: {results.weightInKg.toFixed(1)} kg × 33 ml/kg = {formatVolume(results.baseIntake)}</p>
                    
                    <p>2. Adjustments applied:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Age adjustment: {results.ageMultiplier.toFixed(2)}× ({age} years old)</li>
                      <li>Gender adjustment: {results.genderMultiplier.toFixed(2)}× ({gender})</li>
                      <li>Activity level adjustment: {results.activityMultiplier.toFixed(2)}× ({activityLevel.replace(/([A-Z])/g, ' $1').toLowerCase()})</li>
                      <li>Climate adjustment: {results.climateMultiplier.toFixed(2)}× ({climate.replace(/([A-Z])/g, ' $1').toLowerCase()})</li>
                    </ul>
                    
                    <p>3. Final calculation:</p>
                    <p>{formatVolume(results.baseIntake)} × {results.ageMultiplier.toFixed(2)} × {results.genderMultiplier.toFixed(2)} × {results.activityMultiplier.toFixed(2)} × {results.climateMultiplier.toFixed(2)} = {formatVolume(results.adjustedIntake)}</p>
                    
                    <p>4. Water from food (20%): {formatVolume(results.waterFromFood)}</p>
                    <p>5. Water to drink (80%): {formatVolume(results.waterToDrink)}</p>
                    <p>6. Number of 8 oz glasses: {formatVolume(results.glassesOfWater, 'glasses')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Water Intake</h2>
          <div className="space-y-2">
            <p>
              <strong>Proper hydration</strong> is essential for numerous bodily functions, including regulating body temperature, maintaining blood pressure, and removing waste.
            </p>
            <p>
              While the common advice to drink "8 glasses a day" is a good starting point, water needs vary significantly based on individual factors:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Body weight:</strong> Larger individuals generally need more water</li>
              <li><strong>Age:</strong> Children and teenagers need more water per kg of body weight than adults</li>
              <li><strong>Gender:</strong> Men typically need more water than women due to higher muscle mass</li>
              <li><strong>Activity level:</strong> More physical activity means more water loss through sweat</li>
              <li><strong>Climate:</strong> Hot or humid environments increase water loss</li>
              <li><strong>Health conditions:</strong> Some medical conditions or medications may affect water needs</li>
            </ul>
            <p>
              <strong>Signs of dehydration</strong> include dark urine, dry mouth, fatigue, headache, and dizziness.
            </p>
            <p>
              <strong>Note:</strong> About 20% of your water intake typically comes from food, especially fruits and vegetables. The calculator accounts for this in the final recommendation.
            </p>
            <p>
              This calculator provides a general guideline. Individual needs may vary, and you should consult with healthcare professionals for personalized advice, especially if you have health conditions.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default WaterIntakeCalculator;
