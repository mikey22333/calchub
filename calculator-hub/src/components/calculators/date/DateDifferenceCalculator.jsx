import React, { useState } from 'react';
import { FaCalendarAlt, FaCalculator, FaCalendarDay } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const DateDifferenceCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeEndDate, setIncludeEndDate] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Please enter valid dates');
      return;
    }

    if (end < start) {
      setError('End date cannot be before start date');
      return;
    }

    // Calculate the difference
    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + (includeEndDate ? 1 : 0);
    
    // Calculate years, months, weeks
    const diffYears = calculateYears(start, end);
    const diffMonths = calculateMonths(start, end);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);

    // Calculate working days (Monday to Friday)
    const workingDays = calculateWorkingDays(start, end, includeEndDate);

    // Format dates for display
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);

    setResults({
      startDate: startFormatted,
      endDate: endFormatted,
      days: diffDays,
      workingDays: workingDays,
      weeks: diffWeeks,
      months: diffMonths,
      years: diffYears,
      hours: diffHours,
      minutes: diffMinutes,
      seconds: diffSeconds
    });
  };

  const calculateYears = (start, end) => {
    let years = end.getFullYear() - start.getFullYear();
    
    // Adjust if we haven't reached the anniversary in the end year
    if (
      end.getMonth() < start.getMonth() || 
      (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
    ) {
      years--;
    }
    
    return years;
  };

  const calculateMonths = (start, end) => {
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();
    
    // Adjust if we haven't reached the day of month
    if (end.getDate() < start.getDate()) {
      months--;
    }
    
    return months;
  };

  const calculateWorkingDays = (start, end, includeEndDate) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;
    
    // Clone the start date
    const currentDate = new Date(startDate);
    
    // Loop through each day
    while (currentDate <= endDate) {
      // 0 = Sunday, 6 = Saturday
      const dayOfWeek = currentDate.getDay();
      
      // Count if it's a weekday (Monday to Friday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Adjust if we don't want to include the end date
    if (!includeEndDate && end.getDay() !== 0 && end.getDay() !== 6) {
      count--;
    }
    
    return count;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setIncludeEndDate(true);
    setResults(null);
    setError('');
  };

  // Set today and tomorrow as default dates
  const setDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
  };

  return (
    <>
      <SEO
        title="Date Difference Calculator"
        description="Calculate the exact difference between two dates in days, weeks, months, and years."
        keywords="date difference calculator, days between dates, date calculator, time between dates"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Date Difference Calculator</h1>
        <p className="calculator-description">
          Calculate the exact time between two dates in various units (days, weeks, months, years).
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include end date in calculation</span>
            </label>
          </div>

          <div className="mb-4">
            <button
              onClick={setDefaultDates}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Use today and tomorrow
            </button>
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
            <FaCalculator className="mr-2" /> Calculate Difference
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
              <FaCalendarAlt className="mr-2 text-primary-600" /> Date Difference Results
            </h3>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">From</h4>
                  <p className="text-base font-semibold">{results.startDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">To</h4>
                  <p className="text-base font-semibold">{results.endDate}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Days</h4>
                <p className="text-lg font-semibold">{results.days}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Working Days</h4>
                <p className="text-lg font-semibold">{results.workingDays}</p>
                <p className="text-xs text-gray-500 mt-1">Mon-Fri</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Weeks</h4>
                <p className="text-lg font-semibold">{results.weeks}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Months</h4>
                <p className="text-lg font-semibold">{results.months}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Years</h4>
                <p className="text-lg font-semibold">{results.years}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Hours</h4>
                <p className="text-lg font-semibold">{results.hours}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Minutes</h4>
                <p className="text-lg font-semibold">{results.minutes}</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Seconds</h4>
                <p className="text-lg font-semibold">{results.seconds}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use the Date Difference Calculator</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Select a start date</li>
            <li>Select an end date</li>
            <li>Choose whether to include the end date in the calculation</li>
            <li>Click "Calculate Difference" to see the results</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">
            The calculator will show the difference in various time units, including working days (Monday to Friday).
          </p>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default DateDifferenceCalculator;
