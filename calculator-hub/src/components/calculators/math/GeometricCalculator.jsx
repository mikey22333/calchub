import React, { useState } from 'react';
import { FaSquare, FaCircle, FaCube, FaRedo } from 'react-icons/fa';
import { GiTriangleTarget } from 'react-icons/gi';
import { TbCylinder, TbPyramid } from 'react-icons/tb';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const GeometricCalculator = () => {
  const [shape, setShape] = useState('square');
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    radius: '',
    base: '',
    side1: '',
    side2: '',
    side3: '',
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDimensions({
      ...dimensions,
      [name]: value,
    });
  };

  const validateInputs = () => {
    setError('');
    
    const requiredFields = {
      square: ['length'],
      rectangle: ['length', 'width'],
      circle: ['radius'],
      triangle: ['base', 'side1', 'side2', 'side3'],
      cube: ['length'],
      cylinder: ['radius', 'height'],
      sphere: ['radius'],
      pyramid: ['base', 'height'],
    };
    
    const missingFields = requiredFields[shape].filter(field => !dimensions[field]);
    
    if (missingFields.length > 0) {
      setError(`Please enter values for: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Check for valid numbers
    for (const field of requiredFields[shape]) {
      const value = parseFloat(dimensions[field]);
      if (isNaN(value) || value <= 0) {
        setError(`Please enter a positive number for ${field}`);
        return false;
      }
    }
    
    // Special validation for triangle
    if (shape === 'triangle') {
      const a = parseFloat(dimensions.side1);
      const b = parseFloat(dimensions.side2);
      const c = parseFloat(dimensions.side3);
      
      if (a + b <= c || a + c <= b || b + c <= a) {
        setError('Triangle inequality theorem violated: the sum of the lengths of any two sides must be greater than the length of the remaining side');
        return false;
      }
    }
    
    return true;
  };

  const calculateResults = () => {
    if (!validateInputs()) {
      setResults(null);
      return;
    }

    const length = parseFloat(dimensions.length);
    const width = parseFloat(dimensions.width);
    const height = parseFloat(dimensions.height);
    const radius = parseFloat(dimensions.radius);
    const base = parseFloat(dimensions.base);
    const side1 = parseFloat(dimensions.side1);
    const side2 = parseFloat(dimensions.side2);
    const side3 = parseFloat(dimensions.side3);
    
    let area = 0;
    let perimeter = 0;
    let volume = null;
    let surfaceArea = null;
    
    switch (shape) {
      case 'square':
        area = length * length;
        perimeter = 4 * length;
        break;
        
      case 'rectangle':
        area = length * width;
        perimeter = 2 * (length + width);
        break;
        
      case 'circle':
        area = Math.PI * radius * radius;
        perimeter = 2 * Math.PI * radius; // Circumference
        break;
        
      case 'triangle':
        // Heron's formula for area
        const s = (side1 + side2 + side3) / 2;
        area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
        perimeter = side1 + side2 + side3;
        break;
        
      case 'cube':
        volume = Math.pow(length, 3);
        surfaceArea = 6 * Math.pow(length, 2);
        break;
        
      case 'cylinder':
        volume = Math.PI * radius * radius * height;
        surfaceArea = 2 * Math.PI * radius * (radius + height);
        break;
        
      case 'sphere':
        volume = (4/3) * Math.PI * Math.pow(radius, 3);
        surfaceArea = 4 * Math.PI * radius * radius;
        break;
        
      case 'pyramid':
        // Square-based pyramid
        volume = (1/3) * base * base * height;
        // Simplified surface area calculation for square base
        const slantHeight = Math.sqrt(Math.pow(base/2, 2) + Math.pow(height, 2));
        surfaceArea = base * base + 2 * base * slantHeight;
        break;
        
      default:
        setError('Invalid shape selected');
        return;
    }
    
    setResults({
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      volume: volume !== null ? volume.toFixed(2) : null,
      surfaceArea: surfaceArea !== null ? surfaceArea.toFixed(2) : null,
    });
  };

  const handleReset = () => {
    setDimensions({
      length: '',
      width: '',
      height: '',
      radius: '',
      base: '',
      side1: '',
      side2: '',
      side3: '',
    });
    setResults(null);
    setError('');
  };

  const renderInputFields = () => {
    switch (shape) {
      case 'square':
        return (
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Side Length
            </label>
            <input
              type="number"
              id="length"
              name="length"
              value={dimensions.length}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter side length"
              min="0"
              step="0.01"
            />
          </div>
        );
        
      case 'rectangle':
        return (
          <>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <input
                type="number"
                id="length"
                name="length"
                value={dimensions.length}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter length"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={dimensions.width}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter width"
                min="0"
                step="0.01"
              />
            </div>
          </>
        );
        
      case 'circle':
        return (
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
              Radius
            </label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={dimensions.radius}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter radius"
              min="0"
              step="0.01"
            />
          </div>
        );
        
      case 'triangle':
        return (
          <>
            <div>
              <label htmlFor="side1" className="block text-sm font-medium text-gray-700 mb-1">
                Side 1
              </label>
              <input
                type="number"
                id="side1"
                name="side1"
                value={dimensions.side1}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter side 1"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="side2" className="block text-sm font-medium text-gray-700 mb-1">
                Side 2
              </label>
              <input
                type="number"
                id="side2"
                name="side2"
                value={dimensions.side2}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter side 2"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="side3" className="block text-sm font-medium text-gray-700 mb-1">
                Side 3
              </label>
              <input
                type="number"
                id="side3"
                name="side3"
                value={dimensions.side3}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter side 3"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="base" className="block text-sm font-medium text-gray-700 mb-1">
                Base
              </label>
              <input
                type="number"
                id="base"
                name="base"
                value={dimensions.base}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter base length"
                min="0"
                step="0.01"
              />
            </div>
          </>
        );
        
      case 'cube':
        return (
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Side Length
            </label>
            <input
              type="number"
              id="length"
              name="length"
              value={dimensions.length}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter side length"
              min="0"
              step="0.01"
            />
          </div>
        );
        
      case 'cylinder':
        return (
          <>
            <div>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                Radius
              </label>
              <input
                type="number"
                id="radius"
                name="radius"
                value={dimensions.radius}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter radius"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={dimensions.height}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter height"
                min="0"
                step="0.01"
              />
            </div>
          </>
        );
        
      case 'sphere':
        return (
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
              Radius
            </label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={dimensions.radius}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter radius"
              min="0"
              step="0.01"
            />
          </div>
        );
        
      case 'pyramid':
        return (
          <>
            <div>
              <label htmlFor="base" className="block text-sm font-medium text-gray-700 mb-1">
                Base Length (square base)
              </label>
              <input
                type="number"
                id="base"
                name="base"
                value={dimensions.base}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter base length"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={dimensions.height}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter height"
                min="0"
                step="0.01"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  const renderShapeIcon = () => {
    switch (shape) {
      case 'square':
        return <FaSquare className="text-4xl text-primary-500 mb-2" />;
      case 'rectangle':
        return <FaSquare className="text-4xl text-primary-500 mb-2" />;
      case 'circle':
        return <FaCircle className="text-4xl text-primary-500 mb-2" />;
      case 'triangle':
        return <GiTriangleTarget className="text-4xl text-primary-500 mb-2" />;
      case 'cube':
        return <FaCube className="text-4xl text-primary-500 mb-2" />;
      case 'cylinder':
        return <TbCylinder className="text-4xl text-primary-500 mb-2" />;
      case 'sphere':
        return <FaCircle className="text-4xl text-primary-500 mb-2" />;
      case 'pyramid':
        return <TbPyramid className="text-4xl text-primary-500 mb-2" />;
      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title="Geometric Calculator"
        description="Calculate area, perimeter, volume, and surface area of various geometric shapes."
        keywords="geometric calculator, area calculator, perimeter calculator, volume calculator, surface area calculator, shape calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Geometric Calculator</h1>
        <p className="calculator-description">
          Calculate area, perimeter, volume, and surface area of various geometric shapes.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="shape" className="block text-sm font-medium text-gray-700 mb-1">
              Select Shape
            </label>
            <select
              id="shape"
              value={shape}
              onChange={(e) => {
                setShape(e.target.value);
                setResults(null);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <optgroup label="2D Shapes">
                <option value="square">Square</option>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
              </optgroup>
              <optgroup label="3D Shapes">
                <option value="cube">Cube</option>
                <option value="cylinder">Cylinder</option>
                <option value="sphere">Sphere</option>
                <option value="pyramid">Square Pyramid</option>
              </optgroup>
            </select>
          </div>

          <div className="flex justify-center mb-4">
            {renderShapeIcon()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {renderInputFields()}
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculateResults}
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
              <h2 className="text-lg font-semibold mb-2">Results:</h2>
              <div className="bg-white p-3 rounded border border-gray-300 space-y-2">
                {['square', 'rectangle', 'circle', 'triangle'].includes(shape) && (
                  <>
                    <p><strong>Area:</strong> {results.area} square units</p>
                    <p><strong>Perimeter{shape === 'circle' ? ' (Circumference)' : ''}:</strong> {results.perimeter} units</p>
                  </>
                )}
                
                {['cube', 'cylinder', 'sphere', 'pyramid'].includes(shape) && (
                  <>
                    <p><strong>Volume:</strong> {results.volume} cubic units</p>
                    <p><strong>Surface Area:</strong> {results.surfaceArea} square units</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Geometric Calculations</h2>
          <div className="space-y-2">
            <p>
              This calculator helps you find properties of common geometric shapes:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>2D Shapes:</strong> Calculate area and perimeter</li>
              <li><strong>3D Shapes:</strong> Calculate volume and surface area</li>
            </ul>
            <p>
              For triangles, the calculator uses Heron's formula to find the area based on the three sides.
              For 3D shapes, both volume and surface area are calculated using standard geometric formulas.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default GeometricCalculator;
