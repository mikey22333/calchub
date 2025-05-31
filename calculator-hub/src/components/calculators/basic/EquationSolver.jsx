import React, { useState } from 'react';
import { FaEquals, FaCalculator, FaSquareRootAlt } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const EquationSolver = () => {
  const [equationType, setEquationType] = useState('linear');
  const [linearInput, setLinearInput] = useState({ a: '', b: '' });
  const [quadraticInput, setQuadraticInput] = useState({ a: '', b: '', c: '' });
  const [systemInput, setSystemInput] = useState({
    a1: '', b1: '', c1: '',
    a2: '', b2: '', c2: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState([]);

  const handleLinearInputChange = (e) => {
    const { name, value } = e.target;
    setLinearInput({ ...linearInput, [name]: value });
    setError('');
  };

  const handleQuadraticInputChange = (e) => {
    const { name, value } = e.target;
    setQuadraticInput({ ...quadraticInput, [name]: value });
    setError('');
  };

  const handleSystemInputChange = (e) => {
    const { name, value } = e.target;
    setSystemInput({ ...systemInput, [name]: value });
    setError('');
  };

  const solveLinearEquation = () => {
    const { a, b } = linearInput;
    const parsedA = parseFloat(a);
    const parsedB = parseFloat(b);

    if (isNaN(parsedA) || isNaN(parsedB)) {
      setError('Please enter valid numbers for all coefficients');
      return;
    }

    if (parsedA === 0) {
      setError('Coefficient a cannot be zero for a linear equation');
      return;
    }

    const x = -parsedB / parsedA;
    const newSteps = [
      `Starting with the equation: ${parsedA}x + ${parsedB} = 0`,
      `Subtract ${parsedB} from both sides: ${parsedA}x = ${-parsedB}`,
      `Divide both sides by ${parsedA}: x = ${x}`
    ];

    setResults({ x });
    setSteps(newSteps);
  };

  const solveQuadraticEquation = () => {
    const { a, b, c } = quadraticInput;
    const parsedA = parseFloat(a);
    const parsedB = parseFloat(b);
    const parsedC = parseFloat(c);

    if (isNaN(parsedA) || isNaN(parsedB) || isNaN(parsedC)) {
      setError('Please enter valid numbers for all coefficients');
      return;
    }

    if (parsedA === 0) {
      setError('Coefficient a cannot be zero for a quadratic equation');
      return;
    }

    const discriminant = parsedB * parsedB - 4 * parsedA * parsedC;
    const newSteps = [
      `Starting with the equation: ${parsedA}x² + ${parsedB}x + ${parsedC} = 0`,
      `Calculate the discriminant: b² - 4ac = ${parsedB}² - 4 × ${parsedA} × ${parsedC} = ${discriminant}`
    ];

    if (discriminant < 0) {
      const realPart = -parsedB / (2 * parsedA);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * parsedA);
      
      newSteps.push(`Since the discriminant is negative, the equation has complex roots`);
      newSteps.push(`x₁ = (-b + √(discriminant))/(2a) = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`);
      newSteps.push(`x₂ = (-b - √(discriminant))/(2a) = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`);
      
      setResults({
        discriminant,
        x1: `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`,
        x2: `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`,
        type: 'complex'
      });
    } else if (discriminant === 0) {
      const x = -parsedB / (2 * parsedA);
      
      newSteps.push(`Since the discriminant is zero, the equation has one repeated root`);
      newSteps.push(`x = -b/(2a) = ${-parsedB}/(2 × ${parsedA}) = ${x}`);
      
      setResults({
        discriminant,
        x,
        type: 'repeated'
      });
    } else {
      const x1 = (-parsedB + Math.sqrt(discriminant)) / (2 * parsedA);
      const x2 = (-parsedB - Math.sqrt(discriminant)) / (2 * parsedA);
      
      newSteps.push(`Since the discriminant is positive, the equation has two real roots`);
      newSteps.push(`x₁ = (-b + √(discriminant))/(2a) = (${-parsedB} + √${discriminant})/(2 × ${parsedA}) = ${x1}`);
      newSteps.push(`x₂ = (-b - √(discriminant))/(2a) = (${-parsedB} - √${discriminant})/(2 × ${parsedA}) = ${x2}`);
      
      setResults({
        discriminant,
        x1,
        x2,
        type: 'real'
      });
    }

    setSteps(newSteps);
  };

  const solveSystemOfEquations = () => {
    const { a1, b1, c1, a2, b2, c2 } = systemInput;
    const parsedA1 = parseFloat(a1);
    const parsedB1 = parseFloat(b1);
    const parsedC1 = parseFloat(c1);
    const parsedA2 = parseFloat(a2);
    const parsedB2 = parseFloat(b2);
    const parsedC2 = parseFloat(c2);

    if (
      isNaN(parsedA1) || isNaN(parsedB1) || isNaN(parsedC1) ||
      isNaN(parsedA2) || isNaN(parsedB2) || isNaN(parsedC2)
    ) {
      setError('Please enter valid numbers for all coefficients');
      return;
    }

    // Calculate determinant
    const determinant = parsedA1 * parsedB2 - parsedA2 * parsedB1;
    
    const newSteps = [
      `Starting with the system of equations:`,
      `${parsedA1}x + ${parsedB1}y = ${parsedC1}`,
      `${parsedA2}x + ${parsedB2}y = ${parsedC2}`,
      `Calculate the determinant: (a₁ × b₂ - a₂ × b₁) = ${parsedA1} × ${parsedB2} - ${parsedA2} × ${parsedB1} = ${determinant}`
    ];

    if (determinant === 0) {
      // Check if the system is consistent
      if (parsedA1 / parsedA2 === parsedB1 / parsedB2 && parsedB1 / parsedB2 === parsedC1 / parsedC2) {
        newSteps.push(`The determinant is zero and the equations are consistent`);
        newSteps.push(`The system has infinitely many solutions`);
        
        setResults({
          type: 'infinite',
          equation: `y = ${parsedA1 !== 0 ? `${(-parsedB1/parsedA1).toFixed(4)}x + ${(parsedC1/parsedA1).toFixed(4)}` : `${(parsedC2/parsedB2).toFixed(4)}`}`
        });
      } else {
        newSteps.push(`The determinant is zero and the equations are inconsistent`);
        newSteps.push(`The system has no solution`);
        
        setResults({
          type: 'none'
        });
      }
    } else {
      // Cramer's rule
      const x = (parsedC1 * parsedB2 - parsedC2 * parsedB1) / determinant;
      const y = (parsedA1 * parsedC2 - parsedA2 * parsedC1) / determinant;
      
      newSteps.push(`Using Cramer's rule to solve the system:`);
      newSteps.push(`x = (c₁ × b₂ - c₂ × b₁) / determinant = (${parsedC1} × ${parsedB2} - ${parsedC2} × ${parsedB1}) / ${determinant} = ${x}`);
      newSteps.push(`y = (a₁ × c₂ - a₂ × c₁) / determinant = (${parsedA1} × ${parsedC2} - ${parsedA2} × ${parsedC1}) / ${determinant} = ${y}`);
      
      setResults({
        type: 'unique',
        x,
        y
      });
    }

    setSteps(newSteps);
  };

  const handleCalculate = () => {
    setError('');
    setResults(null);
    setSteps([]);
    
    switch (equationType) {
      case 'linear':
        solveLinearEquation();
        break;
      case 'quadratic':
        solveQuadraticEquation();
        break;
      case 'system':
        solveSystemOfEquations();
        break;
      default:
        setError('Please select an equation type');
    }
  };

  const handleClear = () => {
    setLinearInput({ a: '', b: '' });
    setQuadraticInput({ a: '', b: '', c: '' });
    setSystemInput({
      a1: '', b1: '', c1: '',
      a2: '', b2: '', c2: ''
    });
    setResults(null);
    setError('');
    setSteps([]);
  };

  const renderLinearInputs = () => (
    <div className="space-y-4">
      <p className="text-gray-700">Enter coefficients for the linear equation: ax + b = 0</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="a" className="block text-sm font-medium text-gray-700 mb-1">Coefficient a</label>
          <input
            type="number"
            id="a"
            name="a"
            value={linearInput.a}
            onChange={handleLinearInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 2"
          />
        </div>
        <div>
          <label htmlFor="b" className="block text-sm font-medium text-gray-700 mb-1">Coefficient b</label>
          <input
            type="number"
            id="b"
            name="b"
            value={linearInput.b}
            onChange={handleLinearInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., -5"
          />
        </div>
      </div>
    </div>
  );

  const renderQuadraticInputs = () => (
    <div className="space-y-4">
      <p className="text-gray-700">Enter coefficients for the quadratic equation: ax² + bx + c = 0</p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="a" className="block text-sm font-medium text-gray-700 mb-1">Coefficient a</label>
          <input
            type="number"
            id="a"
            name="a"
            value={quadraticInput.a}
            onChange={handleQuadraticInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 1"
          />
        </div>
        <div>
          <label htmlFor="b" className="block text-sm font-medium text-gray-700 mb-1">Coefficient b</label>
          <input
            type="number"
            id="b"
            name="b"
            value={quadraticInput.b}
            onChange={handleQuadraticInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., -3"
          />
        </div>
        <div>
          <label htmlFor="c" className="block text-sm font-medium text-gray-700 mb-1">Coefficient c</label>
          <input
            type="number"
            id="c"
            name="c"
            value={quadraticInput.c}
            onChange={handleQuadraticInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., -4"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemInputs = () => (
    <div className="space-y-4">
      <p className="text-gray-700">Enter coefficients for the system of equations:</p>
      <div className="mb-2">
        <p className="text-gray-700">a₁x + b₁y = c₁</p>
        <p className="text-gray-700">a₂x + b₂y = c₂</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="a1" className="block text-sm font-medium text-gray-700 mb-1">Coefficient a₁</label>
          <input
            type="number"
            id="a1"
            name="a1"
            value={systemInput.a1}
            onChange={handleSystemInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 2"
          />
        </div>
        <div>
          <label htmlFor="b1" className="block text-sm font-medium text-gray-700 mb-1">Coefficient b₁</label>
          <input
            type="number"
            id="b1"
            name="b1"
            value={systemInput.b1}
            onChange={handleSystemInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 3"
          />
        </div>
        <div>
          <label htmlFor="c1" className="block text-sm font-medium text-gray-700 mb-1">Coefficient c₁</label>
          <input
            type="number"
            id="c1"
            name="c1"
            value={systemInput.c1}
            onChange={handleSystemInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 8"
          />
        </div>
        <div>
          <label htmlFor="a2" className="block text-sm font-medium text-gray-700 mb-1">Coefficient a₂</label>
          <input
            type="number"
            id="a2"
            name="a2"
            value={systemInput.a2}
            onChange={handleSystemInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <label htmlFor="b2" className="block text-sm font-medium text-gray-700 mb-1">Coefficient b₂</label>
          <input
            type="number"
            id="b2"
            name="b2"
            value={systemInput.b2}
            onChange={handleSystemInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 1"
          />
        </div>
        <div>
          <label htmlFor="c2" className="block text-sm font-medium text-gray-700 mb-1">Coefficient c₂</label>
          <input
            type="number"
            id="c2"
            name="c2"
            value={systemInput.c2}
            onChange={handleSystemInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 7"
          />
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    switch (equationType) {
      case 'linear':
        return (
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Solution</h4>
            <p className="text-lg font-semibold">x = {results.x}</p>
          </div>
        );
      case 'quadratic':
        if (results.type === 'complex') {
          return (
            <>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Discriminant</h4>
                <p className="text-lg font-semibold">{results.discriminant} (negative)</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution 1</h4>
                <p className="text-lg font-semibold">x₁ = {results.x1}</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution 2</h4>
                <p className="text-lg font-semibold">x₂ = {results.x2}</p>
              </div>
            </>
          );
        } else if (results.type === 'repeated') {
          return (
            <>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Discriminant</h4>
                <p className="text-lg font-semibold">{results.discriminant} (zero)</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution (repeated)</h4>
                <p className="text-lg font-semibold">x = {results.x}</p>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Discriminant</h4>
                <p className="text-lg font-semibold">{results.discriminant} (positive)</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution 1</h4>
                <p className="text-lg font-semibold">x₁ = {results.x1}</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution 2</h4>
                <p className="text-lg font-semibold">x₂ = {results.x2}</p>
              </div>
            </>
          );
        }
      case 'system':
        if (results.type === 'unique') {
          return (
            <>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution Type</h4>
                <p className="text-lg font-semibold">Unique solution</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">x value</h4>
                <p className="text-lg font-semibold">x = {results.x}</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">y value</h4>
                <p className="text-lg font-semibold">y = {results.y}</p>
              </div>
            </>
          );
        } else if (results.type === 'infinite') {
          return (
            <>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Solution Type</h4>
                <p className="text-lg font-semibold">Infinitely many solutions</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Equation</h4>
                <p className="text-lg font-semibold">{results.equation}</p>
              </div>
            </>
          );
        } else {
          return (
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Solution Type</h4>
              <p className="text-lg font-semibold">No solution (inconsistent system)</p>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <>
      <SEO 
        title="Equation Solver" 
        description="Solve linear equations, quadratic equations, and systems of linear equations with step-by-step solutions."
        keywords="equation solver, linear equation, quadratic equation, system of equations, algebra calculator"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Equation Solver</h1>
        <p className="calculator-description">
          Solve linear equations, quadratic equations, and systems of linear equations with step-by-step solutions.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setEquationType('linear')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                equationType === 'linear'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Linear Equation
            </button>
            <button
              onClick={() => setEquationType('quadratic')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                equationType === 'quadratic'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Quadratic Equation
            </button>
            <button
              onClick={() => setEquationType('system')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                equationType === 'system'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              System of Equations
            </button>
          </div>

          {equationType === 'linear' && renderLinearInputs()}
          {equationType === 'quadratic' && renderQuadraticInputs()}
          {equationType === 'system' && renderSystemInputs()}
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
            <FaCalculator className="mr-2" /> Solve Equation
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            Clear
          </button>
        </div>

        {results && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaEquals className="mr-2 text-primary-600" /> Solution Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {renderResults()}
            </div>

            {steps.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                  <FaSquareRootAlt className="mr-2 text-primary-600" /> Step-by-Step Solution
                </h4>
                <div className="bg-white p-4 rounded-md border border-gray-100">
                  <ol className="list-decimal list-inside space-y-2">
                    {steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default EquationSolver;
