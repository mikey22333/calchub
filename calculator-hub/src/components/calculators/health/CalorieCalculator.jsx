import React, { useState } from 'react';
import { FaFire, FaRedo, FaRunning, FaWeight } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain',
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');

  const activityLevels = {
    sedentary: { label: 'Sedentary (little or no exercise)', factor: 1.2 },
    light: { label: 'Lightly active (light exercise 1-3 days/week)', factor: 1.375 },
    moderate: { label: 'Moderately active (moderate exercise 3-5 days/week)', factor: 1.55 },
    active: { label: 'Very active (hard exercise 6-7 days/week)', factor: 1.725 },
    extreme: { label: 'Extremely active (very hard exercise, physical job or training twice a day)', factor: 1.9 }
  };

  const goals = {
    lose_fast: { label: 'Lose weight fast (1kg/week)', factor: 0.8 },
    lose: { label: 'Lose weight (0.5kg/week)', factor: 0.9 },
    maintain: { label: 'Maintain weight', factor: 1.0 },
    gain: { label: 'Gain weight (0.5kg/week)', factor: 1.1 },
    gain_fast: { label: 'Gain weight fast (1kg/week)', factor: 1.2 }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setResults(null);
  };

  const handleUnitChange = (unit, type) => {
    if (type === 'weight') {
      setWeightUnit(unit);
    } else if (type === 'height') {
      setHeightUnit(unit);
    }
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    const { age, weight, height } = formData;
    
    if (!age || !weight || !height) {
      setError('Please fill in all required fields');
      return false;
    }
    
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('Please enter a valid age between 1 and 120');
      return false;
    }
    
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight');
      return false;
    }
    
    if (isNaN(heightNum) || heightNum <= 0) {
      setError('Please enter a valid height');
      return false;
    }
    
    return true;
  };

  const calculateCalories = () => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }
    
    const { age, gender, weight, height, activityLevel, goal } = formData;
    
    // Convert units if needed
    let weightKg = Number(weight);
    let heightCm = Number(height);
    
    if (weightUnit === 'lb') {
      weightKg = weightKg * 0.453592; // Convert pounds to kg
    }
    
    if (heightUnit === 'ft') {
      heightCm = heightCm * 30.48; // Convert feet to cm
    } else if (heightUnit === 'in') {
      heightCm = heightCm * 2.54; // Convert inches to cm
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * Number(age) + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * Number(age) - 161;
    }
    
    // Apply activity factor
    const tdee = bmr * activityLevels[activityLevel].factor;
    
    // Apply goal factor
    const goalCalories = tdee * goals[goal].factor;
    
    // Calculate macronutrients (simplified approach)
    let protein, carbs, fats;
    
    if (goal === 'lose_fast' || goal === 'lose') {
      // Higher protein, lower carbs for weight loss
      protein = weightKg * 2.2; // 2.2g per kg of body weight
      fats = weightKg * 0.8; // 0.8g per kg of body weight
      carbs = (goalCalories - (protein * 4 + fats * 9)) / 4;
    } else if (goal === 'gain' || goal === 'gain_fast') {
      // Higher carbs for weight gain
      protein = weightKg * 1.8; // 1.8g per kg of body weight
      fats = weightKg * 1; // 1g per kg of body weight
      carbs = (goalCalories - (protein * 4 + fats * 9)) / 4;
    } else {
      // Balanced for maintenance
      protein = weightKg * 1.6; // 1.6g per kg of body weight
      fats = weightKg * 0.9; // 0.9g per kg of body weight
      carbs = (goalCalories - (protein * 4 + fats * 9)) / 4;
    }
    
    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    });
  };

  const handleReset = () => {
    setFormData({
      age: '',
      gender: 'male',
      weight: '',
      height: '',
      activityLevel: 'moderate',
      goal: 'maintain',
    });
    setWeightUnit('kg');
    setHeightUnit('cm');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Calorie Calculator"
        description="Calculate your daily calorie needs based on your age, gender, weight, height, and activity level."
        keywords="calorie calculator, daily calories, TDEE calculator, BMR calculator, macronutrients, nutrition calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Calorie Calculator</h1>
        <p className="calculator-description">
          Calculate your daily calorie needs and macronutrient breakdown based on your body metrics and goals.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaWeight className="mr-2 text-primary-500" /> Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age (years) *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight *
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder={`Enter weight in ${weightUnit}`}
                    min="1"
                    step="0.1"
                  />
                  <div className="inline-flex">
                    <button
                      type="button"
                      className={`px-3 py-2 border border-gray-300 ${weightUnit === 'kg' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700'}`}
                      onClick={() => handleUnitChange('kg', 'weight')}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-2 border border-l-0 border-gray-300 rounded-r-md ${weightUnit === 'lb' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700'}`}
                      onClick={() => handleUnitChange('lb', 'weight')}
                    >
                      lb
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height *
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder={`Enter height in ${heightUnit}`}
                    min="1"
                    step="0.1"
                  />
                  <div className="inline-flex">
                    <button
                      type="button"
                      className={`px-3 py-2 border border-gray-300 ${heightUnit === 'cm' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700'}`}
                      onClick={() => handleUnitChange('cm', 'height')}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-2 border border-l-0 border-gray-300 ${heightUnit === 'ft' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700'}`}
                      onClick={() => handleUnitChange('ft', 'height')}
                    >
                      ft
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-2 border border-l-0 border-gray-300 rounded-r-md ${heightUnit === 'in' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700'}`}
                      onClick={() => handleUnitChange('in', 'height')}
                    >
                      in
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level *
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(activityLevels).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Goal *
              </label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(goals).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculateCalories}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Calculate Calories
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
              <h2 className="text-lg font-semibold mb-2">Your Calorie Results:</h2>
              
              <div className="bg-white p-4 rounded border border-gray-300 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">BMR</h3>
                    <div className="text-3xl font-bold text-primary-600">{results.bmr}</div>
                    <p className="text-xs text-gray-500 mt-1">calories/day</p>
                  </div>
                  
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">TDEE</h3>
                    <div className="text-3xl font-bold text-secondary-600">{results.tdee}</div>
                    <p className="text-xs text-gray-500 mt-1">calories/day</p>
                  </div>
                  
                  <div className="text-center p-4 bg-accent-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Goal Calories</h3>
                    <div className="text-3xl font-bold text-accent-600">{results.goalCalories}</div>
                    <p className="text-xs text-gray-500 mt-1">calories/day</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Recommended Macronutrients:</h3>
              <div className="bg-white p-4 rounded border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Protein</h4>
                    <p className="text-lg font-semibold">{results.protein}g</p>
                    <p className="text-sm text-gray-600">{Math.round(results.protein * 4)} calories</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Carbohydrates</h4>
                    <p className="text-lg font-semibold">{results.carbs}g</p>
                    <p className="text-sm text-gray-600">{Math.round(results.carbs * 4)} calories</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Fats</h4>
                    <p className="text-lg font-semibold">{results.fats}g</p>
                    <p className="text-sm text-gray-600">{Math.round(results.fats * 9)} calories</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Understanding Calorie Calculations</h2>
          <div className="space-y-2">
            <p>
              This calculator uses the Mifflin-St Jeor Equation to estimate your daily calorie needs:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>BMR (Basal Metabolic Rate):</strong> The calories your body needs at complete rest</li>
              <li><strong>TDEE (Total Daily Energy Expenditure):</strong> BMR adjusted for your activity level</li>
              <li><strong>Goal Calories:</strong> TDEE adjusted based on whether you want to lose, maintain, or gain weight</li>
            </ul>
            <p className="mt-2">
              The macronutrient breakdown is calculated based on your weight and goals, following general nutrition guidelines.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Note: These are estimates and individual needs may vary. Consult with a healthcare professional for personalized advice.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CalorieCalculator;
