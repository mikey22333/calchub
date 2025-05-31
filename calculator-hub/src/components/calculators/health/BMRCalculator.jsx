import React, { useState } from 'react';
import { FaHeartbeat, FaCalculator, FaFire } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const BMRCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [unit, setUnit] = useState('metric');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const activityLevels = [
    { id: 'sedentary', name: 'Sedentary (little or no exercise)', factor: 1.2 },
    { id: 'light', name: 'Lightly active (light exercise 1-3 days/week)', factor: 1.375 },
    { id: 'moderate', name: 'Moderately active (moderate exercise 3-5 days/week)', factor: 1.55 },
    { id: 'active', name: 'Very active (hard exercise 6-7 days/week)', factor: 1.725 },
    { id: 'extra', name: 'Extra active (very hard exercise & physical job)', factor: 1.9 }
  ];

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    if (!age || !weight || !height) {
      setError('Please fill in all required fields');
      return;
    }

    const ageValue = parseFloat(age);
    let weightValue = parseFloat(weight);
    let heightValue = parseFloat(height);

    if (isNaN(ageValue) || isNaN(weightValue) || isNaN(heightValue)) {
      setError('Please enter valid numbers for all fields');
      return;
    }

    if (ageValue <= 0 || weightValue <= 0 || heightValue <= 0) {
      setError('All values must be greater than zero');
      return;
    }

    // Convert imperial to metric if needed
    if (unit === 'imperial') {
      // Convert pounds to kg
      weightValue = weightValue * 0.453592;
      // Convert inches to cm
      heightValue = heightValue * 2.54;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightValue + 6.25 * heightValue - 5 * ageValue + 5;
    } else {
      bmr = 10 * weightValue + 6.25 * heightValue - 5 * ageValue - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const activityFactor = activityLevels.find(level => level.id === activityLevel).factor;
    const tdee = bmr * activityFactor;

    // Calculate macronutrient recommendations
    // Protein: 1.6g per kg of bodyweight for active individuals
    const protein = weightValue * 1.6;
    // Fat: 25% of total calories
    const fat = (tdee * 0.25) / 9; // 9 calories per gram of fat
    // Carbs: remaining calories
    const carbs = (tdee - (protein * 4) - (fat * 9)) / 4; // 4 calories per gram of protein/carbs

    // Calculate calorie goals for weight management
    const weightLoss = tdee - 500; // 500 calorie deficit
    const weightGain = tdee + 500; // 500 calorie surplus

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(weightLoss),
      weightGain: Math.round(weightGain),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs)
    });
  };

  const handleReset = () => {
    setGender('male');
    setAge('');
    setWeight('');
    setHeight('');
    setActivityLevel('sedentary');
    setUnit('metric');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO 
        title="BMR Calculator" 
        description="Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on your activity level."
        keywords="BMR calculator, basal metabolic rate, calorie calculator, TDEE calculator, daily energy expenditure"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">BMR Calculator</h1>
        <p className="calculator-description">
          Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to determine your daily calorie needs.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setUnit('metric')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                unit === 'metric'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                unit === 'imperial'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Imperial (lb/in)
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                gender === 'male'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                gender === 'female'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Female
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age (years)
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 30"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight ({unit === 'metric' ? 'kg' : 'lb'})
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={unit === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Activity Level
            </label>
            <select
              id="activityLevel"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {activityLevels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaCalculator className="mr-2" /> Calculate BMR
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            Reset
          </button>
        </div>

        {results && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaHeartbeat className="mr-2 text-primary-600" /> BMR Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Basal Metabolic Rate (BMR)</h4>
                <p className="text-lg font-semibold">{results.bmr} calories/day</p>
                <p className="text-xs text-gray-500 mt-1">Calories needed for basic functions at rest</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Daily Energy Expenditure</h4>
                <p className="text-lg font-semibold">{results.tdee} calories/day</p>
                <p className="text-xs text-gray-500 mt-1">Calories needed to maintain current weight</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Activity Level</h4>
                <p className="text-lg font-semibold capitalize">{activityLevel}</p>
                <p className="text-xs text-gray-500 mt-1">Factor: {activityLevels.find(level => level.id === activityLevel).factor}</p>
              </div>
            </div>
            
            <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
              <FaFire className="mr-2 text-primary-600" /> Daily Calorie Goals
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Weight Loss</h4>
                <p className="text-lg font-semibold">{results.weightLoss} calories/day</p>
                <p className="text-xs text-gray-500 mt-1">500 calorie deficit</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Maintenance</h4>
                <p className="text-lg font-semibold">{results.tdee} calories/day</p>
                <p className="text-xs text-gray-500 mt-1">Maintain current weight</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Weight Gain</h4>
                <p className="text-lg font-semibold">{results.weightGain} calories/day</p>
                <p className="text-xs text-gray-500 mt-1">500 calorie surplus</p>
              </div>
            </div>
            
            <h4 className="text-md font-semibold text-gray-700 mb-3">Recommended Macronutrients</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Protein</h4>
                <p className="text-lg font-semibold">{results.protein}g</p>
                <p className="text-xs text-gray-500 mt-1">{results.protein * 4} calories</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fat</h4>
                <p className="text-lg font-semibold">{results.fat}g</p>
                <p className="text-xs text-gray-500 mt-1">{results.fat * 9} calories</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Carbohydrates</h4>
                <p className="text-lg font-semibold">{results.carbs}g</p>
                <p className="text-xs text-gray-500 mt-1">{results.carbs * 4} calories</p>
              </div>
            </div>
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default BMRCalculator;
