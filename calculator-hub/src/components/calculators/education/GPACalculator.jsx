import { useState } from 'react';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const GPACalculator = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Course 1', grade: '', credits: '' },
    { id: 2, name: 'Course 2', grade: '', credits: '' },
    { id: 3, name: 'Course 3', grade: '', credits: '' },
  ]);
  const [gradeScale, setGradeScale] = useState('4.0');
  const [result, setResult] = useState(null);
  const [nextId, setNextId] = useState(4);

  // Grade point values for different scales
  const gradePoints = {
    '4.0': {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    },
    '4.3': {
      'A+': 4.3, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    },
    '5.0': {
      'A+': 5.0, 'A': 5.0, 'A-': 4.7,
      'B+': 4.3, 'B': 4.0, 'B-': 3.7,
      'C+': 3.3, 'C': 3.0, 'C-': 2.7,
      'D+': 2.3, 'D': 2.0, 'D-': 1.7,
      'F': 0.0
    },
    'percentage': {
      'A+': 97, 'A': 93, 'A-': 90,
      'B+': 87, 'B': 83, 'B-': 80,
      'C+': 77, 'C': 73, 'C-': 70,
      'D+': 67, 'D': 63, 'D-': 60,
      'F': 0
    }
  };

  // Available letter grades
  const letterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

  // Add a new course row
  const addCourse = () => {
    setCourses([...courses, { id: nextId, name: `Course ${nextId}`, grade: '', credits: '' }]);
    setNextId(nextId + 1);
  };

  // Remove a course row
  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  // Update course data
  const updateCourse = (id, field, value) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  // Calculate GPA
  const calculateGPA = () => {
    // Validate inputs
    const validCourses = courses.filter(course => 
      course.grade && course.credits && !isNaN(parseFloat(course.credits))
    );

    if (validCourses.length === 0) {
      alert('Please enter at least one course with valid grade and credits');
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;
    let courseResults = [];

    validCourses.forEach(course => {
      const credits = parseFloat(course.credits);
      let points;

      // If grade is a number (percentage)
      if (!isNaN(parseFloat(course.grade))) {
        const percentage = parseFloat(course.grade);
        
        // Convert percentage to letter grade
        let letterGrade = 'F';
        if (percentage >= 97) letterGrade = 'A+';
        else if (percentage >= 93) letterGrade = 'A';
        else if (percentage >= 90) letterGrade = 'A-';
        else if (percentage >= 87) letterGrade = 'B+';
        else if (percentage >= 83) letterGrade = 'B';
        else if (percentage >= 80) letterGrade = 'B-';
        else if (percentage >= 77) letterGrade = 'C+';
        else if (percentage >= 73) letterGrade = 'C';
        else if (percentage >= 70) letterGrade = 'C-';
        else if (percentage >= 67) letterGrade = 'D+';
        else if (percentage >= 63) letterGrade = 'D';
        else if (percentage >= 60) letterGrade = 'D-';
        
        points = gradePoints[gradeScale][letterGrade] * credits;
        courseResults.push({
          ...course,
          letterGrade,
          points: gradePoints[gradeScale][letterGrade],
          weightedPoints: points
        });
      } else {
        // If grade is a letter
        points = gradePoints[gradeScale][course.grade] * credits;
        courseResults.push({
          ...course,
          letterGrade: course.grade,
          points: gradePoints[gradeScale][course.grade],
          weightedPoints: points
        });
      }

      totalPoints += points;
      totalCredits += credits;
    });

    const gpa = totalPoints / totalCredits;
    
    setResult({
      gpa: gpa.toFixed(2),
      totalCredits,
      totalPoints: totalPoints.toFixed(2),
      courses: courseResults
    });
  };

  // Reset the calculator
  const handleReset = () => {
    setCourses([
      { id: 1, name: 'Course 1', grade: '', credits: '' },
      { id: 2, name: 'Course 2', grade: '', credits: '' },
      { id: 3, name: 'Course 3', grade: '', credits: '' },
    ]);
    setNextId(4);
    setResult(null);
  };

  // Get letter grade from percentage
  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  // Get GPA classification
  const getGPAClassification = (gpa) => {
    const gpaValue = parseFloat(gpa);
    if (gpaValue >= 3.9) return 'Summa Cum Laude';
    if (gpaValue >= 3.7) return 'Magna Cum Laude';
    if (gpaValue >= 3.5) return 'Cum Laude';
    if (gpaValue >= 3.0) return 'Very Good';
    if (gpaValue >= 2.0) return 'Satisfactory';
    if (gpaValue >= 1.0) return 'Passing';
    return 'Failing';
  };

  return (
    <>
      <SEO 
        title="GPA Calculator" 
        description="Calculate your Grade Point Average (GPA) based on course grades and credit hours. Supports different GPA scales."
        keywords="GPA calculator, grade point average, college GPA, university grades, academic calculator"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">GPA Calculator</h1>
        <p className="calculator-description">
          Calculate your Grade Point Average (GPA) based on your course grades and credit hours. 
          This calculator supports different GPA scales and allows you to enter letter grades or percentages.
        </p>

        <div className="mb-6">
          <div className="input-group">
            <label className="input-label">GPA Scale</label>
            <select
              value={gradeScale}
              onChange={(e) => setGradeScale(e.target.value)}
              className="input-field"
            >
              <option value="4.0">4.0 Scale (Standard)</option>
              <option value="4.3">4.3 Scale (A+ = 4.3)</option>
              <option value="5.0">5.0 Scale</option>
              <option value="percentage">Percentage Scale</option>
            </select>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Enter Your Courses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                          className="input-field"
                          placeholder="Course Name"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select Grade</option>
                          {letterGrades.map((grade) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                          className="input-field"
                          placeholder="Credits"
                          min="0"
                          step="0.5"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={courses.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <button onClick={addCourse} className="btn-secondary">
                Add Course
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button className="btn-primary" onClick={calculateGPA}>
              Calculate GPA
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <AdBanner position="middle" />

        {result && (
          <div className="result-container">
            <h2 className="text-xl font-semibold mb-4">GPA Result</h2>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your GPA</p>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{result.gpa}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getGPAClassification(result.gpa)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Credits</p>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{result.totalCredits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Points</p>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{result.totalPoints}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Course Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weighted</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {result.courses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-4 py-2">{course.name}</td>
                          <td className="px-4 py-2">{course.letterGrade}</td>
                          <td className="px-4 py-2">{course.credits}</td>
                          <td className="px-4 py-2">{course.points}</td>
                          <td className="px-4 py-2">{course.weightedPoints.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">GPA Scale Information</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                <p className="mb-4">
                  This calculator uses the {gradeScale === 'percentage' ? 'percentage' : `${gradeScale}`} scale for GPA calculation.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-2 py-1 text-left">Letter Grade</th>
                        <th className="px-2 py-1 text-left">Grade Points</th>
                        {gradeScale === 'percentage' && (
                          <th className="px-2 py-1 text-left">Percentage Range</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {letterGrades.map((grade) => (
                        <tr key={grade}>
                          <td className="px-2 py-1">{grade}</td>
                          <td className="px-2 py-1">{gradePoints[gradeScale][grade]}</td>
                          {gradeScale === 'percentage' && (
                            <td className="px-2 py-1">
                              {grade === 'A+' ? '97-100%' :
                               grade === 'A' ? '93-96%' :
                               grade === 'A-' ? '90-92%' :
                               grade === 'B+' ? '87-89%' :
                               grade === 'B' ? '83-86%' :
                               grade === 'B-' ? '80-82%' :
                               grade === 'C+' ? '77-79%' :
                               grade === 'C' ? '73-76%' :
                               grade === 'C-' ? '70-72%' :
                               grade === 'D+' ? '67-69%' :
                               grade === 'D' ? '63-66%' :
                               grade === 'D-' ? '60-62%' :
                               'Below 60%'}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GPACalculator;
