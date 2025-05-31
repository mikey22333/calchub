import React, { useState } from 'react';
import { FaThermometerHalf, FaExchangeAlt, FaSnowflake, FaFire } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const TemperatureConverter = () => {
  const [inputTemp, setInputTemp] = useState('');
  const [inputUnit, setInputUnit] = useState('celsius');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResults(null);

    // Validate input
    if (!inputTemp) {
      setError('Please enter a temperature value');
      return;
    }

    const temp = parseFloat(inputTemp);
    if (isNaN(temp)) {
      setError('Please enter a valid number');
      return;
    }

    // Convert to all temperature units
    let celsius, fahrenheit, kelvin;

    switch (inputUnit) {
      case 'celsius':
        celsius = temp;
        fahrenheit = (temp * 9/5) + 32;
        kelvin = temp + 273.15;
        break;
      case 'fahrenheit':
        celsius = (temp - 32) * 5/9;
        fahrenheit = temp;
        kelvin = (temp - 32) * 5/9 + 273.15;
        break;
      case 'kelvin':
        celsius = temp - 273.15;
        fahrenheit = (temp - 273.15) * 9/5 + 32;
        kelvin = temp;
        break;
      default:
        setError('Invalid unit selected');
        return;
    }

    // Get temperature descriptions
    const description = getTemperatureDescription(celsius);
    const freezingPoint = celsius <= 0;
    const boilingPoint = celsius >= 100;

    setResults({
      celsius: celsius.toFixed(2),
      fahrenheit: fahrenheit.toFixed(2),
      kelvin: kelvin.toFixed(2),
      description,
      freezingPoint,
      boilingPoint
    });
  };

  const getTemperatureDescription = (celsius) => {
    if (celsius < -30) return 'Extremely cold';
    if (celsius < -10) return 'Very cold';
    if (celsius < 0) return 'Freezing';
    if (celsius < 10) return 'Very cool';
    if (celsius < 20) return 'Cool';
    if (celsius < 25) return 'Mild';
    if (celsius < 30) return 'Warm';
    if (celsius < 35) return 'Hot';
    if (celsius < 40) return 'Very hot';
    return 'Extremely hot';
  };

  const handleReset = () => {
    setInputTemp('');
    setInputUnit('celsius');
    setResults(null);
    setError('');
  };

  return (
    <>
      <SEO
        title="Temperature Converter"
        description="Convert between Celsius, Fahrenheit, and Kelvin temperature units with this easy-to-use calculator."
        keywords="temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, temperature calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Temperature Converter</h1>
        <p className="calculator-description">
          Convert temperatures between Celsius, Fahrenheit, and Kelvin units.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="inputTemp" className="block text-sm font-medium text-gray-700 mb-1">
                Temperature Value
              </label>
              <input
                type="number"
                id="inputTemp"
                value={inputTemp}
                onChange={(e) => setInputTemp(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter temperature"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="inputUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Temperature Unit
              </label>
              <select
                id="inputUnit"
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="kelvin">Kelvin (K)</option>
              </select>
            </div>
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
            <FaExchangeAlt className="mr-2" /> Convert Temperature
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
              <FaThermometerHalf className="mr-2 text-primary-600" /> Conversion Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Celsius (°C)</h4>
                <p className="text-lg font-semibold">{results.celsius} °C</p>
                <p className="text-xs text-gray-500 mt-1">Water freezes at 0°C, boils at 100°C</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fahrenheit (°F)</h4>
                <p className="text-lg font-semibold">{results.fahrenheit} °F</p>
                <p className="text-xs text-gray-500 mt-1">Water freezes at 32°F, boils at 212°F</p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Kelvin (K)</h4>
                <p className="text-lg font-semibold">{results.kelvin} K</p>
                <p className="text-xs text-gray-500 mt-1">Absolute zero is 0K (-273.15°C)</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Temperature Description</h4>
              <p className="text-lg font-semibold">{results.description}</p>
              
              <div className="flex items-center mt-2">
                {results.freezingPoint && (
                  <span className="inline-flex items-center mr-3 text-blue-600">
                    <FaSnowflake className="mr-1" /> At or below freezing point of water
                  </span>
                )}
                {results.boilingPoint && (
                  <span className="inline-flex items-center text-red-600">
                    <FaFire className="mr-1" /> At or above boiling point of water
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p className="font-medium mb-1">Temperature Conversion Formulas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Celsius to Fahrenheit: (°C × 9/5) + 32 = °F</li>
                <li>Fahrenheit to Celsius: (°F - 32) × 5/9 = °C</li>
                <li>Celsius to Kelvin: °C + 273.15 = K</li>
                <li>Kelvin to Celsius: K - 273.15 = °C</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About Temperature Units</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Celsius (°C)</strong> is used in most countries around the world. Water freezes at 0°C and boils at 100°C at standard atmospheric pressure.
            </p>
            <p>
              <strong>Fahrenheit (°F)</strong> is primarily used in the United States. Water freezes at 32°F and boils at 212°F at standard atmospheric pressure.
            </p>
            <p>
              <strong>Kelvin (K)</strong> is the SI base unit of temperature and is used in scientific contexts. It starts at absolute zero (0K), the theoretical lowest possible temperature. There are no negative Kelvin values.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default TemperatureConverter;
