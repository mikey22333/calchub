import React, { useState } from 'react';
import { FaRuler, FaExchangeAlt, FaRedo } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('meter');
  const [outputUnit, setOutputUnit] = useState('centimeter');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const lengthUnits = [
    { value: 'kilometer', label: 'Kilometer (km)', conversionToMeter: 1000 },
    { value: 'meter', label: 'Meter (m)', conversionToMeter: 1 },
    { value: 'centimeter', label: 'Centimeter (cm)', conversionToMeter: 0.01 },
    { value: 'millimeter', label: 'Millimeter (mm)', conversionToMeter: 0.001 },
    { value: 'mile', label: 'Mile (mi)', conversionToMeter: 1609.34 },
    { value: 'yard', label: 'Yard (yd)', conversionToMeter: 0.9144 },
    { value: 'foot', label: 'Foot (ft)', conversionToMeter: 0.3048 },
    { value: 'inch', label: 'Inch (in)', conversionToMeter: 0.0254 },
    { value: 'nauticalMile', label: 'Nautical Mile (nmi)', conversionToMeter: 1852 },
  ];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setResults(null);
  };

  const handleConvert = () => {
    setError('');
    setResults(null);

    // Validate input
    if (!inputValue) {
      setError('Please enter a value to convert');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    // Get conversion factors
    const inputUnitObj = lengthUnits.find(unit => unit.value === inputUnit);
    const outputUnitObj = lengthUnits.find(unit => unit.value === outputUnit);

    if (!inputUnitObj || !outputUnitObj) {
      setError('Invalid unit selection');
      return;
    }

    // Convert to meters first, then to target unit
    const valueInMeters = value * inputUnitObj.conversionToMeter;
    const convertedValue = valueInMeters / outputUnitObj.conversionToMeter;

    // Format the result
    let formattedResult;
    if (convertedValue >= 1000000 || convertedValue < 0.001) {
      formattedResult = convertedValue.toExponential(6);
    } else {
      formattedResult = convertedValue.toFixed(6).replace(/\.?0+$/, "");
    }

    setResults({
      inputValue: value,
      inputUnit: inputUnitObj.label,
      outputValue: convertedValue,
      formattedOutputValue: formattedResult,
      outputUnit: outputUnitObj.label,
    });
  };

  const handleReset = () => {
    setInputValue('');
    setInputUnit('meter');
    setOutputUnit('centimeter');
    setResults(null);
    setError('');
  };

  const handleSwapUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
    setResults(null);
  };

  return (
    <>
      <SEO
        title="Length Converter"
        description="Convert between different units of length including meters, feet, inches, miles, and more."
        keywords="length converter, distance converter, meter converter, feet to meters, inches to cm, unit conversion, measurement converter"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Length Converter</h1>
        <p className="calculator-description">
          Convert between different units of length including meters, feet, inches, miles, and more.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="inputUnit" className="block text-sm font-medium text-gray-700 mb-1">
                From Unit
              </label>
              <select
                id="inputUnit"
                value={inputUnit}
                onChange={(e) => {
                  setInputUnit(e.target.value);
                  setResults(null);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {lengthUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="outputUnit" className="block text-sm font-medium text-gray-700 mb-1">
                To Unit
              </label>
              <select
                id="outputUnit"
                value={outputUnit}
                onChange={(e) => {
                  setOutputUnit(e.target.value);
                  setResults(null);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {lengthUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-1">
              Value to Convert
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRuler className="text-gray-400" />
              </div>
              <input
                type="number"
                id="inputValue"
                value={inputValue}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter value"
                step="any"
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={handleConvert}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Convert
            </button>
            <button
              onClick={handleSwapUnits}
              className="bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
              title="Swap units"
            >
              <FaExchangeAlt />
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
              <h2 className="text-lg font-semibold mb-2">Conversion Result:</h2>
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="font-mono text-lg">
                  {results.inputValue} {results.inputUnit.split(' ')[0]} = {results.formattedOutputValue} {results.outputUnit.split(' ')[0]}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Common Length Conversions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Metric System</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>1 kilometer (km) = 1,000 meters</li>
                <li>1 meter (m) = 100 centimeters</li>
                <li>1 meter (m) = 1,000 millimeters</li>
                <li>1 centimeter (cm) = 10 millimeters</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-1">Imperial/US System</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>1 mile (mi) = 1,760 yards</li>
                <li>1 mile (mi) = 5,280 feet</li>
                <li>1 yard (yd) = 3 feet</li>
                <li>1 foot (ft) = 12 inches</li>
              </ul>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-medium mb-1">Cross-System Conversions</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li>1 inch (in) = 2.54 centimeters</li>
              <li>1 foot (ft) = 0.3048 meters</li>
              <li>1 yard (yd) = 0.9144 meters</li>
              <li>1 mile (mi) = 1.60934 kilometers</li>
              <li>1 nautical mile (nmi) = 1.852 kilometers</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default LengthConverter;
