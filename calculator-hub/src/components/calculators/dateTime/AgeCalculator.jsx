import { useState, useEffect } from 'react';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [calculationDate, setCalculationDate] = useState('');
  const [age, setAge] = useState(null);
  const [showExactAge, setShowExactAge] = useState(false);

  useEffect(() => {
    // Set today's date as default calculation date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCalculationDate(formattedDate);
  }, []);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const calculation = calculationDate ? new Date(calculationDate) : new Date();
    
    // Basic validation
    if (birth > calculation) {
      alert('Birth date cannot be in the future!');
      return;
    }

    // Calculate years
    let years = calculation.getFullYear() - birth.getFullYear();
    
    // Calculate months
    let months = calculation.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate days
    let days = calculation.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      // Get the last day of the previous month
      const lastMonth = new Date(calculation.getFullYear(), calculation.getMonth(), 0);
      days += lastMonth.getDate();
      
      if (months < 0) {
        years--;
        months += 12;
      }
    }
    
    // Calculate total values
    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((calculation - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    setAge({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes
    });
  };

  const handleReset = () => {
    setBirthDate('');
    const today = new Date();
    setCalculationDate(today.toISOString().split('T')[0]);
    setAge(null);
    setShowExactAge(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <SEO 
        title="Age Calculator" 
        description="Calculate your exact age in years, months, days, weeks, hours, and minutes based on your date of birth."
        keywords="age calculator, calculate age, age in years, age in months, age in days, date of birth calculator"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Age Calculator</h1>
        <p className="calculator-description">
          Calculate your exact age in years, months, days, weeks, hours, and minutes based on your date of birth.
        </p>

        <div className="mb-6">
          <div className="input-group">
            <label htmlFor="birthDate" className="input-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input-field"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="input-group">
            <label htmlFor="calculationDate" className="input-label">
              Calculate Age At
            </label>
            <input
              type="date"
              id="calculationDate"
              value={calculationDate}
              onChange={(e) => setCalculationDate(e.target.value)}
              className="input-field"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Leave as today's date to calculate current age
            </p>
          </div>

          <div className="flex space-x-4 mt-6">
            <button className="btn-primary" onClick={calculateAge}>
              Calculate Age
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <AdBanner position="middle" />

        {age && (
          <div className="result-container">
            <h2 className="text-xl font-semibold mb-4">Age Result</h2>
            
            <div className="mb-6">
              <p className="mb-2">
                <span className="font-semibold">From:</span> {formatDate(birthDate)}
              </p>
              <p className="mb-4">
                <span className="font-semibold">To:</span> {formatDate(calculationDate)}
              </p>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-4">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {age.years} years, {age.months} months, {age.days} days
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  or {age.totalMonths} months, {age.days} days
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => setShowExactAge(!showExactAge)}
                className="btn-secondary w-full"
              >
                {showExactAge ? 'Hide Detailed Age' : 'Show Detailed Age'}
              </button>
            </div>
            
            {showExactAge && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Months</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{age.totalMonths}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Weeks</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{age.totalWeeks}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Days</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{age.totalDays}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Hours</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{age.totalHours.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Minutes</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{age.totalMinutes.toLocaleString()}</p>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Upcoming Birthday</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                {(() => {
                  const today = new Date(calculationDate);
                  const birth = new Date(birthDate);
                  
                  // Set this year's birthday
                  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
                  
                  // If birthday has passed this year, set to next year
                  if (nextBirthday < today) {
                    nextBirthday.setFullYear(today.getFullYear() + 1);
                  }
                  
                  // Calculate days until next birthday
                  const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
                  const nextAge = nextBirthday.getFullYear() - birth.getFullYear();
                  
                  return (
                    <>
                      <p className="mb-2">
                        Your {nextAge}{getOrdinalSuffix(nextAge)} birthday will be on {formatDate(nextBirthday)}
                      </p>
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        {daysUntil} days from now
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Helper function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

export default AgeCalculator;
