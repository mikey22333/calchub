import React, { useState } from 'react';
import { FaWeightHanging, FaRuler, FaCalculator, FaVenusMars } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const BodyFatCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [unit, setUnit] = useState('metric');
  const [method, setMethod] = useState('navy');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    if (!weight || !height || !neck || !waist || (gender === 'female' && !hip)) {
      setError('Please fill in all required fields');
      return;
    }

    // Parse values
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    const neckValue = parseFloat(neck);
    const waistValue = parseFloat(waist);
    const hipValue = gender === 'female' ? parseFloat(hip) : 0;
    const ageValue = age ? parseFloat(age) : 30; // Default age if not provided

    // Check for valid numbers
    if (isNaN(weightValue) || isNaN(heightValue) || isNaN(neckValue) || 
        isNaN(waistValue) || (gender === 'female' && isNaN(hipValue))) {
      setError('Please enter valid numbers for all measurements');
      return;
    }

    // Convert imperial to metric if needed
    let weightKg = weightValue;
    let heightCm = heightValue;
    let neckCm = neckValue;
    let waistCm = waistValue;
    let hipCm = hipValue;

    if (unit === 'imperial') {
      // Convert pounds to kg
      weightKg = weightValue * 0.453592;
      // Convert inches to cm
      heightCm = heightValue * 2.54;
      neckCm = neckValue * 2.54;
      waistCm = waistValue * 2.54;
      hipCm = hipValue * 2.54;
    }

    let bodyFatPercentage;
    let leanMass;
    let fatMass;
    let category;
    let bmi;

    // Calculate BMI
    bmi = weightKg / Math.pow(heightCm / 100, 2);

    if (method === 'navy') {
      // U.S. Navy Method
      if (gender === 'male') {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
      } else {
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
      }
    } else if (method === 'bmi') {
      // BMI Method (less accurate)
      if (gender === 'male') {
        bodyFatPercentage = (1.20 * bmi) + (0.23 * ageValue) - (10.8 * 1) - 5.4;
      } else {
        bodyFatPercentage = (1.20 * bmi) + (0.23 * ageValue) - (10.8 * 0) - 5.4;
      }
    }

    // Ensure body fat percentage is within reasonable limits
    bodyFatPercentage = Math.max(3, Math.min(bodyFatPercentage, 70));

    // Calculate lean mass and fat mass
    fatMass = (bodyFatPercentage / 100) * weightKg;
    leanMass = weightKg - fatMass;

    // Determine category
    if (gender === 'male') {
      if (bodyFatPercentage < 6) category = 'Essential Fat';
      else if (bodyFatPercentage < 14) category = 'Athletic';
      else if (bodyFatPercentage < 18) category = 'Fitness';
      else if (bodyFatPercentage < 25) category = 'Average';
      else category = 'Obese';
    } else {
      if (bodyFatPercentage < 14) category = 'Essential Fat';
      else if (bodyFatPercentage < 21) category = 'Athletic';
      else if (bodyFatPercentage < 25) category = 'Fitness';
      else if (bodyFatPercentage < 32) category = 'Average';
      else category = 'Obese';
    }

    // Set results
    setResults({
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      leanMass: leanMass.toFixed(1),
      fatMass: fatMass.toFixed(1),
      category,
      bmi: bmi.toFixed(1)
    });
  };

  const handleReset = () => {
    setGender('male');
    setAge('');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
    setUnit('metric');
    setMethod('navy');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Body Fat Calculator"
        description="Calculate your body fat percentage using the U.S. Navy method or BMI method."
        keywords="body fat calculator, body fat percentage, navy method, lean mass, fat mass"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Body Fat Calculator</h1>
        <p className="calculator-description">
          Calculate your body fat percentage, lean mass, and fat mass using different methods.
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

          <div className="flex space-x-4 mb-4">
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

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMethod('navy')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                method === 'navy'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Navy Method
            </button>
            <button
              onClick={() => setMethod('bmi')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                method === 'bmi'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              BMI Method
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <div>
              <label htmlFor="neck" className="block text-sm font-medium text-gray-700 mb-1">
                Neck Circumference ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                id="neck"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={unit === 'metric' ? 'e.g., 36' : 'e.g., 14'}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">
                Waist Circumference ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                id="waist"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={unit === 'metric' ? 'e.g., 85' : 'e.g., 33'}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {gender === 'female' && (
            <div className="mb-6">
              <label htmlFor="hip" className="block text-sm font-medium text-gray-700 mb-1">
                Hip Circumference ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                id="hip"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={unit === 'metric' ? 'e.g., 90' : 'e.g., 35'}
                min="0"
                step="0.1"
              />
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
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaCalculator className="mr-2" /> Calculate Body Fat
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
              <FaWeightHanging className="mr-2 text-primary-600" /> Body Composition Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Body Fat Percentage</h4>
                <p className="text-lg font-semibold">{results.bodyFatPercentage}%</p>
                <p className="text-xs text-gray-500 mt-1">Category: {results.category}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fat Mass</h4>
                <p className="text-lg font-semibold">{results.fatMass} kg</p>
                <p className="text-xs text-gray-500 mt-1">Weight from body fat</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Lean Body Mass</h4>
                <p className="text-lg font-semibold">{results.leanMass} kg</p>
                <p className="text-xs text-gray-500 mt-1">Weight from muscle, bone, organs, etc.</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Body Mass Index (BMI)</h4>
              <p className="text-lg font-semibold">{results.bmi}</p>
              <p className="text-xs text-gray-500 mt-1">
                {results.bmi < 18.5 ? 'Underweight' : 
                 results.bmi < 25 ? 'Normal weight' : 
                 results.bmi < 30 ? 'Overweight' : 'Obese'}
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p className="font-medium mb-1">Note:</p>
              <p>
                The {method === 'navy' ? 'U.S. Navy' : 'BMI'} method provides an estimate of body fat percentage. 
                For the most accurate results, consider methods like DEXA scans or hydrostatic weighing.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Body Fat Percentage Categories</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Men</th>
                  <th className="py-2 px-4 border-b">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Essential Fat</td>
                  <td className="py-2 px-4 border-b">2-5%</td>
                  <td className="py-2 px-4 border-b">10-13%</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Athletic</td>
                  <td className="py-2 px-4 border-b">6-13%</td>
                  <td className="py-2 px-4 border-b">14-20%</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Fitness</td>
                  <td className="py-2 px-4 border-b">14-17%</td>
                  <td className="py-2 px-4 border-b">21-24%</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Average</td>
                  <td className="py-2 px-4 border-b">18-24%</td>
                  <td className="py-2 px-4 border-b">25-31%</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Obese</td>
                  <td className="py-2 px-4 border-b">25%+</td>
                  <td className="py-2 px-4 border-b">32%+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Measure</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Neck:</strong> Measure around the middle of your neck, below the larynx (Adam's apple).
            </li>
            <li>
              <strong>Waist:</strong> Measure at the narrowest point of your waist, usually just above the belly button.
            </li>
            <li>
              <strong>Hips (women only):</strong> Measure at the widest part of your hips/buttocks.
            </li>
          </ul>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default BodyFatCalculator;
