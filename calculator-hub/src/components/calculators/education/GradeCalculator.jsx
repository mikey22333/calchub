import React, { useState } from 'react';
import { FaGraduationCap, FaPlus, FaTrash, FaRedo } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const GradeCalculator = () => {
  const [assessments, setAssessments] = useState([
    { name: 'Midterm Exam', weight: 30, score: '', maxScore: 100 },
    { name: 'Final Exam', weight: 40, score: '', maxScore: 100 },
    { name: 'Assignments', weight: 20, score: '', maxScore: 100 },
    { name: 'Participation', weight: 10, score: '', maxScore: 100 },
  ]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [gradeScale, setGradeScale] = useState('letter');

  const handleInputChange = (index, field, value) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[index][field] = value;
    setAssessments(updatedAssessments);
    setResults(null);
  };

  const addAssessment = () => {
    setAssessments([
      ...assessments,
      { name: `Assessment ${assessments.length + 1}`, weight: 0, score: '', maxScore: 100 }
    ]);
    setResults(null);
  };

  const removeAssessment = (index) => {
    const updatedAssessments = assessments.filter((_, i) => i !== index);
    setAssessments(updatedAssessments);
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    // Check for empty fields
    for (const assessment of assessments) {
      if (!assessment.name || assessment.weight === '' || assessment.score === '' || assessment.maxScore === '') {
        setError('Please fill in all fields for each assessment');
        return false;
      }
    }
    
    // Check for valid numbers
    for (const assessment of assessments) {
      const weight = parseFloat(assessment.weight);
      const score = parseFloat(assessment.score);
      const maxScore = parseFloat(assessment.maxScore);
      
      if (isNaN(weight) || weight < 0) {
        setError('Weight must be a non-negative number');
        return false;
      }
      
      if (isNaN(score) || score < 0) {
        setError('Score must be a non-negative number');
        return false;
      }
      
      if (isNaN(maxScore) || maxScore <= 0) {
        setError('Maximum score must be a positive number');
        return false;
      }
      
      if (score > maxScore) {
        setError(`Score cannot exceed maximum score for ${assessment.name}`);
        return false;
      }
    }
    
    // Check if weights sum to 100%
    const totalWeight = assessments.reduce((sum, assessment) => sum + parseFloat(assessment.weight), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      setError(`Total weight must equal 100% (currently ${totalWeight.toFixed(2)}%)`);
      return false;
    }
    
    return true;
  };

  const calculateGrade = () => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    const assessmentResults = assessments.map(assessment => {
      const weight = parseFloat(assessment.weight);
      const score = parseFloat(assessment.score);
      const maxScore = parseFloat(assessment.maxScore);
      const percentage = (score / maxScore) * 100;
      const weightedScore = (percentage * weight) / 100;
      
      weightedSum += weightedScore;
      totalWeight += weight;
      
      return {
        ...assessment,
        percentage: percentage.toFixed(2),
        weightedScore: weightedScore.toFixed(2)
      };
    });
    
    const finalGrade = weightedSum;
    const letterGrade = getLetterGrade(finalGrade);
    
    setResults({
      assessmentResults,
      finalGrade: finalGrade.toFixed(2),
      letterGrade
    });
  };

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

  const handleReset = () => {
    setAssessments([
      { name: 'Midterm Exam', weight: 30, score: '', maxScore: 100 },
      { name: 'Final Exam', weight: 40, score: '', maxScore: 100 },
      { name: 'Assignments', weight: 20, score: '', maxScore: 100 },
      { name: 'Participation', weight: 10, score: '', maxScore: 100 },
    ]);
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Grade Calculator"
        description="Calculate your final grade based on weighted assessments, tests, and exams."
        keywords="grade calculator, final grade calculator, weighted grade calculator, academic calculator, student grade calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Grade Calculator</h1>
        <p className="calculator-description">
          Calculate your final grade based on weighted assessments, tests, and exams.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-primary-500" /> Assessment Components
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Assessment</th>
                    <th className="px-4 py-2 text-left">Weight (%)</th>
                    <th className="px-4 py-2 text-left">Your Score</th>
                    <th className="px-4 py-2 text-left">Max Score</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={assessment.name}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={assessment.weight}
                          onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          min="0"
                          step="0.1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={assessment.score}
                          onChange={(e) => handleInputChange(index, 'score', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          min="0"
                          step="0.1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={assessment.maxScore}
                          onChange={(e) => handleInputChange(index, 'maxScore', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          min="0.1"
                          step="0.1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        {assessments.length > 1 && (
                          <button
                            onClick={() => removeAssessment(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove assessment"
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
            
            <div className="flex justify-between items-center">
              <button
                onClick={addAssessment}
                className="flex items-center text-primary-600 hover:text-primary-800"
              >
                <FaPlus className="mr-1" /> Add Assessment
              </button>
              
              <div className="text-sm text-gray-600">
                Total Weight: {assessments.reduce((sum, a) => sum + parseFloat(a.weight || 0), 0).toFixed(2)}%
              </div>
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculateGrade}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Calculate Grade
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
              <h2 className="text-lg font-semibold mb-2">Results:</h2>
              
              <div className="bg-white p-4 rounded border border-gray-300 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Final Grade</h3>
                    <div className="text-4xl font-bold text-primary-600">{results.finalGrade}%</div>
                  </div>
                  
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <h3 className="text-sm uppercase text-gray-600 mb-1">Letter Grade</h3>
                    <div className="text-4xl font-bold text-secondary-600">{results.letterGrade}</div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Assessment Breakdown:</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Assessment</th>
                      <th className="px-4 py-2 text-left">Score</th>
                      <th className="px-4 py-2 text-left">Percentage</th>
                      <th className="px-4 py-2 text-left">Weight</th>
                      <th className="px-4 py-2 text-left">Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.assessmentResults.map((result, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2">{result.name}</td>
                        <td className="px-4 py-2">{result.score} / {result.maxScore}</td>
                        <td className="px-4 py-2">{result.percentage}%</td>
                        <td className="px-4 py-2">{result.weight}%</td>
                        <td className="px-4 py-2">{result.weightedScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">How to Use This Calculator</h2>
          <div className="space-y-2">
            <p>
              This calculator helps you determine your final grade based on different assessments and their weights:
            </p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Enter the name of each assessment component (e.g., Midterm, Final Exam)</li>
              <li>Assign a weight (%) to each component (total should equal 100%)</li>
              <li>Enter your score and the maximum possible score for each component</li>
              <li>Click "Calculate Grade" to see your final grade and letter grade</li>
            </ol>
            <p className="mt-2">
              You can add or remove assessment components as needed to match your course structure.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default GradeCalculator;
