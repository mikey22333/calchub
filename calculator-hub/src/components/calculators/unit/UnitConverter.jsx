import { useState, useEffect } from 'react';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [conversionFormula, setConversionFormula] = useState('');

  // Unit conversion data
  const unitCategories = [
    { id: 'length', name: 'Length' },
    { id: 'weight', name: 'Weight' },
    { id: 'temperature', name: 'Temperature' },
    { id: 'area', name: 'Area' },
    { id: 'volume', name: 'Volume' },
    { id: 'speed', name: 'Speed' },
    { id: 'time', name: 'Time' },
    { id: 'digital', name: 'Digital Storage' },
  ];

  const unitData = {
    length: [
      { id: 'mm', name: 'Millimeter (mm)', factor: 0.001 },
      { id: 'cm', name: 'Centimeter (cm)', factor: 0.01 },
      { id: 'm', name: 'Meter (m)', factor: 1 },
      { id: 'km', name: 'Kilometer (km)', factor: 1000 },
      { id: 'in', name: 'Inch (in)', factor: 0.0254 },
      { id: 'ft', name: 'Foot (ft)', factor: 0.3048 },
      { id: 'yd', name: 'Yard (yd)', factor: 0.9144 },
      { id: 'mi', name: 'Mile (mi)', factor: 1609.344 },
    ],
    weight: [
      { id: 'mg', name: 'Milligram (mg)', factor: 0.000001 },
      { id: 'g', name: 'Gram (g)', factor: 0.001 },
      { id: 'kg', name: 'Kilogram (kg)', factor: 1 },
      { id: 't', name: 'Metric Ton (t)', factor: 1000 },
      { id: 'oz', name: 'Ounce (oz)', factor: 0.0283495 },
      { id: 'lb', name: 'Pound (lb)', factor: 0.453592 },
      { id: 'st', name: 'Stone (st)', factor: 6.35029 },
    ],
    temperature: [
      { id: 'c', name: 'Celsius (°C)', factor: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 1 },
      { id: 'k', name: 'Kelvin (K)', factor: 1 },
    ],
    area: [
      { id: 'mm2', name: 'Square Millimeter (mm²)', factor: 0.000001 },
      { id: 'cm2', name: 'Square Centimeter (cm²)', factor: 0.0001 },
      { id: 'm2', name: 'Square Meter (m²)', factor: 1 },
      { id: 'ha', name: 'Hectare (ha)', factor: 10000 },
      { id: 'km2', name: 'Square Kilometer (km²)', factor: 1000000 },
      { id: 'in2', name: 'Square Inch (in²)', factor: 0.00064516 },
      { id: 'ft2', name: 'Square Foot (ft²)', factor: 0.092903 },
      { id: 'ac', name: 'Acre (ac)', factor: 4046.86 },
      { id: 'mi2', name: 'Square Mile (mi²)', factor: 2589988.11 },
    ],
    volume: [
      { id: 'ml', name: 'Milliliter (ml)', factor: 0.001 },
      { id: 'l', name: 'Liter (l)', factor: 1 },
      { id: 'm3', name: 'Cubic Meter (m³)', factor: 1000 },
      { id: 'gal_us', name: 'US Gallon (gal)', factor: 3.78541 },
      { id: 'gal_uk', name: 'UK Gallon (gal)', factor: 4.54609 },
      { id: 'qt', name: 'Quart (qt)', factor: 0.946353 },
      { id: 'pt', name: 'Pint (pt)', factor: 0.473176 },
      { id: 'fl_oz', name: 'Fluid Ounce (fl oz)', factor: 0.0295735 },
      { id: 'cup', name: 'Cup (cup)', factor: 0.24 },
      { id: 'tbsp', name: 'Tablespoon (tbsp)', factor: 0.015 },
      { id: 'tsp', name: 'Teaspoon (tsp)', factor: 0.005 },
    ],
    speed: [
      { id: 'mps', name: 'Meters per Second (m/s)', factor: 1 },
      { id: 'kph', name: 'Kilometers per Hour (km/h)', factor: 0.277778 },
      { id: 'mph', name: 'Miles per Hour (mph)', factor: 0.44704 },
      { id: 'fps', name: 'Feet per Second (ft/s)', factor: 0.3048 },
      { id: 'knot', name: 'Knot (kn)', factor: 0.514444 },
    ],
    time: [
      { id: 'ms', name: 'Millisecond (ms)', factor: 0.001 },
      { id: 's', name: 'Second (s)', factor: 1 },
      { id: 'min', name: 'Minute (min)', factor: 60 },
      { id: 'h', name: 'Hour (h)', factor: 3600 },
      { id: 'd', name: 'Day (d)', factor: 86400 },
      { id: 'wk', name: 'Week (wk)', factor: 604800 },
      { id: 'mo', name: 'Month (30 days)', factor: 2592000 },
      { id: 'yr', name: 'Year (365 days)', factor: 31536000 },
    ],
    digital: [
      { id: 'b', name: 'Bit (b)', factor: 0.125 },
      { id: 'B', name: 'Byte (B)', factor: 1 },
      { id: 'KB', name: 'Kilobyte (KB)', factor: 1024 },
      { id: 'MB', name: 'Megabyte (MB)', factor: 1048576 },
      { id: 'GB', name: 'Gigabyte (GB)', factor: 1073741824 },
      { id: 'TB', name: 'Terabyte (TB)', factor: 1099511627776 },
    ],
  };

  // Set default units when category changes
  useEffect(() => {
    if (unitData[category] && unitData[category].length > 0) {
      setFromUnit(unitData[category][0].id);
      setToUnit(unitData[category][1].id);
    }
  }, [category]);

  const convert = () => {
    if (!inputValue || !fromUnit || !toUnit) return;

    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    let convertedValue;
    let formula = '';

    // Special case for temperature
    if (category === 'temperature') {
      if (fromUnit === 'c' && toUnit === 'f') {
        convertedValue = (value * 9/5) + 32;
        formula = `${value}°C × (9/5) + 32 = ${convertedValue.toFixed(2)}°F`;
      } else if (fromUnit === 'c' && toUnit === 'k') {
        convertedValue = value + 273.15;
        formula = `${value}°C + 273.15 = ${convertedValue.toFixed(2)}K`;
      } else if (fromUnit === 'f' && toUnit === 'c') {
        convertedValue = (value - 32) * 5/9;
        formula = `(${value}°F - 32) × (5/9) = ${convertedValue.toFixed(2)}°C`;
      } else if (fromUnit === 'f' && toUnit === 'k') {
        convertedValue = (value - 32) * 5/9 + 273.15;
        formula = `(${value}°F - 32) × (5/9) + 273.15 = ${convertedValue.toFixed(2)}K`;
      } else if (fromUnit === 'k' && toUnit === 'c') {
        convertedValue = value - 273.15;
        formula = `${value}K - 273.15 = ${convertedValue.toFixed(2)}°C`;
      } else if (fromUnit === 'k' && toUnit === 'f') {
        convertedValue = (value - 273.15) * 9/5 + 32;
        formula = `(${value}K - 273.15) × (9/5) + 32 = ${convertedValue.toFixed(2)}°F`;
      } else {
        convertedValue = value; // Same unit
        formula = `${value}${getUnitSymbol(fromUnit)} = ${convertedValue}${getUnitSymbol(toUnit)}`;
      }
    } else {
      // For other unit types, use conversion factors
      const fromUnitData = unitData[category].find(unit => unit.id === fromUnit);
      const toUnitData = unitData[category].find(unit => unit.id === toUnit);
      
      if (fromUnitData && toUnitData) {
        // Convert to base unit, then to target unit
        convertedValue = (value * fromUnitData.factor) / toUnitData.factor;
        
        if (fromUnitData.factor === 1) {
          formula = `${value} ${fromUnitData.name} × (1/${toUnitData.factor}) = ${convertedValue.toFixed(6)} ${toUnitData.name}`;
        } else if (toUnitData.factor === 1) {
          formula = `${value} ${fromUnitData.name} × ${fromUnitData.factor} = ${convertedValue.toFixed(6)} ${toUnitData.name}`;
        } else {
          formula = `${value} ${fromUnitData.name} × (${fromUnitData.factor}/${toUnitData.factor}) = ${convertedValue.toFixed(6)} ${toUnitData.name}`;
        }
      }
    }

    setResult(convertedValue);
    setConversionFormula(formula);
  };

  const handleReset = () => {
    setInputValue('');
    setResult(null);
    setConversionFormula('');
  };

  const getUnitSymbol = (unitId) => {
    switch (unitId) {
      case 'c': return '°C';
      case 'f': return '°F';
      case 'k': return 'K';
      default: return '';
    }
  };

  const formatResult = (value) => {
    if (value === null) return '';
    
    // For very small or very large numbers, use scientific notation
    if (Math.abs(value) < 0.000001 || Math.abs(value) > 1000000) {
      return value.toExponential(6);
    }
    
    // For numbers with many decimal places, limit to 6
    return value.toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <>
      <SEO 
        title="Unit Converter" 
        description="Convert between different units of measurement including length, weight, temperature, area, volume, speed, time, and digital storage."
        keywords="unit converter, measurement converter, length converter, weight converter, temperature converter"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Unit Converter</h1>
        <p className="calculator-description">
          Convert between different units of measurement including length, weight, temperature, area, volume, speed, time, and digital storage.
        </p>

        <div className="mb-6">
          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              {unitCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label htmlFor="fromUnit" className="input-label">
                From
              </label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="input-field"
              >
                {unitData[category]?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="toUnit" className="input-label">
                To
              </label>
              <select
                id="toUnit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="input-field"
              >
                {unitData[category]?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="inputValue" className="input-label">
              Value
            </label>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="input-field"
              placeholder="Enter value to convert"
              step="any"
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button className="btn-primary" onClick={convert}>
              Convert
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <AdBanner position="middle" />

        {result !== null && (
          <div className="result-container">
            <h2 className="text-xl font-semibold mb-4">Conversion Result</h2>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                  <p className="text-xl font-bold">
                    {inputValue} {unitData[category].find(unit => unit.id === fromUnit)?.name}
                  </p>
                </div>
                
                <div className="hidden md:block text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatResult(result)} {unitData[category].find(unit => unit.id === toUnit)?.name}
                  </p>
                </div>
              </div>
              
              {conversionFormula && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Formula:</p>
                  <p className="mt-1 font-mono text-sm">{conversionFormula}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Common Conversions</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                {category === 'length' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 inch = 2.54 centimeters</li>
                    <li>1 foot = 0.3048 meters</li>
                    <li>1 yard = 0.9144 meters</li>
                    <li>1 mile = 1.60934 kilometers</li>
                    <li>1 meter = 3.28084 feet</li>
                  </ul>
                )}
                {category === 'weight' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 pound = 0.453592 kilograms</li>
                    <li>1 kilogram = 2.20462 pounds</li>
                    <li>1 ounce = 28.3495 grams</li>
                    <li>1 stone = 6.35029 kilograms</li>
                    <li>1 ton (metric) = 2204.62 pounds</li>
                  </ul>
                )}
                {category === 'temperature' && (
                  <ul className="space-y-1 text-sm">
                    <li>°F = (°C × 9/5) + 32</li>
                    <li>°C = (°F - 32) × 5/9</li>
                    <li>K = °C + 273.15</li>
                    <li>Water freezes at 0°C / 32°F / 273.15K</li>
                    <li>Water boils at 100°C / 212°F / 373.15K</li>
                  </ul>
                )}
                {category === 'area' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 square meter = 10.7639 square feet</li>
                    <li>1 acre = 4046.86 square meters</li>
                    <li>1 hectare = 2.47105 acres</li>
                    <li>1 square mile = 2.58999 square kilometers</li>
                    <li>1 square foot = 0.092903 square meters</li>
                  </ul>
                )}
                {category === 'volume' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 US gallon = 3.78541 liters</li>
                    <li>1 UK gallon = 4.54609 liters</li>
                    <li>1 liter = 0.264172 US gallons</li>
                    <li>1 cubic meter = 1000 liters</li>
                    <li>1 cup = 240 milliliters</li>
                  </ul>
                )}
                {category === 'speed' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 mph = 1.60934 km/h</li>
                    <li>1 km/h = 0.621371 mph</li>
                    <li>1 knot = 1.15078 mph</li>
                    <li>1 m/s = 3.6 km/h</li>
                    <li>1 m/s = 2.23694 mph</li>
                  </ul>
                )}
                {category === 'time' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 day = 24 hours</li>
                    <li>1 week = 168 hours</li>
                    <li>1 year = 365.25 days (average)</li>
                    <li>1 hour = 3600 seconds</li>
                    <li>1 day = 86400 seconds</li>
                  </ul>
                )}
                {category === 'digital' && (
                  <ul className="space-y-1 text-sm">
                    <li>1 Byte = 8 Bits</li>
                    <li>1 Kilobyte = 1024 Bytes</li>
                    <li>1 Megabyte = 1024 Kilobytes</li>
                    <li>1 Gigabyte = 1024 Megabytes</li>
                    <li>1 Terabyte = 1024 Gigabytes</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UnitConverter;
