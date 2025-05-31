import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CostPerUnitCalculator = () => {
  const [fixedCosts, setFixedCosts] = useState([{ name: 'Fixed Cost', amount: '' }]);
  const [variableCosts, setVariableCosts] = useState([{ name: 'Variable Cost', amount: '', perUnit: true }]);
  const [units, setUnits] = useState('');
  const [unitName, setUnitName] = useState('units');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleFixedCostNameChange = (index, value) => {
    const newFixedCosts = [...fixedCosts];
    newFixedCosts[index].name = value;
    setFixedCosts(newFixedCosts);
    setResults(null);
  };

  const handleFixedCostAmountChange = (index, value) => {
    const newFixedCosts = [...fixedCosts];
    newFixedCosts[index].amount = value;
    setFixedCosts(newFixedCosts);
    setResults(null);
  };

  const handleVariableCostNameChange = (index, value) => {
    const newVariableCosts = [...variableCosts];
    newVariableCosts[index].name = value;
    setVariableCosts(newVariableCosts);
    setResults(null);
  };

  const handleVariableCostAmountChange = (index, value) => {
    const newVariableCosts = [...variableCosts];
    newVariableCosts[index].amount = value;
    setVariableCosts(newVariableCosts);
    setResults(null);
  };

  const handleVariableCostPerUnitChange = (index, value) => {
    const newVariableCosts = [...variableCosts];
    newVariableCosts[index].perUnit = value;
    setVariableCosts(newVariableCosts);
    setResults(null);
  };

  const handleUnitsChange = (e) => {
    const value = e.target.value;
    setUnits(value);
    setResults(null);
  };

  const handleUnitNameChange = (e) => {
    const value = e.target.value;
    setUnitName(value);
    setResults(null);
  };

  const addFixedCost = () => {
    setFixedCosts([...fixedCosts, { name: `Fixed Cost ${fixedCosts.length + 1}`, amount: '' }]);
    setResults(null);
  };

  const removeFixedCost = (index) => {
    if (fixedCosts.length > 1) {
      const newFixedCosts = [...fixedCosts];
      newFixedCosts.splice(index, 1);
      setFixedCosts(newFixedCosts);
      setResults(null);
    }
  };

  const addVariableCost = () => {
    setVariableCosts([...variableCosts, { name: `Variable Cost ${variableCosts.length + 1}`, amount: '', perUnit: true }]);
    setResults(null);
  };

  const removeVariableCost = (index) => {
    if (variableCosts.length > 1) {
      const newVariableCosts = [...variableCosts];
      newVariableCosts.splice(index, 1);
      setVariableCosts(newVariableCosts);
      setResults(null);
    }
  };

  const validateInputs = () => {
    setError('');

    // Validate fixed costs
    for (let i = 0; i < fixedCosts.length; i++) {
      if (fixedCosts[i].amount === '' || isNaN(parseFloat(fixedCosts[i].amount)) || parseFloat(fixedCosts[i].amount) < 0) {
        setError(`Please enter a valid amount for "${fixedCosts[i].name}" (must be a non-negative number)`);
        return false;
      }
    }

    // Validate variable costs
    for (let i = 0; i < variableCosts.length; i++) {
      if (variableCosts[i].amount === '' || isNaN(parseFloat(variableCosts[i].amount)) || parseFloat(variableCosts[i].amount) < 0) {
        setError(`Please enter a valid amount for "${variableCosts[i].name}" (must be a non-negative number)`);
        return false;
      }
    }

    // Validate units
    if (!units || isNaN(parseFloat(units)) || parseFloat(units) <= 0) {
      setError(`Please enter a valid number of ${unitName} (must be a positive number)`);
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const totalUnits = parseFloat(units);
    
    // Calculate total fixed costs
    const totalFixedCost = fixedCosts.reduce((sum, cost) => sum + parseFloat(cost.amount), 0);
    
    // Calculate total variable costs
    let totalVariableCost = 0;
    const variableCostDetails = variableCosts.map(cost => {
      const amount = parseFloat(cost.amount);
      const costPerUnit = cost.perUnit ? amount : amount / totalUnits;
      const totalCost = costPerUnit * totalUnits;
      
      totalVariableCost += totalCost;
      
      return {
        name: cost.name,
        amount,
        perUnit: cost.perUnit,
        costPerUnit,
        totalCost
      };
    });
    
    // Calculate total cost and cost per unit
    const totalCost = totalFixedCost + totalVariableCost;
    const costPerUnit = totalCost / totalUnits;
    
    // Calculate fixed cost per unit
    const fixedCostPerUnit = totalFixedCost / totalUnits;
    
    // Calculate variable cost per unit
    const variableCostPerUnit = totalVariableCost / totalUnits;

    setResults({
      fixedCosts: fixedCosts.map(cost => ({
        name: cost.name,
        amount: parseFloat(cost.amount)
      })),
      variableCostDetails,
      totalFixedCost,
      totalVariableCost,
      totalCost,
      totalUnits,
      costPerUnit,
      fixedCostPerUnit,
      variableCostPerUnit,
      unitName
    });
  };

  const handleReset = () => {
    setFixedCosts([{ name: 'Fixed Cost', amount: '' }]);
    setVariableCosts([{ name: 'Variable Cost', amount: '', perUnit: true }]);
    setUnits('');
    setUnitName('units');
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <SEO
        title="Cost Per Unit Calculator - Calculate Production Cost Per Unit"
        description="Calculate the cost per unit for your products or services. Analyze fixed and variable costs to determine accurate unit pricing and break-even points."
        keywords="cost per unit calculator, unit cost calculator, production cost, manufacturing cost, fixed costs, variable costs, break-even analysis"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Cost Per Unit Calculator</h1>
        <p className="calculator-description">
          Calculate the cost per unit for your products or services by analyzing fixed and variable costs.
          This calculator helps you determine accurate unit pricing and break-even points.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalculator className="mr-2 text-primary-500" /> 
              Cost Per Unit Calculator
            </h2>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-800">Fixed Costs</h3>
                <button
                  onClick={addFixedCost}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                  title="Add Fixed Cost"
                >
                  <FaPlus className="mr-1" /> Add Fixed Cost
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Fixed costs remain the same regardless of production volume.
              </p>
              
              {fixedCosts.map((cost, index) => (
                <div key={`fixed-${index}`} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cost.name}
                      onChange={(e) => handleFixedCostNameChange(index, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Cost name"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        value={cost.amount}
                        onChange={(e) => handleFixedCostAmountChange(index, e.target.value)}
                        className="block w-full pl-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => removeFixedCost(index)}
                      className={`text-red-600 hover:text-red-800 focus:outline-none ${fixedCosts.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={fixedCosts.length === 1}
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-800">Variable Costs</h3>
                <button
                  onClick={addVariableCost}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                  title="Add Variable Cost"
                >
                  <FaPlus className="mr-1" /> Add Variable Cost
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Variable costs change based on production volume.
              </p>
              
              {variableCosts.map((cost, index) => (
                <div key={`variable-${index}`} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cost.name}
                      onChange={(e) => handleVariableCostNameChange(index, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Cost name"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        value={cost.amount}
                        onChange={(e) => handleVariableCostAmountChange(index, e.target.value)}
                        className="block w-full pl-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={cost.perUnit ? "perUnit" : "total"}
                      onChange={(e) => handleVariableCostPerUnitChange(index, e.target.value === "perUnit")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="perUnit">Per Unit</option>
                      <option value="total">Total</option>
                    </select>
                    <button
                      onClick={() => removeVariableCost(index)}
                      className={`ml-2 text-red-600 hover:text-red-800 focus:outline-none ${variableCosts.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={variableCosts.length === 1}
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    id="units"
                    value={units}
                    onChange={handleUnitsChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter number of units"
                    min="1"
                    step="1"
                  />
                </div>
                
                <div>
                  <label htmlFor="unitName" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Name (optional)
                  </label>
                  <input
                    type="text"
                    id="unitName"
                    value={unitName}
                    onChange={handleUnitNameChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., items, products, services"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={calculate}
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
              <h2 className="text-lg font-semibold mb-4">Results:</h2>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Cost Per Unit
                </h3>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(results.costPerUnit)} per {results.unitName}
                </p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fixed Cost Per Unit:</p>
                    <p className="font-medium">{formatCurrency(results.fixedCostPerUnit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Variable Cost Per Unit:</p>
                    <p className="font-medium">{formatCurrency(results.variableCostPerUnit)}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Fixed Costs
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatCurrency(results.totalFixedCost)}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Variable Costs
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatCurrency(results.totalVariableCost)}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Total Costs
                  </h3>
                  <p className="text-xl font-bold text-secondary-600">
                    {formatCurrency(results.totalCost)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <FaInfoCircle className="mr-1" />
                  {showSteps ? 'Hide Calculation Details' : 'Show Calculation Details'}
                </button>
              </div>
              
              {showSteps && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Calculation Details:</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Fixed Costs:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.fixedCosts.map((cost, index) => (
                        <li key={`fixed-detail-${index}`}>
                          {cost.name}: {formatCurrency(cost.amount)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1">Total Fixed Costs: {formatCurrency(results.totalFixedCost)}</p>
                    <p>Fixed Cost Per Unit: {formatCurrency(results.totalFixedCost)} ÷ {results.totalUnits} {results.unitName} = {formatCurrency(results.fixedCostPerUnit)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Variable Costs:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.variableCostDetails.map((cost, index) => (
                        <li key={`variable-detail-${index}`}>
                          {cost.name}: {cost.perUnit ? 
                            `${formatCurrency(cost.amount)} per unit × ${results.totalUnits} ${results.unitName} = ${formatCurrency(cost.totalCost)}` : 
                            `${formatCurrency(cost.amount)} total ÷ ${results.totalUnits} ${results.unitName} = ${formatCurrency(cost.costPerUnit)} per unit`}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1">Total Variable Costs: {formatCurrency(results.totalVariableCost)}</p>
                    <p>Variable Cost Per Unit: {formatCurrency(results.totalVariableCost)} ÷ {results.totalUnits} {results.unitName} = {formatCurrency(results.variableCostPerUnit)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Total Cost Per Unit Calculation:</h4>
                    <p>1. Total Costs = Fixed Costs + Variable Costs</p>
                    <p>   = {formatCurrency(results.totalFixedCost)} + {formatCurrency(results.totalVariableCost)}</p>
                    <p>   = {formatCurrency(results.totalCost)}</p>
                    <p>2. Cost Per Unit = Total Costs ÷ Number of Units</p>
                    <p>   = {formatCurrency(results.totalCost)} ÷ {results.totalUnits} {results.unitName}</p>
                    <p>   = {formatCurrency(results.costPerUnit)} per {results.unitName}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Cost Per Unit Calculation</h2>
          <div className="space-y-2">
            <p>
              <strong>Cost per unit</strong> is the total expense incurred to produce, store, and sell one unit of a product or service.
            </p>
            <p>
              Understanding your cost per unit is essential for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Setting appropriate pricing</li>
              <li>Calculating profit margins</li>
              <li>Identifying cost-saving opportunities</li>
              <li>Performing break-even analysis</li>
              <li>Making informed production decisions</li>
            </ul>
            <p>
              <strong>Fixed costs</strong> remain constant regardless of production volume (e.g., rent, insurance, equipment).
            </p>
            <p>
              <strong>Variable costs</strong> change based on production volume (e.g., materials, direct labor, packaging).
            </p>
            <p>
              As production volume increases, the fixed cost per unit decreases, potentially leading to economies of scale.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CostPerUnitCalculator;
