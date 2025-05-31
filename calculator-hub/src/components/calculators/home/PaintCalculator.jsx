import React, { useState } from 'react';
import { FaCalculator, FaPaintRoller, FaPlus, FaTrash } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const PaintCalculator = () => {
  const [walls, setWalls] = useState([
    { id: 1, name: 'Wall 1', width: '', height: '', windows: 0, doors: 0 }
  ]);
  const [paintCoverage, setPaintCoverage] = useState(350); // sq ft per gallon
  const [coats, setCoats] = useState(2);
  const [unit, setUnit] = useState('feet');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAddWall = () => {
    const newId = walls.length > 0 ? Math.max(...walls.map(w => w.id)) + 1 : 1;
    setWalls([...walls, { id: newId, name: `Wall ${newId}`, width: '', height: '', windows: 0, doors: 0 }]);
  };

  const handleRemoveWall = (id) => {
    if (walls.length > 1) {
      setWalls(walls.filter(wall => wall.id !== id));
    }
  };

  const handleWallChange = (id, field, value) => {
    setWalls(walls.map(wall => {
      if (wall.id === id) {
        return { ...wall, [field]: value };
      }
      return wall;
    }));
  };

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate inputs
    const invalidWalls = walls.filter(wall => 
      !wall.width || !wall.height || isNaN(parseFloat(wall.width)) || isNaN(parseFloat(wall.height))
    );

    if (invalidWalls.length > 0) {
      setError('Please enter valid dimensions for all walls');
      return;
    }

    // Calculate total area
    let totalWallArea = 0;
    let totalWindowArea = 0;
    let totalDoorArea = 0;

    walls.forEach(wall => {
      const width = parseFloat(wall.width);
      const height = parseFloat(wall.height);
      const windows = parseInt(wall.windows) || 0;
      const doors = parseInt(wall.doors) || 0;

      // Convert to square feet if using meters
      const conversionFactor = unit === 'meters' ? 10.764 : 1;
      
      // Standard window size: 15 sq ft (approx 3x5)
      // Standard door size: 21 sq ft (approx 3x7)
      const windowSize = unit === 'meters' ? 1.4 : 15; // 1.4 sq meters ≈ 15 sq ft
      const doorSize = unit === 'meters' ? 1.95 : 21; // 1.95 sq meters ≈ 21 sq ft

      const wallArea = width * height * conversionFactor;
      const windowArea = windows * windowSize;
      const doorArea = doors * doorSize;

      totalWallArea += wallArea;
      totalWindowArea += windowArea;
      totalDoorArea += doorArea;
    });

    // Calculate paintable area
    const paintableArea = totalWallArea - totalWindowArea - totalDoorArea;
    
    if (paintableArea <= 0) {
      setError('The paintable area must be greater than zero');
      return;
    }

    // Calculate paint needed
    const totalAreaWithCoats = paintableArea * coats;
    const gallonsNeeded = totalAreaWithCoats / paintCoverage;
    const quartsNeeded = gallonsNeeded * 4;
    
    // Calculate paint containers needed
    let gallonsWhole = Math.floor(gallonsNeeded);
    let remainingArea = (gallonsNeeded - gallonsWhole) * paintCoverage;
    
    let quarts = 0;
    if (remainingArea > 0) {
      quarts = Math.ceil(remainingArea / (paintCoverage / 4));
      if (quarts === 4) {
        quarts = 0;
        remainingArea = 0;
        gallonsWhole += 1;
      }
    }

    setResults({
      totalWallArea: totalWallArea.toFixed(2),
      totalWindowArea: totalWindowArea.toFixed(2),
      totalDoorArea: totalDoorArea.toFixed(2),
      paintableArea: paintableArea.toFixed(2),
      totalAreaWithCoats: totalAreaWithCoats.toFixed(2),
      gallonsNeeded: gallonsNeeded.toFixed(2),
      gallonsWhole,
      quarts,
      quartsNeeded: quartsNeeded.toFixed(2)
    });
  };

  const handleReset = () => {
    setWalls([{ id: 1, name: 'Wall 1', width: '', height: '', windows: 0, doors: 0 }]);
    setPaintCoverage(350);
    setCoats(2);
    setUnit('feet');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Paint Calculator"
        description="Calculate how much paint you need for your walls based on room dimensions, windows, and doors."
        keywords="paint calculator, wall paint, home improvement, DIY, paint estimator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Paint Calculator</h1>
        <p className="calculator-description">
          Calculate how much paint you need for your walls based on room dimensions, windows, and doors.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUnit('feet')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                unit === 'feet'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Feet (ft)
            </button>
            <button
              onClick={() => setUnit('meters')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                unit === 'meters'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Meters (m)
            </button>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="paintCoverage" className="block text-sm font-medium text-gray-700 mb-1">
                  Paint Coverage (sq ft per gallon)
                </label>
                <input
                  type="number"
                  id="paintCoverage"
                  value={paintCoverage}
                  onChange={(e) => setPaintCoverage(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Typical range: 250-400 sq ft per gallon
                </p>
              </div>
              
              <div>
                <label htmlFor="coats" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Coats
                </label>
                <select
                  id="coats"
                  value={coats}
                  onChange={(e) => setCoats(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="1">1 coat</option>
                  <option value="2">2 coats</option>
                  <option value="3">3 coats</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
              <FaPaintRoller className="mr-2 text-primary-600" /> Wall Dimensions
            </h3>
            
            {walls.map((wall, index) => (
              <div key={wall.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    <input
                      type="text"
                      value={wall.name}
                      onChange={(e) => handleWallChange(wall.id, 'name', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </h4>
                  {walls.length > 1 && (
                    <button
                      onClick={() => handleRemoveWall(wall.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove wall"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor={`width-${wall.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Width ({unit})
                    </label>
                    <input
                      type="number"
                      id={`width-${wall.id}`}
                      value={wall.width}
                      onChange={(e) => handleWallChange(wall.id, 'width', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`height-${wall.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Height ({unit})
                    </label>
                    <input
                      type="number"
                      id={`height-${wall.id}`}
                      value={wall.height}
                      onChange={(e) => handleWallChange(wall.id, 'height', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`windows-${wall.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Windows
                    </label>
                    <input
                      type="number"
                      id={`windows-${wall.id}`}
                      value={wall.windows}
                      onChange={(e) => handleWallChange(wall.id, 'windows', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`doors-${wall.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Doors
                    </label>
                    <input
                      type="number"
                      id={`doors-${wall.id}`}
                      value={wall.doors}
                      onChange={(e) => handleWallChange(wall.id, 'doors', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleAddWall}
              className="flex items-center text-primary-600 hover:text-primary-800 font-medium"
            >
              <FaPlus className="mr-1" /> Add Another Wall
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
            <FaCalculator className="mr-2" /> Calculate Paint Needed
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
              <FaPaintRoller className="mr-2 text-primary-600" /> Paint Calculation Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Wall Area</h4>
                <p className="text-lg font-semibold">{results.totalWallArea} sq ft</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Window & Door Area</h4>
                <p className="text-lg font-semibold">{(parseFloat(results.totalWindowArea) + parseFloat(results.totalDoorArea)).toFixed(2)} sq ft</p>
                <p className="text-xs text-gray-500 mt-1">Windows: {results.totalWindowArea} sq ft, Doors: {results.totalDoorArea} sq ft</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Paintable Area</h4>
                <p className="text-lg font-semibold">{results.paintableArea} sq ft</p>
                <p className="text-xs text-gray-500 mt-1">With {coats} coat{coats !== 1 ? 's' : ''}: {results.totalAreaWithCoats} sq ft</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Paint Needed</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Volume:</p>
                  <p className="text-lg font-semibold">{results.gallonsNeeded} gallons</p>
                  <p className="text-sm text-gray-500">({results.quartsNeeded} quarts)</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Recommended Purchase:</p>
                  <p className="text-lg font-semibold">
                    {results.gallonsWhole > 0 ? `${results.gallonsWhole} gallon${results.gallonsWhole !== 1 ? 's' : ''}` : ''}
                    {results.gallonsWhole > 0 && results.quarts > 0 ? ' and ' : ''}
                    {results.quarts > 0 ? `${results.quarts} quart${results.quarts !== 1 ? 's' : ''}` : ''}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p className="font-medium mb-1">Pro Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Buy a little extra paint for touch-ups later (about 10% more than calculated).</li>
                <li>One gallon typically covers 350 sq ft with one coat on smooth, previously painted surfaces.</li>
                <li>For new drywall or porous surfaces, coverage may be reduced to 250-300 sq ft per gallon.</li>
                <li>Most rooms require two coats for even coverage and proper color development.</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use This Calculator</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter the dimensions (width and height) for each wall you want to paint.</li>
            <li>Specify the number of windows and doors on each wall.</li>
            <li>Set the paint coverage rate (check the paint can for manufacturer specifications).</li>
            <li>Choose how many coats of paint you plan to apply.</li>
            <li>Click "Calculate Paint Needed" to see how much paint to buy.</li>
          </ol>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default PaintCalculator;
