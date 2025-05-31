import { useState } from 'react';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const PercentageCalculator = () => {
  const [calculationType, setCalculationType] = useState('percentageOf');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState(null);

  const calculatePercentage = () => {
    if (!value1 || !value2) return;

    let calculatedResult;
    
    switch (calculationType) {
      case 'percentageOf':
        // What is X% of Y?
        calculatedResult = (parseFloat(value1) / 100) * parseFloat(value2);
        break;
      case 'percentageIncrease':
        // X increased by Y%
        calculatedResult = parseFloat(value1) * (1 + parseFloat(value2) / 100);
        break;
      case 'percentageDecrease':
        // X decreased by Y%
        calculatedResult = parseFloat(value1) * (1 - parseFloat(value2) / 100);
        break;
      case 'percentageDifference':
        // Percentage difference between X and Y
        const diff = Math.abs(parseFloat(value1) - parseFloat(value2));
        const avg = (parseFloat(value1) + parseFloat(value2)) / 2;
        calculatedResult = (diff / avg) * 100;
        break;
      case 'percentageChange':
        // Percentage change from X to Y
        calculatedResult = ((parseFloat(value2) - parseFloat(value1)) / parseFloat(value1)) * 100;
        break;
      case 'isWhatPercentOf':
        // X is what percentage of Y?
        calculatedResult = (parseFloat(value1) / parseFloat(value2)) * 100;
        break;
      default:
        calculatedResult = 0;
    }
    
    setResult(calculatedResult.toFixed(2));
  };

  const handleReset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const getInputLabels = () => {
    switch (calculationType) {
      case 'percentageOf':
        return { label1: 'Percentage (%)', label2: 'Value' };
      case 'percentageIncrease':
        return { label1: 'Original Value', label2: 'Percentage Increase (%)' };
      case 'percentageDecrease':
        return { label1: 'Original Value', label2: 'Percentage Decrease (%)' };
      case 'percentageDifference':
        return { label1: 'First Value', label2: 'Second Value' };
      case 'percentageChange':
        return { label1: 'Original Value', label2: 'New Value' };
      case 'isWhatPercentOf':
        return { label1: 'Value', label2: 'Total Value' };
      default:
        return { label1: 'Value 1', label2: 'Value 2' };
    }
  };

  const getResultText = () => {
    switch (calculationType) {
      case 'percentageOf':
        return `${value1}% of ${value2} = ${result}`;
      case 'percentageIncrease':
        return `${value1} increased by ${value2}% = ${result}`;
      case 'percentageDecrease':
        return `${value1} decreased by ${value2}% = ${result}`;
      case 'percentageDifference':
        return `Percentage difference between ${value1} and ${value2} = ${result}%`;
      case 'percentageChange':
        return `Percentage change from ${value1} to ${value2} = ${result}%`;
      case 'isWhatPercentOf':
        return `${value1} is ${result}% of ${value2}`;
      default:
        return `Result: ${result}`;
    }
  };

  const { label1, label2 } = getInputLabels();

  return (
    <>
      <SEO 
        title="Percentage Calculator" 
        description="Calculate percentages, increases, decreases, differences and more with this free online percentage calculator."
        keywords="percentage calculator, percent calculator, percentage increase, percentage decrease, percentage difference"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Percentage Calculator</h1>
        <p className="calculator-description">
          Calculate percentages, increases, decreases, differences, and more with this versatile percentage calculator.
        </p>

        <div className="mb-6">
          <div className="input-group">
            <label className="input-label">Calculation Type</label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value)}
              className="input-field"
            >
              <option value="percentageOf">What is X% of Y?</option>
              <option value="percentageIncrease">X increased by Y%</option>
              <option value="percentageDecrease">X decreased by Y%</option>
              <option value="percentageDifference">Percentage difference between X and Y</option>
              <option value="percentageChange">Percentage change from X to Y</option>
              <option value="isWhatPercentOf">X is what percentage of Y?</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="value1" className="input-label">
              {label1}
            </label>
            <input
              type="number"
              id="value1"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              className="input-field"
              placeholder={`Enter ${label1.toLowerCase()}`}
              step="any"
            />
          </div>

          <div className="input-group">
            <label htmlFor="value2" className="input-label">
              {label2}
            </label>
            <input
              type="number"
              id="value2"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              className="input-field"
              placeholder={`Enter ${label2.toLowerCase()}`}
              step="any"
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button className="btn-primary" onClick={calculatePercentage}>
              Calculate
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <AdBanner position="middle" />

        {result !== null && (
          <div className="result-container">
            <h2 className="text-xl font-semibold mb-2">Result</h2>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {getResultText()}
            </p>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">How it works</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                {calculationType === 'percentageOf' && (
                  <p>To calculate X% of Y, multiply Y by X/100. For example, 20% of 50 = 50 × (20/100) = 10.</p>
                )}
                {calculationType === 'percentageIncrease' && (
                  <p>To calculate a value increased by X%, multiply the original value by (1 + X/100). For example, 100 increased by 20% = 100 × (1 + 20/100) = 100 × 1.2 = 120.</p>
                )}
                {calculationType === 'percentageDecrease' && (
                  <p>To calculate a value decreased by X%, multiply the original value by (1 - X/100). For example, 100 decreased by 20% = 100 × (1 - 20/100) = 100 × 0.8 = 80.</p>
                )}
                {calculationType === 'percentageDifference' && (
                  <p>To calculate the percentage difference between two values, divide the absolute difference by the average of the two values, then multiply by 100.</p>
                )}
                {calculationType === 'percentageChange' && (
                  <p>To calculate the percentage change from X to Y, subtract X from Y, divide by X, then multiply by 100.</p>
                )}
                {calculationType === 'isWhatPercentOf' && (
                  <p>To calculate what percentage X is of Y, divide X by Y, then multiply by 100.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PercentageCalculator;
