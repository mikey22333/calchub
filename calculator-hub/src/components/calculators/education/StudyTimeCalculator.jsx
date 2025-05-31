import React, { useState } from 'react';
import { FaClock, FaPlus, FaTrash, FaRedo, FaBook } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const StudyTimeCalculator = () => {
  const [courses, setCourses] = useState([
    { name: 'Course 1', creditHours: 3, difficulty: 'medium' },
    { name: 'Course 2', creditHours: 3, difficulty: 'medium' },
    { name: 'Course 3', creditHours: 3, difficulty: 'medium' },
    { name: 'Course 4', creditHours: 3, difficulty: 'medium' },
  ]);
  const [studyEfficiency, setStudyEfficiency] = useState('average');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const difficultyFactors = {
    easy: 1.5,
    medium: 2,
    hard: 2.5,
    very_hard: 3
  };

  const efficiencyFactors = {
    very_high: 0.7,
    high: 0.85,
    average: 1,
    low: 1.15,
    very_low: 1.3
  };

  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
    setResults(null);
  };

  const addCourse = () => {
    setCourses([
      ...courses,
      { name: `Course ${courses.length + 1}`, creditHours: 3, difficulty: 'medium' }
    ]);
    setResults(null);
  };

  const removeCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    // Check for empty fields
    for (const course of courses) {
      if (!course.name || course.creditHours === '') {
        setError('Please fill in all fields for each course');
        return false;
      }
    }
    
    // Check for valid numbers
    for (const course of courses) {
      const creditHours = parseFloat(course.creditHours);
      
      if (isNaN(creditHours) || creditHours <= 0) {
        setError('Credit hours must be a positive number');
        return false;
      }
    }
    
    return true;
  };

  const calculateStudyTime = () => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }
    
    const courseResults = courses.map(course => {
      const creditHours = parseFloat(course.creditHours);
      const difficultyFactor = difficultyFactors[course.difficulty];
      const efficiencyFactor = efficiencyFactors[studyEfficiency];
      
      // Base formula: 2-3 hours of study time per credit hour per week
      const baseStudyHours = creditHours * difficultyFactor;
      const adjustedStudyHours = baseStudyHours * efficiencyFactor;
      
      return {
        ...course,
        weeklyHours: adjustedStudyHours.toFixed(1),
        dailyHours: (adjustedStudyHours / 7).toFixed(1)
      };
    });
    
    const totalWeeklyHours = courseResults.reduce(
      (sum, course) => sum + parseFloat(course.weeklyHours), 
      0
    );
    
    const totalDailyHours = totalWeeklyHours / 7;
    const totalCreditHours = courses.reduce(
      (sum, course) => sum + parseFloat(course.creditHours), 
      0
    );
    
    setResults({
      courseResults,
      totalWeeklyHours: totalWeeklyHours.toFixed(1),
      totalDailyHours: totalDailyHours.toFixed(1),
      totalCreditHours: totalCreditHours.toFixed(1),
      weekdayStudyHours: (totalWeeklyHours * 5/7).toFixed(1),
      weekendStudyHours: (totalWeeklyHours * 2/7).toFixed(1),
      recommendedWeekdayHours: (totalWeeklyHours * 5/7 / 5).toFixed(1),
      recommendedWeekendHours: (totalWeeklyHours * 2/7 / 2).toFixed(1)
    });
  };

  const handleReset = () => {
    setCourses([
      { name: 'Course 1', creditHours: 3, difficulty: 'medium' },
      { name: 'Course 2', creditHours: 3, difficulty: 'medium' },
      { name: 'Course 3', creditHours: 3, difficulty: 'medium' },
      { name: 'Course 4', creditHours: 3, difficulty: 'medium' },
    ]);
    setStudyEfficiency('average');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Study Time Calculator"
        description="Calculate recommended study time based on course load, difficulty, and your study efficiency."
        keywords="study time calculator, study planner, college study hours, academic planning, student time management"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Study Time Calculator</h1>
        <p className="calculator-description">
          Calculate recommended study time based on course load, difficulty, and your study efficiency.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaBook className="mr-2 text-primary-500" /> Course Information
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Course Name</th>
                    <th className="px-4 py-2 text-left">Credit Hours</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Course name"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={course.creditHours}
                          onChange={(e) => handleInputChange(index, 'creditHours', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          min="0.5"
                          step="0.5"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={course.difficulty}
                          onChange={(e) => handleInputChange(index, 'difficulty', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                          <option value="very_hard">Very Hard</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {courses.length > 1 && (
                          <button
                            onClick={() => removeCourse(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove course"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              onClick={addCourse}
              className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
            >
              <FaPlus className="mr-1" /> Add Course
            </button>
            
            <div className="mt-4">
              <label htmlFor="studyEfficiency" className="block text-sm font-medium text-gray-700 mb-1">
                Your Study Efficiency
              </label>
              <select
                id="studyEfficiency"
                value={studyEfficiency}
                onChange={(e) => {
                  setStudyEfficiency(e.target.value);
                  setResults(null);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="very_high">Very High (I learn quickly and retain information well)</option>
                <option value="high">High (I learn efficiently with good focus)</option>
                <option value="average">Average (I learn at a normal pace)</option>
                <option value="low">Low (I need more time to understand concepts)</option>
                <option value="very_low">Very Low (I struggle with focus and retention)</option>
              </select>
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculateStudyTime}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Calculate Study Time
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
              <h2 className="text-lg font-semibold mb-2">Study Time Results:</h2>
              
              <div className="bg-white p-4 rounded border border-gray-300 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Total Credit Hours</h3>
                    <div className="text-3xl font-bold text-primary-600">{results.totalCreditHours}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Weekly Study Hours</h3>
                    <div className="text-3xl font-bold text-secondary-600">{results.totalWeeklyHours}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-accent-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Daily Average</h3>
                    <div className="text-3xl font-bold text-accent-600">{results.totalDailyHours} hrs</div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Recommended Study Schedule:</h3>
              <div className="bg-white p-4 rounded border border-gray-300 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Weekdays (Monday-Friday)</h4>
                    <p className="text-lg font-semibold">{results.recommendedWeekdayHours} hours per day</p>
                    <p className="text-sm text-gray-600">Total: {results.weekdayStudyHours} hours</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Weekends (Saturday-Sunday)</h4>
                    <p className="text-lg font-semibold">{results.recommendedWeekendHours} hours per day</p>
                    <p className="text-sm text-gray-600">Total: {results.weekendStudyHours} hours</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Study Time Breakdown by Course:</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Course</th>
                      <th className="px-4 py-2 text-left">Credit Hours</th>
                      <th className="px-4 py-2 text-left">Difficulty</th>
                      <th className="px-4 py-2 text-left">Weekly Hours</th>
                      <th className="px-4 py-2 text-left">Daily Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.courseResults.map((course, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2">{course.name}</td>
                        <td className="px-4 py-2">{course.creditHours}</td>
                        <td className="px-4 py-2">
                          {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1).replace('_', ' ')}
                        </td>
                        <td className="px-4 py-2">{course.weeklyHours}</td>
                        <td className="px-4 py-2">{course.dailyHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">How This Calculator Works</h2>
          <div className="space-y-2">
            <p>
              This calculator uses a research-based approach to estimate appropriate study time:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>The general guideline is 2-3 hours of study time per credit hour per week</li>
              <li>Course difficulty adjusts the base study time:
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>Easy: 1.5× credit hours</li>
                  <li>Medium: 2× credit hours</li>
                  <li>Hard: 2.5× credit hours</li>
                  <li>Very Hard: 3× credit hours</li>
                </ul>
              </li>
              <li>Your personal study efficiency further adjusts the time needed</li>
              <li>The calculator provides a balanced weekday/weekend distribution</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Note: These are estimates to help with planning. Adjust based on your personal experience and course requirements.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default StudyTimeCalculator;
