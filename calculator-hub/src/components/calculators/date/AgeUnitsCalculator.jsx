import React, { useState, useEffect } from 'react';
import { FaCalculator, FaRedo, FaCalendarAlt } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const AgeUnitsCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useCurrentDate, setUseCurrentDate] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set today's date as default end date
    const today = new Date();
    const formattedDate = formatDateForInput(today);
    setEndDate(formattedDate);
  }, []);

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleBirthDateChange = (e) => {
    setBirthDate(e.target.value);
    setResults(null);
    setError('');
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setResults(null);
    setError('');
  };

  const handleUseCurrentDateChange = (e) => {
    const useCurrentDateValue = e.target.checked;
    setUseCurrentDate(useCurrentDateValue);
    
    if (useCurrentDateValue) {
      const today = new Date();
      setEndDate(formatDateForInput(today));
    }
    
    setResults(null);
    setError('');
  };

  const validateDates = () => {
    setError('');
    
    if (!birthDate) {
      setError('Please enter a birth date');
      return false;
    }
    
    if (!useCurrentDate && !endDate) {
      setError('Please enter an end date');
      return false;
    }
    
    const birthDateObj = new Date(birthDate);
    const endDateObj = new Date(endDate);
    
    if (isNaN(birthDateObj.getTime())) {
      setError('Invalid birth date');
      return false;
    }
    
    if (!useCurrentDate && isNaN(endDateObj.getTime())) {
      setError('Invalid end date');
      return false;
    }
    
    if (endDateObj < birthDateObj) {
      setError('End date cannot be earlier than birth date');
      return false;
    }
    
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 200);
    
    if (birthDateObj > futureDate || endDateObj > futureDate) {
      setError('Dates too far in the future');
      return false;
    }
    
    return true;
  };

  const calculateAge = () => {
    if (!validateDates()) {
      setResults(null);
      return;
    }
    
    const birthDateObj = new Date(birthDate);
    const endDateObj = new Date(endDate);
    
    // Calculate total days
    const timeDiff = endDateObj.getTime() - birthDateObj.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // Calculate years, months, and days
    let years = 0;
    let months = 0;
    let days = 0;
    
    // Create a new date object to avoid modifying the original
    const tempDate = new Date(birthDateObj);
    
    // Calculate years
    while (true) {
      tempDate.setFullYear(tempDate.getFullYear() + 1);
      if (tempDate > endDateObj) {
        tempDate.setFullYear(tempDate.getFullYear() - 1);
        break;
      }
      years++;
    }
    
    // Calculate months
    while (true) {
      tempDate.setMonth(tempDate.getMonth() + 1);
      if (tempDate > endDateObj) {
        tempDate.setMonth(tempDate.getMonth() - 1);
        break;
      }
      months++;
    }
    
    // Calculate remaining days
    while (true) {
      tempDate.setDate(tempDate.getDate() + 1);
      if (tempDate > endDateObj) {
        break;
      }
      days++;
    }
    
    // Calculate total months
    const totalMonths = years * 12 + months;
    
    // Calculate weeks and remaining days
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    
    // Calculate hours, minutes, and seconds
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    
    setResults({
      birthDate: birthDateObj,
      endDate: endDateObj,
      years,
      months,
      days,
      totalYears: (totalDays / 365.25).toFixed(2),
      totalMonths,
      totalWeeks,
      remainingDays,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds
    });
  };

  const handleReset = () => {
    setBirthDate('');
    const today = new Date();
    setEndDate(formatDateForInput(today));
    setUseCurrentDate(true);
    setResults(null);
    setError('');
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title="Age in Days, Weeks & Months Calculator"
        description="Calculate your exact age in years, months, days, weeks, hours, minutes, and seconds with precision."
        keywords="age calculator, days calculator, weeks calculator, months calculator, age in days, age in weeks, age in months, date calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Age in Days, Weeks & Months Calculator</h1>
        <p className="calculator-description">
          Calculate your exact age or the time between two dates in multiple units including years, months, weeks, days, hours, minutes, and seconds.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> Calculate Age in Multiple Units
            </h2>
            
            <div className="mb-4">
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date / Start Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="useCurrentDate"
                  checked={useCurrentDate}
                  onChange={handleUseCurrentDateChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="useCurrentDate" className="ml-2 block text-sm text-gray-700">
                  Use current date as end date
                </label>
              </div>
              
              <div className={useCurrentDate ? 'opacity-50' : ''}>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date {!useCurrentDate && '*'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    disabled={useCurrentDate}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculateAge}
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
                <div className="mb-3">
                  <p className="text-sm text-gray-600">From:</p>
                  <p className="text-lg font-medium">{formatDate(results.birthDate)}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600">To:</p>
                  <p className="text-lg font-medium">{formatDate(results.endDate)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Exact Age</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {results.years} years, {results.months} months, {results.days} days
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-3">In Weeks</h3>
                  <p className="text-2xl font-bold text-secondary-600">
                    {results.totalWeeks} weeks, {results.remainingDays} days
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">Total in Different Units</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Years:</p>
                    <p className="text-lg font-medium">{results.totalYears}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Months:</p>
                    <p className="text-lg font-medium">{results.totalMonths}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Weeks:</p>
                    <p className="text-lg font-medium">{results.totalWeeks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Days:</p>
                    <p className="text-lg font-medium">{results.totalDays.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Hours:</p>
                    <p className="text-lg font-medium">{results.totalHours.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Minutes:</p>
                    <p className="text-lg font-medium">{results.totalMinutes.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Age Calculations</h2>
          <div className="space-y-2">
            <p>
              This calculator provides a precise breakdown of the time between two dates in various units.
            </p>
            <p>
              <strong>Exact Age:</strong> Shows years, months, and days in the most intuitive format, similar to how we typically express age.
            </p>
            <p>
              <strong>Weeks and Days:</strong> Converts the total time into complete weeks plus remaining days.
            </p>
            <p>
              <strong>Total Units:</strong> Shows the cumulative time in each unit (years, months, weeks, days, hours, minutes).
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Note: Calculations account for leap years and varying month lengths for accurate results.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default AgeUnitsCalculator;
