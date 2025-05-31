import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaExchangeAlt } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const SalaryHourlyCalculator = () => {
  const [calculationType, setCalculationType] = useState('salaryToHourly'); // 'salaryToHourly' or 'hourlyToSalary'
  const [salary, setSalary] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    setSalary(value);
    setResults(null);
    setError('');
  };

  const handleHourlyRateChange = (e) => {
    const value = e.target.value;
    setHourlyRate(value);
    setResults(null);
    setError('');
  };

  const handleHoursPerWeekChange = (e) => {
    const value = e.target.value;
    setHoursPerWeek(value);
    setResults(null);
    setError('');
  };

  const handleWeeksPerYearChange = (e) => {
    const value = e.target.value;
    setWeeksPerYear(value);
    setResults(null);
    setError('');
  };

  const handleCalculationTypeChange = (type) => {
    setCalculationType(type);
    setResults(null);
    setError('');
  };

  const validateInputs = () => {
    setError('');

    if (calculationType === 'salaryToHourly') {
      if (!salary || isNaN(parseFloat(salary)) || parseFloat(salary) < 0) {
        setError('Please enter a valid annual salary (must be a positive number)');
        return false;
      }
    } else {
      if (!hourlyRate || isNaN(parseFloat(hourlyRate)) || parseFloat(hourlyRate) < 0) {
        setError('Please enter a valid hourly rate (must be a positive number)');
        return false;
      }
    }

    if (!hoursPerWeek || isNaN(parseFloat(hoursPerWeek)) || parseFloat(hoursPerWeek) <= 0 || parseFloat(hoursPerWeek) > 168) {
      setError('Please enter valid hours per week (must be between 1 and 168)');
      return false;
    }

    if (!weeksPerYear || isNaN(parseFloat(weeksPerYear)) || parseFloat(weeksPerYear) <= 0 || parseFloat(weeksPerYear) > 52) {
      setError('Please enter valid weeks per year (must be between 1 and 52)');
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);
    const hoursPerYear = hours * weeks;

    if (calculationType === 'salaryToHourly') {
      const annualSalary = parseFloat(salary);
      const hourlyWage = annualSalary / hoursPerYear;
      
      // Calculate other time periods
      const dailyRate = hourlyWage * hours / 5; // Assuming 5-day work week
      const weeklyRate = hourlyWage * hours;
      const monthlyRate = annualSalary / 12;
      const biweeklyRate = weeklyRate * 2;

      setResults({
        annualSalary,
        hourlyWage,
        dailyRate,
        weeklyRate,
        biweeklyRate,
        monthlyRate,
        hoursPerWeek: hours,
        weeksPerYear: weeks,
        hoursPerYear
      });
    } else {
      const hourlyWage = parseFloat(hourlyRate);
      const annualSalary = hourlyWage * hoursPerYear;
      
      // Calculate other time periods
      const dailyRate = hourlyWage * hours / 5; // Assuming 5-day work week
      const weeklyRate = hourlyWage * hours;
      const monthlyRate = annualSalary / 12;
      const biweeklyRate = weeklyRate * 2;

      setResults({
        annualSalary,
        hourlyWage,
        dailyRate,
        weeklyRate,
        biweeklyRate,
        monthlyRate,
        hoursPerWeek: hours,
        weeksPerYear: weeks,
        hoursPerYear
      });
    }
  };

  const handleReset = () => {
    setSalary('');
    setHourlyRate('');
    setHoursPerWeek('40');
    setWeeksPerYear('52');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <SEO
        title="Salary to Hourly Calculator - Convert Salary to Hourly Wage"
        description="Convert annual salary to hourly wage or hourly rate to yearly salary. Calculate your equivalent pay rate across different time periods."
        keywords="salary calculator, hourly wage calculator, salary to hourly, hourly to salary, pay rate converter, income calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Salary to Hourly Calculator</h1>
        <p className="calculator-description">
          Convert between annual salary and hourly wage. Calculate equivalent pay rates for different time periods.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FaCalculator className="mr-2 text-primary-500" /> 
                Salary Converter
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conversion Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleCalculationTypeChange('salaryToHourly')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    calculationType === 'salaryToHourly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Salary to Hourly
                </button>
                <button
                  type="button"
                  onClick={() => handleCalculationTypeChange('hourlyToSalary')}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    calculationType === 'hourlyToSalary'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Hourly to Salary
                </button>
              </div>
            </div>

            {calculationType === 'salaryToHourly' ? (
              <div className="mb-4">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Salary
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    id="salary"
                    value={salary}
                    onChange={handleSalaryChange}
                    className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter annual salary"
                    min="0"
                    step="1000"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">/year</span>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    id="hourlyRate"
                    value={hourlyRate}
                    onChange={handleHourlyRateChange}
                    className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter hourly rate"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">/hour</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Per Week
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="hoursPerWeek"
                    value={hoursPerWeek}
                    onChange={handleHoursPerWeekChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="40"
                    min="1"
                    max="168"
                    step="0.5"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="weeksPerYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Weeks Per Year
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="weeksPerYear"
                    value={weeksPerYear}
                    onChange={handleWeeksPerYearChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="52"
                    min="1"
                    max="52"
                    step="1"
                  />
                </div>
              </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Hourly Rate
                  </h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(results.hourlyWage)}/hour
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Annual Salary
                  </h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(results.annualSalary)}/year
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Daily Rate
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatCurrency(results.dailyRate)}/day
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Weekly Rate
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatCurrency(results.weeklyRate)}/week
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Monthly Rate
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatCurrency(results.monthlyRate)}/month
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Work Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hours per week:</p>
                    <p className="font-medium">{results.hoursPerWeek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weeks per year:</p>
                    <p className="font-medium">{results.weeksPerYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours per year:</p>
                    <p className="font-medium">{results.hoursPerYear}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Calculation Steps' : 'Show Calculation Steps'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Steps:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>1. Total working hours per year = Hours per week × Weeks per year</p>
                    <p>   = {results.hoursPerWeek} × {results.weeksPerYear} = {results.hoursPerYear} hours</p>
                    
                    {calculationType === 'salaryToHourly' ? (
                      <>
                        <p>2. Hourly wage = Annual salary ÷ Total working hours per year</p>
                        <p>   = {formatCurrency(results.annualSalary)} ÷ {results.hoursPerYear} = {formatCurrency(results.hourlyWage)}/hour</p>
                      </>
                    ) : (
                      <>
                        <p>2. Annual salary = Hourly wage × Total working hours per year</p>
                        <p>   = {formatCurrency(results.hourlyWage)} × {results.hoursPerYear} = {formatCurrency(results.annualSalary)}/year</p>
                      </>
                    )}
                    
                    <p>3. Daily rate (8-hour day) = Hourly wage × (Hours per week ÷ 5)</p>
                    <p>   = {formatCurrency(results.hourlyWage)} × ({results.hoursPerWeek} ÷ 5) = {formatCurrency(results.dailyRate)}/day</p>
                    
                    <p>4. Weekly rate = Hourly wage × Hours per week</p>
                    <p>   = {formatCurrency(results.hourlyWage)} × {results.hoursPerWeek} = {formatCurrency(results.weeklyRate)}/week</p>
                    
                    <p>5. Bi-weekly rate = Weekly rate × 2</p>
                    <p>   = {formatCurrency(results.weeklyRate)} × 2 = {formatCurrency(results.biweeklyRate)}/2 weeks</p>
                    
                    <p>6. Monthly rate = Annual salary ÷ 12</p>
                    <p>   = {formatCurrency(results.annualSalary)} ÷ 12 = {formatCurrency(results.monthlyRate)}/month</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Salary Conversion</h2>
          <div className="space-y-2">
            <p>
              <strong>Salary to hourly conversion</strong> helps you understand your equivalent pay rate across different time periods.
            </p>
            <p>
              The standard full-time work schedule is typically 40 hours per week for 52 weeks per year (2,080 hours annually).
            </p>
            <p>
              <strong>Common work schedules:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full-time: 40 hours per week, 2,080 hours per year</li>
              <li>Part-time: 20-30 hours per week</li>
              <li>Seasonal: Varies, often using fewer than 52 weeks per year</li>
            </ul>
            <p>
              <strong>Note:</strong> This calculator provides a simple conversion and does not account for overtime, benefits, taxes, or other factors that affect total compensation.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default SalaryHourlyCalculator;
