import React, { useState, useEffect } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const UnitCircleCalculator = () => {
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState('degrees');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showUnitCircle, setShowUnitCircle] = useState(false);

  // Common angles in degrees
  const commonAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

  const handleAngleChange = (e) => {
    setAngle(e.target.value);
    setResults(null);
  };

  const handleAngleUnitChange = (unit) => {
    setAngleUnit(unit);
    setResults(null);
  };

  const handleCommonAngleClick = (commonAngle) => {
    setAngle(commonAngle.toString());
    calculateValues(commonAngle, angleUnit);
  };

  const validateInputs = () => {
    setError('');
    
    if (!angle || isNaN(parseFloat(angle))) {
      setError('Please enter a valid angle');
      return false;
    }
    
    return true;
  };

  const calculateValues = (inputAngle = angle, unit = angleUnit) => {
    if (!validateInputs()) return;
    
    // Convert to radians for calculations
    let angleInRadians;
    let angleInDegrees;
    
    if (unit === 'degrees') {
      angleInDegrees = parseFloat(inputAngle);
      angleInRadians = (angleInDegrees * Math.PI) / 180;
    } else {
      angleInRadians = parseFloat(inputAngle);
      angleInDegrees = (angleInRadians * 180) / Math.PI;
    }
    
    // Normalize angle to [0, 2π) or [0, 360°)
    const normalizedRadians = ((angleInRadians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const normalizedDegrees = ((angleInDegrees % 360) + 360) % 360;
    
    // Calculate trigonometric values
    const sinValue = Math.sin(angleInRadians);
    const cosValue = Math.cos(angleInRadians);
    const tanValue = Math.tan(angleInRadians);
    const cotValue = cosValue / sinValue; // cot(θ) = cos(θ) / sin(θ)
    const secValue = 1 / cosValue; // sec(θ) = 1 / cos(θ)
    const cscValue = 1 / sinValue; // csc(θ) = 1 / sin(θ)
    
    // Calculate coordinates on unit circle
    const x = cosValue; // x = cos(θ)
    const y = sinValue; // y = sin(θ)
    
    // Calculate quadrant
    let quadrant;
    if (normalizedDegrees === 0 || normalizedDegrees === 90 || 
        normalizedDegrees === 180 || normalizedDegrees === 270 || 
        normalizedDegrees === 360) {
      quadrant = "On axis";
    } else if (normalizedDegrees > 0 && normalizedDegrees < 90) {
      quadrant = "I (First)";
    } else if (normalizedDegrees > 90 && normalizedDegrees < 180) {
      quadrant = "II (Second)";
    } else if (normalizedDegrees > 180 && normalizedDegrees < 270) {
      quadrant = "III (Third)";
    } else {
      quadrant = "IV (Fourth)";
    }
    
    // Reference angle (smallest angle with x-axis)
    let referenceAngle;
    if (normalizedDegrees <= 90) {
      referenceAngle = normalizedDegrees;
    } else if (normalizedDegrees <= 180) {
      referenceAngle = 180 - normalizedDegrees;
    } else if (normalizedDegrees <= 270) {
      referenceAngle = normalizedDegrees - 180;
    } else {
      referenceAngle = 360 - normalizedDegrees;
    }
    
    // Reference angle in radians
    const referenceAngleRadians = (referenceAngle * Math.PI) / 180;
    
    setResults({
      angleInDegrees: normalizedDegrees,
      angleInRadians: normalizedRadians,
      sin: sinValue,
      cos: cosValue,
      tan: tanValue,
      cot: cotValue,
      sec: secValue,
      csc: cscValue,
      x,
      y,
      quadrant,
      referenceAngle,
      referenceAngleRadians
    });
  };

  const handleReset = () => {
    setAngle('');
    setAngleUnit('degrees');
    setResults(null);
    setError('');
  };

  // Draw unit circle on canvas
  useEffect(() => {
    if (!results) return;
    
    const canvas = document.getElementById('unitCircleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw coordinate axes
    ctx.beginPath();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw unit circle
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Label axes
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('1', centerX + radius + 5, centerY);
    ctx.fillText('-1', centerX - radius - 15, centerY);
    ctx.fillText('1', centerX, centerY - radius - 5);
    ctx.fillText('-1', centerX, centerY + radius + 15);
    
    // Draw angle
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.moveTo(centerX, centerY);
    const pointX = centerX + radius * results.cos;
    const pointY = centerY - radius * results.sin; // Negative because canvas y-axis is inverted
    ctx.lineTo(pointX, pointY);
    ctx.stroke();
    
    // Draw arc for angle
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.arc(centerX, centerY, radius / 4, 0, -results.angleInRadians, true);
    ctx.stroke();
    
    // Draw point on circle
    ctx.beginPath();
    ctx.fillStyle = '#ef4444';
    ctx.arc(pointX, pointY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Label point coordinates
    ctx.fillStyle = '#333';
    ctx.fillText(`(${results.cos.toFixed(3)}, ${results.sin.toFixed(3)})`, pointX + 10, pointY);
    
    // Label angle
    const labelRadius = radius / 3;
    const labelX = centerX + labelRadius * Math.cos(results.angleInRadians / 2);
    const labelY = centerY - labelRadius * Math.sin(results.angleInRadians / 2);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${results.angleInDegrees.toFixed(1)}°`, labelX, labelY);
    
  }, [results]);

  return (
    <>
      <SEO
        title="Unit Circle Calculator"
        description="Calculate trigonometric values, coordinates, and reference angles on the unit circle for any angle."
        keywords="unit circle calculator, trigonometry calculator, sin cos tan calculator, angle calculator, reference angle, unit circle values"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Unit Circle Calculator</h1>
        <p className="calculator-description">
          Calculate trigonometric values, coordinates, and reference angles on the unit circle for any angle.
        </p>

        <AdBanner position="top" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-1">
                Angle
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="angle"
                  value={angle}
                  onChange={handleAngleChange}
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter angle"
                  step="any"
                />
                <div className="inline-flex">
                  <button
                    onClick={() => handleAngleUnitChange('degrees')}
                    className={`px-3 py-2 text-sm font-medium ${
                      angleUnit === 'degrees'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Degrees
                  </button>
                  <button
                    onClick={() => handleAngleUnitChange('radians')}
                    className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                      angleUnit === 'radians'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Radians
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Common Angles
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAngles.map((commonAngle) => (
                <button
                  key={commonAngle}
                  onClick={() => handleCommonAngleClick(commonAngle)}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                  {commonAngle}°
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => calculateValues()}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaCalculator className="inline mr-2" /> Calculate
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Reset"
            >
              <FaRedo />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            <div className="mb-6">
              <button
                onClick={() => setShowUnitCircle(!showUnitCircle)}
                className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none mb-4"
              >
                <FaInfoCircle className="mr-1" />
                {showUnitCircle ? 'Hide Unit Circle' : 'Show Unit Circle'}
              </button>
              
              {showUnitCircle && (
                <div className="flex justify-center mb-4">
                  <canvas
                    id="unitCircleCanvas"
                    width="300"
                    height="300"
                    className="border border-gray-300 rounded"
                  ></canvas>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-primary-700 mb-2">
                  Angle Information
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Degrees:</p>
                    <p className="font-semibold">{results.angleInDegrees.toFixed(4)}°</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Radians:</p>
                    <p className="font-semibold">{results.angleInRadians.toFixed(4)} rad</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quadrant:</p>
                    <p className="font-semibold">{results.quadrant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference Angle:</p>
                    <p className="font-semibold">{results.referenceAngle.toFixed(4)}° ({results.referenceAngleRadians.toFixed(4)} rad)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-primary-700 mb-2">
                  Unit Circle Coordinates
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">x-coordinate (cos θ):</p>
                    <p className="font-semibold">{results.x.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">y-coordinate (sin θ):</p>
                    <p className="font-semibold">{results.y.toFixed(6)}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Point on unit circle: ({results.x.toFixed(6)}, {results.y.toFixed(6)})
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium text-primary-700 mb-2">
                Trigonometric Values
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">sin(θ):</p>
                  <p className="font-semibold">{results.sin.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">cos(θ):</p>
                  <p className="font-semibold">{results.cos.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">tan(θ):</p>
                  <p className="font-semibold">
                    {Math.abs(results.tan) > 1000000 ? 'Undefined' : results.tan.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">cot(θ):</p>
                  <p className="font-semibold">
                    {Math.abs(results.cot) > 1000000 ? 'Undefined' : results.cot.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">sec(θ):</p>
                  <p className="font-semibold">
                    {Math.abs(results.sec) > 1000000 ? 'Undefined' : results.sec.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">csc(θ):</p>
                  <p className="font-semibold">
                    {Math.abs(results.csc) > 1000000 ? 'Undefined' : results.csc.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-primary-700 mb-2">
                Exact Values (if applicable)
              </h3>
              
              {(() => {
                // Check if angle is one of the special angles with exact values
                const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
                const normalizedDegrees = Math.round(results.angleInDegrees * 100) / 100;
                
                // Find the closest special angle
                const isSpecialAngle = specialAngles.some(angle => 
                  Math.abs(normalizedDegrees % 360 - angle % 360) < 0.1
                );
                
                if (isSpecialAngle) {
                  const angle = Math.round(normalizedDegrees % 360);
                  
                  // Define exact values for special angles
                  let exactValues = {};
                  
                  switch (angle) {
                    case 0:
                    case 360:
                      exactValues = {
                        sin: '0',
                        cos: '1',
                        tan: '0'
                      };
                      break;
                    case 30:
                      exactValues = {
                        sin: '1/2',
                        cos: '√3/2',
                        tan: '1/√3'
                      };
                      break;
                    case 45:
                      exactValues = {
                        sin: '√2/2',
                        cos: '√2/2',
                        tan: '1'
                      };
                      break;
                    case 60:
                      exactValues = {
                        sin: '√3/2',
                        cos: '1/2',
                        tan: '√3'
                      };
                      break;
                    case 90:
                      exactValues = {
                        sin: '1',
                        cos: '0',
                        tan: 'Undefined'
                      };
                      break;
                    case 120:
                      exactValues = {
                        sin: '√3/2',
                        cos: '-1/2',
                        tan: '-√3'
                      };
                      break;
                    case 135:
                      exactValues = {
                        sin: '√2/2',
                        cos: '-√2/2',
                        tan: '-1'
                      };
                      break;
                    case 150:
                      exactValues = {
                        sin: '1/2',
                        cos: '-√3/2',
                        tan: '-1/√3'
                      };
                      break;
                    case 180:
                      exactValues = {
                        sin: '0',
                        cos: '-1',
                        tan: '0'
                      };
                      break;
                    case 210:
                      exactValues = {
                        sin: '-1/2',
                        cos: '-√3/2',
                        tan: '1/√3'
                      };
                      break;
                    case 225:
                      exactValues = {
                        sin: '-√2/2',
                        cos: '-√2/2',
                        tan: '1'
                      };
                      break;
                    case 240:
                      exactValues = {
                        sin: '-√3/2',
                        cos: '-1/2',
                        tan: '√3'
                      };
                      break;
                    case 270:
                      exactValues = {
                        sin: '-1',
                        cos: '0',
                        tan: 'Undefined'
                      };
                      break;
                    case 300:
                      exactValues = {
                        sin: '-√3/2',
                        cos: '1/2',
                        tan: '-√3'
                      };
                      break;
                    case 315:
                      exactValues = {
                        sin: '-√2/2',
                        cos: '√2/2',
                        tan: '-1'
                      };
                      break;
                    case 330:
                      exactValues = {
                        sin: '-1/2',
                        cos: '√3/2',
                        tan: '-1/√3'
                      };
                      break;
                    default:
                      return (
                        <p className="text-sm text-gray-600">
                          No exact values available for this angle.
                        </p>
                      );
                  }
                  
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">sin({angle}°):</p>
                        <p className="font-semibold">{exactValues.sin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">cos({angle}°):</p>
                        <p className="font-semibold">{exactValues.cos}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">tan({angle}°):</p>
                        <p className="font-semibold">{exactValues.tan}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <p className="text-sm text-gray-600">
                      No exact values available for this angle. Exact values are typically available for special angles like 0°, 30°, 45°, 60°, 90°, etc.
                    </p>
                  );
                }
              })()}
            </div>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About the Unit Circle</h2>
          <div className="space-y-2">
            <p>
              The unit circle is a circle with a radius of 1 unit centered at the origin (0,0) in the Cartesian coordinate system. It's a fundamental concept in trigonometry and provides a geometric interpretation of trigonometric functions.
            </p>
            
            <p>
              <strong>Key properties of the unit circle:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>For any angle θ, the coordinates of the point on the unit circle are (cos θ, sin θ)</li>
              <li>The x-coordinate of any point on the unit circle equals the cosine of the angle</li>
              <li>The y-coordinate of any point on the unit circle equals the sine of the angle</li>
              <li>The tangent of an angle equals the ratio of sine to cosine: tan θ = sin θ / cos θ</li>
            </ul>
            
            <p>
              <strong>Special angles on the unit circle:</strong>
            </p>
            <p>
              Certain angles have exact trigonometric values that can be expressed in terms of square roots:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>0° (0 rad): (1, 0)</li>
              <li>30° (π/6 rad): (√3/2, 1/2)</li>
              <li>45° (π/4 rad): (√2/2, √2/2)</li>
              <li>60° (π/3 rad): (1/2, √3/2)</li>
              <li>90° (π/2 rad): (0, 1)</li>
            </ul>
            
            <p>
              <strong>Reference angles:</strong> The reference angle is the acute angle (≤ 90°) that an angle makes with the x-axis. It's used to find trigonometric values of angles in different quadrants by relating them to angles in the first quadrant.
            </p>
            
            <p>
              The unit circle is particularly useful for understanding how trigonometric functions behave over different domains and for visualizing concepts like periodicity and symmetry in trigonometry.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default UnitCircleCalculator;
