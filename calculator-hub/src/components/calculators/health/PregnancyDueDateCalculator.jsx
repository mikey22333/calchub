import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaBaby, FaCalendarAlt } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const PregnancyDueDateCalculator = () => {
  const [calculationMethod, setCalculationMethod] = useState('lmp');
  const [lmpDate, setLmpDate] = useState('');
  const [conceptionDate, setConceptionDate] = useState('');
  const [ultrasoundDate, setUltrasoundDate] = useState('');
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState('');
  const [ultrasoundDays, setUltrasoundDays] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleCalculationMethodChange = (e) => {
    setCalculationMethod(e.target.value);
    setResults(null);
  };

  const handleLmpDateChange = (e) => {
    setLmpDate(e.target.value);
    setResults(null);
  };

  const handleConceptionDateChange = (e) => {
    setConceptionDate(e.target.value);
    setResults(null);
  };

  const handleUltrasoundDateChange = (e) => {
    setUltrasoundDate(e.target.value);
    setResults(null);
  };

  const handleUltrasoundWeeksChange = (e) => {
    setUltrasoundWeeks(e.target.value);
    setResults(null);
  };

  const handleUltrasoundDaysChange = (e) => {
    setUltrasoundDays(e.target.value);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    if (calculationMethod === 'lmp' && !lmpDate) {
      setError('Please enter your last menstrual period date');
      return false;
    }
    
    if (calculationMethod === 'conception' && !conceptionDate) {
      setError('Please enter your conception date');
      return false;
    }
    
    if (calculationMethod === 'ultrasound') {
      if (!ultrasoundDate) {
        setError('Please enter your ultrasound date');
        return false;
      }
      
      if (!ultrasoundWeeks || isNaN(parseInt(ultrasoundWeeks)) || parseInt(ultrasoundWeeks) < 0) {
        setError('Please enter a valid number of weeks');
        return false;
      }
      
      if (!ultrasoundDays || isNaN(parseInt(ultrasoundDays)) || parseInt(ultrasoundDays) < 0 || parseInt(ultrasoundDays) > 6) {
        setError('Please enter a valid number of days (0-6)');
        return false;
      }
      
      // Additional validation for reasonable gestational age
      const weeks = parseInt(ultrasoundWeeks);
      if (weeks > 40) {
        setError('Gestational age cannot exceed 40 weeks');
        return false;
      }
    }
    
    return true;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addWeeks = (date, weeks) => {
    return addDays(date, weeks * 7);
  };

  const subtractDays = (date, days) => {
    return addDays(date, -days);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculate = () => {
    if (!validateInputs()) return;

    let dueDate;
    let conceptionDateEstimate;
    let lmpDateEstimate;
    let currentGestationalAge;
    
    const today = new Date();
    
    if (calculationMethod === 'lmp') {
      // Calculate due date based on LMP (Naegele's rule)
      // Due date = LMP + 280 days (40 weeks)
      const lmp = new Date(lmpDate);
      dueDate = addDays(lmp, 280);
      
      // Estimate conception date (LMP + 14 days)
      conceptionDateEstimate = addDays(lmp, 14);
      
      lmpDateEstimate = lmp;
    } 
    else if (calculationMethod === 'conception') {
      // Calculate due date based on conception date
      // Due date = Conception date + 266 days (38 weeks)
      const conception = new Date(conceptionDate);
      dueDate = addDays(conception, 266);
      
      // Estimate LMP date (Conception date - 14 days)
      lmpDateEstimate = subtractDays(conception, 14);
      
      conceptionDateEstimate = conception;
    } 
    else if (calculationMethod === 'ultrasound') {
      // Calculate due date based on ultrasound
      const ultrasound = new Date(ultrasoundDate);
      const weeksAtUltrasound = parseInt(ultrasoundWeeks);
      const daysAtUltrasound = parseInt(ultrasoundDays);
      
      // Calculate days from LMP to ultrasound
      const daysFromLMP = (weeksAtUltrasound * 7) + daysAtUltrasound;
      
      // Estimate LMP date
      lmpDateEstimate = subtractDays(ultrasound, daysFromLMP);
      
      // Calculate due date (LMP + 280 days)
      dueDate = addDays(lmpDateEstimate, 280);
      
      // Estimate conception date (LMP + 14 days)
      conceptionDateEstimate = addDays(lmpDateEstimate, 14);
    }
    
    // Calculate current gestational age
    const daysSinceLMP = Math.floor((today - lmpDateEstimate) / (1000 * 60 * 60 * 24));
    const weeksPregnant = Math.floor(daysSinceLMP / 7);
    const daysRemainder = daysSinceLMP % 7;
    
    // Calculate days remaining until due date
    const daysRemaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // Calculate trimester
    let trimester;
    if (daysSinceLMP < 84) { // 0-12 weeks
      trimester = 'First';
    } else if (daysSinceLMP < 189) { // 13-27 weeks
      trimester = 'Second';
    } else { // 28+ weeks
      trimester = 'Third';
    }
    
    // Calculate important milestones
    const milestones = [
      { name: 'End of First Trimester', date: addWeeks(lmpDateEstimate, 13) },
      { name: 'End of Second Trimester', date: addWeeks(lmpDateEstimate, 27) },
      { name: 'Full Term (37 weeks)', date: addWeeks(lmpDateEstimate, 37) },
      { name: 'Due Date (40 weeks)', date: dueDate }
    ];
    
    currentGestationalAge = {
      weeks: weeksPregnant,
      days: daysRemainder
    };
    
    setResults({
      dueDate,
      lmpDate: lmpDateEstimate,
      conceptionDate: conceptionDateEstimate,
      currentGestationalAge,
      daysRemaining,
      trimester,
      milestones,
      calculationMethod
    });
  };

  const handleReset = () => {
    setCalculationMethod('lmp');
    setLmpDate('');
    setConceptionDate('');
    setUltrasoundDate('');
    setUltrasoundWeeks('');
    setUltrasoundDays('');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  return (
    <>
      <SEO
        title="Pregnancy Due Date Calculator - Estimate Your Due Date"
        description="Calculate your estimated due date based on last menstrual period, conception date, or ultrasound measurements. Track pregnancy milestones and trimester dates."
        keywords="pregnancy calculator, due date calculator, pregnancy due date, gestational age calculator, pregnancy week calculator, pregnancy trimester"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Pregnancy Due Date Calculator</h1>
        <p className="calculator-description">
          Calculate your estimated due date based on your last menstrual period, conception date, or ultrasound measurements.
          Track your pregnancy milestones and trimester dates.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaBaby className="mr-2 text-primary-500" /> 
              Due Date Calculator
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Method
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="calculationMethod"
                    value="lmp"
                    checked={calculationMethod === 'lmp'}
                    onChange={handleCalculationMethodChange}
                  />
                  <span className="ml-2">Last Menstrual Period (LMP)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="calculationMethod"
                    value="conception"
                    checked={calculationMethod === 'conception'}
                    onChange={handleCalculationMethodChange}
                  />
                  <span className="ml-2">Conception Date</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600 focus:ring-primary-500"
                    name="calculationMethod"
                    value="ultrasound"
                    checked={calculationMethod === 'ultrasound'}
                    onChange={handleCalculationMethodChange}
                  />
                  <span className="ml-2">Ultrasound Date</span>
                </label>
              </div>
            </div>

            {calculationMethod === 'lmp' && (
              <div className="mb-4">
                <label htmlFor="lmpDate" className="block text-sm font-medium text-gray-700 mb-1">
                  First Day of Last Menstrual Period
                </label>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    id="lmpDate"
                    value={lmpDate}
                    onChange={handleLmpDateChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {calculationMethod === 'conception' && (
              <div className="mb-4">
                <label htmlFor="conceptionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Conception Date
                </label>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    id="conceptionDate"
                    value={conceptionDate}
                    onChange={handleConceptionDateChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {calculationMethod === 'ultrasound' && (
              <>
                <div className="mb-4">
                  <label htmlFor="ultrasoundDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ultrasound Date
                  </label>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <input
                      type="date"
                      id="ultrasoundDate"
                      value={ultrasoundDate}
                      onChange={handleUltrasoundDateChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gestational Age at Ultrasound
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label htmlFor="ultrasoundWeeks" className="block text-xs text-gray-500 mb-1">
                        Weeks
                      </label>
                      <input
                        type="number"
                        id="ultrasoundWeeks"
                        value={ultrasoundWeeks}
                        onChange={handleUltrasoundWeeksChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        min="0"
                        max="40"
                        step="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="ultrasoundDays" className="block text-xs text-gray-500 mb-1">
                        Days
                      </label>
                      <input
                        type="number"
                        id="ultrasoundDays"
                        value={ultrasoundDays}
                        onChange={handleUltrasoundDaysChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        min="0"
                        max="6"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

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
                  Estimated Due Date
                </h3>
                <p className="text-2xl font-bold text-primary-600">
                  {formatDate(results.dueDate)}
                </p>
                <p className="text-sm text-gray-600">
                  Based on {
                    results.calculationMethod === 'lmp' ? 'last menstrual period' : 
                    results.calculationMethod === 'conception' ? 'conception date' : 
                    'ultrasound measurements'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Current Pregnancy Status
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {results.currentGestationalAge.weeks} weeks, {results.currentGestationalAge.days} days
                  </p>
                  <p className="text-sm text-gray-600">
                    {results.trimester} Trimester
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {results.daysRemaining > 0 
                      ? `${results.daysRemaining} days remaining until due date`
                      : 'Due date has passed'}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Important Dates
                  </h3>
                  <p className="text-sm">
                    <span className="font-medium">LMP:</span> {formatDate(results.lmpDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Conception:</span> {formatDate(results.conceptionDate)}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Pregnancy Milestones
                </h3>
                <div className="space-y-2">
                  {results.milestones.map((milestone, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{milestone.name}</span>
                      <span className="text-sm">{formatDate(milestone.date)}</span>
                    </div>
                  ))}
                </div>
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
                    {results.calculationMethod === 'lmp' && (
                      <>
                        <p>1. Last Menstrual Period (LMP): {formatDate(results.lmpDate)}</p>
                        <p>2. Due Date Calculation: LMP + 280 days (40 weeks) = {formatDate(results.dueDate)}</p>
                        <p>3. Estimated Conception Date: LMP + 14 days = {formatDate(results.conceptionDate)}</p>
                      </>
                    )}
                    
                    {results.calculationMethod === 'conception' && (
                      <>
                        <p>1. Conception Date: {formatDate(results.conceptionDate)}</p>
                        <p>2. Due Date Calculation: Conception + 266 days (38 weeks) = {formatDate(results.dueDate)}</p>
                        <p>3. Estimated LMP: Conception - 14 days = {formatDate(results.lmpDate)}</p>
                      </>
                    )}
                    
                    {results.calculationMethod === 'ultrasound' && (
                      <>
                        <p>1. Ultrasound Date with Gestational Age: {ultrasoundWeeks} weeks, {ultrasoundDays} days</p>
                        <p>2. Estimated LMP: Ultrasound Date - ({ultrasoundWeeks} weeks + {ultrasoundDays} days) = {formatDate(results.lmpDate)}</p>
                        <p>3. Due Date Calculation: Estimated LMP + 280 days (40 weeks) = {formatDate(results.dueDate)}</p>
                        <p>4. Estimated Conception Date: Estimated LMP + 14 days = {formatDate(results.conceptionDate)}</p>
                      </>
                    )}
                    
                    <p className="mt-2">Current Gestational Age Calculation:</p>
                    <p>Days since LMP: {Math.floor((new Date() - results.lmpDate) / (1000 * 60 * 60 * 24))}</p>
                    <p>Weeks: {results.currentGestationalAge.weeks}, Days: {results.currentGestationalAge.days}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Pregnancy Due Date Calculation</h2>
          <div className="space-y-2">
            <p>
              <strong>Pregnancy due date</strong> is typically calculated as 40 weeks (280 days) from the first day of your last menstrual period (LMP). This is known as Naegele's rule.
            </p>
            
            <p>
              <strong>Different calculation methods:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Last Menstrual Period (LMP):</strong> The most common method. Due date = LMP + 280 days.</li>
              <li><strong>Conception Date:</strong> If you know when conception occurred. Due date = Conception date + 266 days.</li>
              <li><strong>Ultrasound Dating:</strong> Based on measurements taken during an ultrasound. Most accurate when done in the first trimester.</li>
            </ul>
            
            <p>
              <strong>Pregnancy trimesters:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>First Trimester:</strong> Weeks 1-12 (Months 1-3)</li>
              <li><strong>Second Trimester:</strong> Weeks 13-27 (Months 4-6)</li>
              <li><strong>Third Trimester:</strong> Weeks 28-40+ (Months 7-9+)</li>
            </ul>
            
            <p>
              <strong>Important notes:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Only about 5% of babies are born on their exact due date.</li>
              <li>A normal pregnancy can last anywhere from 37 to 42 weeks.</li>
              <li>Babies born before 37 weeks are considered premature.</li>
              <li>This calculator provides an estimate only and should not replace medical advice.</li>
            </ul>
            
            <p>
              Always consult with your healthcare provider for the most accurate due date and personalized pregnancy care.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default PregnancyDueDateCalculator;
