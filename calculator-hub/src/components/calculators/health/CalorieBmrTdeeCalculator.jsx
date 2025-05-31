import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaRunning, FaUtensils } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CalorieBmrTdeeCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [unit, setUnit] = useState('metric');
  const [formula, setFormula] = useState('mifflin');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setResults(null);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
    setResults(null);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    setResults(null);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
    setResults(null);
  };

  const handleActivityLevelChange = (e) => {
    setActivityLevel(e.target.value);
    setResults(null);
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit !== unit) {
      setUnit(newUnit);
      setResults(null);
    }
  };

  const handleFormulaChange = (e) => {
    setFormula(e.target.value);
    setResults(null);
  };

  const handleGoalChange = (e) => {
    setGoal(e.target.value);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0) {
      setError('Please enter a valid age');
      return false;
    }
    
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      setError('Please enter a valid weight');
      return false;
    }
    
    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      setError('Please enter a valid height');
      return false;
    }
    
    // Additional validation for reasonable age values
    const ageValue = parseInt(age);
    if (ageValue < 15 || ageValue > 100) {
      setError('Please enter a reasonable age (15-100 years)');
      return false;
    }
    
    // Additional validation for reasonable weight values
    const weightValue = parseFloat(weight);
    if (unit === 'metric' && (weightValue < 30 || weightValue > 300)) {
      setError('Please enter a reasonable weight (30-300 kg)');
      return false;
    } else if (unit === 'imperial' && (weightValue < 66 || weightValue > 660)) {
      setError('Please enter a reasonable weight (66-660 lbs)');
      return false;
    }
    
    // Additional validation for reasonable height values
    const heightValue = parseFloat(height);
    if (unit === 'metric' && (heightValue < 100 || heightValue > 250)) {
      setError('Please enter a reasonable height (100-250 cm)');
      return false;
    } else if (unit === 'imperial' && (heightValue < 39 || heightValue > 98)) {
      setError('Please enter a reasonable height (39-98 inches)');
      return false;
    }
    
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    // Convert imperial to metric if needed
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);
    
    if (unit === 'imperial') {
      // Convert pounds to kg
      weightKg = weightKg * 0.453592;
      // Convert inches to cm
      heightCm = heightCm * 2.54;
    }
    
    const ageValue = parseInt(age);
    
    // Calculate BMR using different formulas
    let bmr;
    
    if (formula === 'mifflin') {
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageValue) + 5;
      } else {
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageValue) - 161;
      }
    } else if (formula === 'harris') {
      // Harris-Benedict Equation (Revised)
      if (gender === 'male') {
        bmr = (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageValue) + 88.362;
      } else {
        bmr = (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageValue) + 447.593;
      }
    } else if (formula === 'katch') {
      // Katch-McArdle Formula (requires body fat percentage, using estimate)
      // Estimate body fat percentage using BMI
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      let bodyFatPercentage;
      
      if (gender === 'male') {
        bodyFatPercentage = (1.20 * bmi) + (0.23 * ageValue) - 16.2;
      } else {
        bodyFatPercentage = (1.20 * bmi) + (0.23 * ageValue) - 5.4;
      }
      
      // Ensure body fat percentage is within reasonable limits
      bodyFatPercentage = Math.max(5, Math.min(bodyFatPercentage, 50));
      
      // Calculate lean body mass
      const leanBodyMass = weightKg * (1 - (bodyFatPercentage / 100));
      
      // Katch-McArdle Formula
      bmr = 370 + (21.6 * leanBodyMass);
    }
    
    // Calculate TDEE based on activity level
    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'veryActive':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.55;
    }
    
    const tdee = bmr * activityMultiplier;
    
    // Calculate calories based on goal
    let goalCalories;
    let goalDescription;
    
    switch (goal) {
      case 'lose':
        goalCalories = tdee - 500; // 500 calorie deficit for weight loss
        goalDescription = 'Weight Loss (0.5 kg/week)';
        break;
      case 'loseFast':
        goalCalories = tdee - 1000; // 1000 calorie deficit for faster weight loss
        goalDescription = 'Fast Weight Loss (1 kg/week)';
        break;
      case 'maintain':
        goalCalories = tdee;
        goalDescription = 'Weight Maintenance';
        break;
      case 'gain':
        goalCalories = tdee + 500; // 500 calorie surplus for weight gain
        goalDescription = 'Weight Gain (0.5 kg/week)';
        break;
      case 'gainFast':
        goalCalories = tdee + 1000; // 1000 calorie surplus for faster weight gain
        goalDescription = 'Fast Weight Gain (1 kg/week)';
        break;
      default:
        goalCalories = tdee;
        goalDescription = 'Weight Maintenance';
    }
    
    // Calculate macronutrient distribution (standard balanced diet)
    // Protein: 30%, Carbs: 40%, Fat: 30%
    const protein = (goalCalories * 0.3) / 4; // 4 calories per gram of protein
    const carbs = (goalCalories * 0.4) / 4; // 4 calories per gram of carbs
    const fat = (goalCalories * 0.3) / 9; // 9 calories per gram of fat
    
    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      goalDescription,
      macros: {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
      },
      activityMultiplier,
      formula,
      weightKg,
      heightCm
    });
  };

  const handleReset = () => {
    setGender('male');
    setAge('');
    setWeight('');
    setHeight('');
    setActivityLevel('moderate');
    setUnit('metric');
    setFormula('mifflin');
    setGoal('maintain');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  return (
    <>
      <SEO
        title="Calorie, BMR & TDEE Calculator"
        description="Calculate your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and daily calorie needs based on your goals."
        keywords="calorie calculator, BMR calculator, TDEE calculator, metabolism calculator, daily calorie needs, macronutrients"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Calorie, BMR & TDEE Calculator</h1>
        <p className="calculator-description">
          Calculate your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and daily calorie needs based on your goals.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaUtensils className="mr-2 text-primary-500" /> 
              Personal Information
            </h2>

            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleUnitChange('metric')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                  unit === 'metric'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => handleUnitChange('imperial')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                  unit === 'imperial'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Imperial (lb/in)
              </button>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  placeholder="Years"
                  min="15"
                  max="100"
                  step="1"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={handleWeightChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder={unit === 'metric' ? 'kg' : 'lbs'}
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={handleHeightChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder={unit === 'metric' ? 'cm' : 'in'}
                  min="0"
                  step="0.1"
                />
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
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Light (Light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (Moderate exercise 3-5 days/week)</option>
                <option value="active">Active (Hard exercise 6-7 days/week)</option>
                <option value="veryActive">Very Active (Hard daily exercise & physical job or 2x training)</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="formula" className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Formula
              </label>
              <select
                id="formula"
                value={formula}
                onChange={handleFormulaChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
                <option value="harris">Harris-Benedict</option>
                <option value="katch">Katch-McArdle</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Mifflin-St Jeor is considered the most accurate for most people.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Goal
              </label>
              <select
                id="goal"
                value={goal}
                onChange={handleGoalChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="loseFast">Lose Weight Fast (1 kg/week)</option>
                <option value="lose">Lose Weight (0.5 kg/week)</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight (0.5 kg/week)</option>
                <option value="gainFast">Gain Weight Fast (1 kg/week)</option>
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
                  Daily Calorie Needs for {results.goalDescription}
                </h3>
                <p className="text-2xl font-bold text-primary-600">
                  {results.goalCalories} calories/day
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Basal Metabolic Rate (BMR)
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {results.bmr} calories/day
                  </p>
                  <p className="text-sm text-gray-600">
                    Calories your body needs at complete rest
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Daily Energy Expenditure (TDEE)
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {results.tdee} calories/day
                  </p>
                  <p className="text-sm text-gray-600">
                    Total calories burned per day with activity
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Recommended Macronutrients
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Protein</p>
                    <p className="text-lg font-bold text-blue-600">{results.macros.protein}g</p>
                    <p className="text-xs text-gray-500">{Math.round(results.macros.protein * 4)} cal</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Carbs</p>
                    <p className="text-lg font-bold text-green-600">{results.macros.carbs}g</p>
                    <p className="text-xs text-gray-500">{Math.round(results.macros.carbs * 4)} cal</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="text-sm font-medium text-gray-700">Fat</p>
                    <p className="text-lg font-bold text-yellow-600">{results.macros.fat}g</p>
                    <p className="text-xs text-gray-500">{Math.round(results.macros.fat * 9)} cal</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Based on a balanced diet (30% protein, 40% carbs, 30% fat)
                </p>
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
                    <p><strong>Your measurements:</strong> {results.weightKg.toFixed(1)} kg, {results.heightCm.toFixed(1)} cm</p>
                    
                    <p><strong>BMR Calculation ({results.formula}):</strong></p>
                    {results.formula === 'mifflin' && (
                      <p className="pl-4">
                        {gender === 'male' 
                          ? `(10 × ${results.weightKg.toFixed(1)}) + (6.25 × ${results.heightCm.toFixed(1)}) - (5 × ${age}) + 5 = ${results.bmr} calories/day`
                          : `(10 × ${results.weightKg.toFixed(1)}) + (6.25 × ${results.heightCm.toFixed(1)}) - (5 × ${age}) - 161 = ${results.bmr} calories/day`
                        }
                      </p>
                    )}
                    {results.formula === 'harris' && (
                      <p className="pl-4">
                        {gender === 'male' 
                          ? `(13.397 × ${results.weightKg.toFixed(1)}) + (4.799 × ${results.heightCm.toFixed(1)}) - (5.677 × ${age}) + 88.362 = ${results.bmr} calories/day`
                          : `(9.247 × ${results.weightKg.toFixed(1)}) + (3.098 × ${results.heightCm.toFixed(1)}) - (4.330 × ${age}) + 447.593 = ${results.bmr} calories/day`
                        }
                      </p>
                    )}
                    {results.formula === 'katch' && (
                      <p className="pl-4">
                        Katch-McArdle: 370 + (21.6 × Lean Body Mass) = {results.bmr} calories/day
                      </p>
                    )}
                    
                    <p><strong>TDEE Calculation:</strong></p>
                    <p className="pl-4">
                      BMR × Activity Multiplier = {results.bmr} × {results.activityMultiplier.toFixed(2)} = {results.tdee} calories/day
                    </p>
                    
                    <p><strong>Goal Calorie Adjustment:</strong></p>
                    {goal === 'maintain' && (
                      <p className="pl-4">
                        Maintenance: TDEE = {results.tdee} calories/day
                      </p>
                    )}
                    {goal === 'lose' && (
                      <p className="pl-4">
                        Weight Loss: TDEE - 500 = {results.tdee} - 500 = {results.goalCalories} calories/day
                      </p>
                    )}
                    {goal === 'loseFast' && (
                      <p className="pl-4">
                        Fast Weight Loss: TDEE - 1000 = {results.tdee} - 1000 = {results.goalCalories} calories/day
                      </p>
                    )}
                    {goal === 'gain' && (
                      <p className="pl-4">
                        Weight Gain: TDEE + 500 = {results.tdee} + 500 = {results.goalCalories} calories/day
                      </p>
                    )}
                    {goal === 'gainFast' && (
                      <p className="pl-4">
                        Fast Weight Gain: TDEE + 1000 = {results.tdee} + 1000 = {results.goalCalories} calories/day
                      </p>
                    )}
                    
                    <p><strong>Macronutrient Calculation:</strong></p>
                    <p className="pl-4">
                      Protein: 30% of {results.goalCalories} calories = {Math.round(results.goalCalories * 0.3)} calories ÷ 4 calories/g = {results.macros.protein}g
                    </p>
                    <p className="pl-4">
                      Carbs: 40% of {results.goalCalories} calories = {Math.round(results.goalCalories * 0.4)} calories ÷ 4 calories/g = {results.macros.carbs}g
                    </p>
                    <p className="pl-4">
                      Fat: 30% of {results.goalCalories} calories = {Math.round(results.goalCalories * 0.3)} calories ÷ 9 calories/g = {results.macros.fat}g
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About BMR, TDEE, and Calorie Needs</h2>
          <div className="space-y-2">
            <p>
              <strong>Basal Metabolic Rate (BMR)</strong> is the number of calories your body needs to maintain basic physiological functions while at complete rest. This includes breathing, circulation, cell production, and basic neurological functions.
            </p>
            
            <p>
              <strong>Total Daily Energy Expenditure (TDEE)</strong> is the total number of calories you burn in a day, including your BMR plus additional calories burned through physical activity and digestion.
            </p>
            
            <p>
              <strong>Calculation formulas:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Mifflin-St Jeor:</strong> Considered the most accurate for most people. Developed in 1990.</li>
              <li><strong>Harris-Benedict:</strong> One of the earliest formulas (1919), revised in 1984.</li>
              <li><strong>Katch-McArdle:</strong> Takes into account lean body mass, potentially more accurate for athletic individuals with low body fat.</li>
            </ul>
            
            <p>
              <strong>Weight management principles:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To maintain weight: Consume calories equal to your TDEE</li>
              <li>To lose weight: Create a calorie deficit (consume fewer calories than your TDEE)</li>
              <li>To gain weight: Create a calorie surplus (consume more calories than your TDEE)</li>
            </ul>
            
            <p>
              <strong>Note:</strong> A deficit or surplus of approximately 3,500 calories equals about 1 pound (0.45 kg) of fat loss or gain. A daily deficit/surplus of 500 calories would result in about 1 pound per week change.
            </p>
            
            <p>
              This calculator provides estimates based on statistical formulas. Individual metabolism can vary based on genetics, body composition, hormone levels, and other factors. For personalized nutrition advice, consult with a registered dietitian or healthcare provider.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CalorieBmrTdeeCalculator;
