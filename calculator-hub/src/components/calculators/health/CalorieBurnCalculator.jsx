import React, { useState } from 'react';
import { FaFire, FaRunning, FaWeight, FaCalculator } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CalorieBurnCalculator = () => {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [unit, setUnit] = useState('metric');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // MET values for different activities
  // MET = Metabolic Equivalent of Task
  // 1 MET = 1 kcal/kg/hour (energy expenditure at rest)
  const activities = [
    { id: 'walking', name: 'Walking (3 mph)', met: 3.5 },
    { id: 'jogging', name: 'Jogging (5 mph)', met: 8.0 },
    { id: 'running', name: 'Running (7.5 mph)', met: 12.5 },
    { id: 'cycling_light', name: 'Cycling (light effort)', met: 4.0 },
    { id: 'cycling_moderate', name: 'Cycling (moderate effort)', met: 8.0 },
    { id: 'cycling_vigorous', name: 'Cycling (vigorous effort)', met: 12.0 },
    { id: 'swimming_light', name: 'Swimming (light effort)', met: 6.0 },
    { id: 'swimming_vigorous', name: 'Swimming (vigorous effort)', met: 10.0 },
    { id: 'hiking', name: 'Hiking', met: 6.0 },
    { id: 'dancing', name: 'Dancing', met: 4.8 },
    { id: 'weightlifting', name: 'Weight lifting (general)', met: 5.0 },
    { id: 'yoga', name: 'Yoga', met: 3.0 },
    { id: 'pilates', name: 'Pilates', met: 3.5 },
    { id: 'basketball', name: 'Basketball', met: 8.0 },
    { id: 'soccer', name: 'Soccer', met: 10.0 },
    { id: 'tennis', name: 'Tennis', met: 8.0 },
    { id: 'gardening', name: 'Gardening', met: 4.0 },
    { id: 'housework', name: 'Housework', met: 3.5 },
    { id: 'stairs', name: 'Stair climbing', met: 8.0 },
    { id: 'elliptical', name: 'Elliptical trainer', met: 5.0 },
    { id: 'rowing', name: 'Rowing machine', met: 7.0 },
    { id: 'jump_rope', name: 'Jump rope', met: 12.0 },
    { id: 'aerobics', name: 'Aerobics', met: 7.0 },
    { id: 'zumba', name: 'Zumba', met: 7.5 }
  ];

  // Group activities by type for better organization
  const activityGroups = {
    'Cardio': ['walking', 'jogging', 'running', 'cycling_light', 'cycling_moderate', 'cycling_vigorous', 'elliptical', 'rowing', 'jump_rope', 'stairs'],
    'Sports': ['basketball', 'soccer', 'tennis', 'swimming_light', 'swimming_vigorous'],
    'Fitness': ['weightlifting', 'yoga', 'pilates', 'aerobics', 'zumba', 'dancing'],
    'Everyday Activities': ['gardening', 'housework', 'hiking']
  };

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    if (!weight || !activity || !duration) {
      setError('Please fill in all required fields');
      return;
    }

    const weightValue = parseFloat(weight);
    const durationValue = parseFloat(duration);

    if (isNaN(weightValue) || isNaN(durationValue)) {
      setError('Please enter valid numbers for weight and duration');
      return;
    }

    if (weightValue <= 0 || durationValue <= 0) {
      setError('Weight and duration must be greater than zero');
      return;
    }

    // Convert weight to kg if in imperial units
    const weightInKg = unit === 'imperial' ? weightValue * 0.453592 : weightValue;

    // Find the selected activity
    const selectedActivity = activities.find(act => act.id === activity);
    if (!selectedActivity) {
      setError('Please select a valid activity');
      return;
    }

    // Calculate calories burned
    // Formula: Calories Burned = MET × Weight (kg) × Duration (hours)
    const durationInHours = durationValue / 60; // Convert minutes to hours
    const caloriesBurned = selectedActivity.met * weightInKg * durationInHours;

    // Calculate additional information
    const fatBurned = caloriesBurned / 7700; // Approximately 7700 calories = 1 kg of fat
    const proteinNeeded = weightInKg * 1.6; // 1.6g protein per kg of body weight for active individuals
    const waterNeeded = weightInKg * 0.03 + (durationInHours * 0.7); // Base water + extra for exercise

    setResults({
      caloriesBurned: Math.round(caloriesBurned),
      activity: selectedActivity.name,
      duration: durationValue,
      met: selectedActivity.met,
      fatBurned: fatBurned.toFixed(3),
      proteinNeeded: Math.round(proteinNeeded),
      waterNeeded: waterNeeded.toFixed(1)
    });
  };

  const handleReset = () => {
    setWeight('');
    setActivity('');
    setDuration('');
    setUnit('metric');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Calorie Burn Calculator"
        description="Calculate how many calories you burn during different physical activities based on your weight and duration."
        keywords="calorie burn calculator, exercise calories, calories burned, workout calculator, fitness calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Calorie Burn Calculator</h1>
        <p className="calculator-description">
          Calculate how many calories you burn during different physical activities based on your weight and duration.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUnit('metric')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                unit === 'metric'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Metric (kg)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                unit === 'imperial'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Imperial (lb)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight ({unit === 'metric' ? 'kg' : 'lb'})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaWeight className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRunning className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 30"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
              Activity
            </label>
            <select
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select an activity</option>
              
              {Object.entries(activityGroups).map(([groupName, activityIds]) => (
                <optgroup key={groupName} label={groupName}>
                  {activities
                    .filter(act => activityIds.includes(act.id))
                    .map(act => (
                      <option key={act.id} value={act.id}>
                        {act.name} (MET: {act.met})
                      </option>
                    ))
                  }
                </optgroup>
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
            <FaCalculator className="mr-2" /> Calculate Calories
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
              <FaFire className="mr-2 text-primary-600" /> Calorie Burn Results
            </h3>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Activity</h4>
                  <p className="text-lg font-semibold">{results.activity}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                  <p className="text-lg font-semibold">{results.duration} minutes</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <div className="flex items-center mb-1">
                  <FaFire className="text-red-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-500">Calories Burned</h4>
                </div>
                <p className="text-2xl font-bold text-primary-600">{results.caloriesBurned}</p>
                <p className="text-xs text-gray-500 mt-1">kcal</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fat Burned</h4>
                <p className="text-lg font-semibold">{results.fatBurned} kg</p>
                <p className="text-xs text-gray-500 mt-1">Approximately</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">MET Value</h4>
                <p className="text-lg font-semibold">{results.met}</p>
                <p className="text-xs text-gray-500 mt-1">Metabolic Equivalent of Task</p>
              </div>
            </div>
            
            <h4 className="text-md font-semibold text-gray-700 mb-3">Recommendations</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Protein Intake</h4>
                <p className="text-lg font-semibold">{results.proteinNeeded}g</p>
                <p className="text-xs text-gray-500 mt-1">Recommended daily protein for recovery</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Water Intake</h4>
                <p className="text-lg font-semibold">{results.waterNeeded} liters</p>
                <p className="text-xs text-gray-500 mt-1">Recommended daily water intake</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About Calorie Burn Calculation</h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              This calculator uses the MET (Metabolic Equivalent of Task) value of activities to estimate calorie burn.
              MET represents the ratio of working metabolic rate to resting metabolic rate.
            </p>
            <p>
              The formula used is: Calories Burned = MET × Weight (kg) × Duration (hours)
            </p>
            <p>
              For more accurate results, consider using a heart rate monitor during exercise, as individual factors like fitness level and intensity can affect actual calorie burn.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CalorieBurnCalculator;
