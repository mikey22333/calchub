import { useState, useEffect } from 'react';
import AdBanner from '../../../components/layout/AdBanner';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric'); // metric or imperial
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const calculateBMI = () => {
    if (!height || !weight) return;

    let bmiValue;
    if (unit === 'metric') {
      // Metric: weight (kg) / height^2 (m)
      const heightInMeters = height / 100;
      bmiValue = weight / (heightInMeters * heightInMeters);
    } else {
      // Imperial: (weight (lbs) * 703) / height^2 (inches)
      bmiValue = (weight * 703) / (height * height);
    }

    setBmi(bmiValue.toFixed(1));
    
    // Determine BMI category
    if (bmiValue < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setBmiCategory('Normal weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obesity');
    }
  };

  // Calculate BMI whenever inputs change
  useEffect(() => {
    if (height && weight) {
      calculateBMI();
    }
  }, [height, weight, unit]);

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">BMI Calculator</h1>
      <p className="calculator-description">
        Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. 
        Use this calculator to check your BMI and determine if you're underweight, normal weight, overweight, or obese.
      </p>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`btn-secondary ${unit === 'metric' ? 'bg-primary-600 text-white' : ''}`}
            onClick={() => setUnit('metric')}
          >
            Metric (cm, kg)
          </button>
          <button
            className={`btn-secondary ${unit === 'imperial' ? 'bg-primary-600 text-white' : ''}`}
            onClick={() => setUnit('imperial')}
          >
            Imperial (in, lbs)
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="height" className="input-label">
            Height {unit === 'metric' ? '(cm)' : '(inches)'}
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-field"
            placeholder={unit === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
            min="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="weight" className="input-label">
            Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-field"
            placeholder={unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
            min="0"
          />
        </div>

        <div className="flex space-x-4 mt-6">
          <button className="btn-primary" onClick={calculateBMI}>
            Calculate BMI
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <AdBanner position="middle" />

      {bmi && (
        <div className="result-container">
          <h2 className="text-xl font-semibold mb-2">Your Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Your BMI</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{bmi}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{bmiCategory}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">BMI Categories</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Underweight: BMI less than 18.5</li>
              <li>Normal weight: BMI 18.5 to 24.9</li>
              <li>Overweight: BMI 25 to 29.9</li>
              <li>Obesity: BMI 30 or greater</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
