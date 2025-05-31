import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaInfoCircle } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const QuadraticEquationSolver = () => {
  const [coefficients, setCoefficients] = useState({
    a: '',
    b: '',
    c: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const handleCoefficientChange = (coefficient, value) => {
    setCoefficients(prev => ({
      ...prev,
      [coefficient]: value
    }));
    setResults(null);
  };

  const validateInputs = () => {
    setError('');
    
    const { a, b, c } = coefficients;
    
    if (a === '' || b === '' || c === '') {
      setError('Please enter all coefficients');
      return false;
    }
    
    if (isNaN(parseFloat(a)) || isNaN(parseFloat(b)) || isNaN(parseFloat(c))) {
      setError('All coefficients must be valid numbers');
      return false;
    }
    
    if (parseFloat(a) === 0) {
      setError('Coefficient a cannot be zero (not a quadratic equation)');
      return false;
    }
    
    return true;
  };

  const calculateRoots = () => {
    if (!validateInputs()) return;
    
    const a = parseFloat(coefficients.a);
    const b = parseFloat(coefficients.b);
    const c = parseFloat(coefficients.c);
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    
    let roots = [];
    let rootType = '';
    let steps = [];
    
    // Step 1: Write the quadratic equation
    steps.push({
      step: 1,
      description: 'Write the quadratic equation in standard form: ax² + bx + c = 0',
      equation: `${a}x² + ${b}x + ${c} = 0`
    });
    
    // Step 2: Calculate the discriminant
    steps.push({
      step: 2,
      description: 'Calculate the discriminant using the formula: b² - 4ac',
      calculation: `Discriminant = ${b}² - 4 × ${a} × ${c} = ${b * b} - ${4 * a * c} = ${discriminant}`
    });
    
    // Step 3: Determine the nature of the roots
    if (discriminant > 0) {
      rootType = 'Two distinct real roots';
      steps.push({
        step: 3,
        description: 'Since the discriminant is positive, the equation has two distinct real roots',
        note: 'We will use the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)'
      });
      
      // Step 4: Calculate the roots
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const denominator = 2 * a;
      const x1 = (-b + sqrtDiscriminant) / denominator;
      const x2 = (-b - sqrtDiscriminant) / denominator;
      
      roots = [x1, x2];
      
      steps.push({
        step: 4,
        description: 'Calculate the two roots using the quadratic formula',
        calculation: [
          `x₁ = (-${b} + √${discriminant}) / (2 × ${a})`,
          `x₁ = (${-b} + ${sqrtDiscriminant.toFixed(4)}) / ${denominator}`,
          `x₁ = ${(-b + sqrtDiscriminant).toFixed(4)} / ${denominator}`,
          `x₁ = ${x1.toFixed(6)}`,
          '',
          `x₂ = (-${b} - √${discriminant}) / (2 × ${a})`,
          `x₂ = (${-b} - ${sqrtDiscriminant.toFixed(4)}) / ${denominator}`,
          `x₂ = ${(-b - sqrtDiscriminant).toFixed(4)} / ${denominator}`,
          `x₂ = ${x2.toFixed(6)}`
        ]
      });
      
    } else if (discriminant === 0) {
      rootType = 'One repeated real root (double root)';
      steps.push({
        step: 3,
        description: 'Since the discriminant is zero, the equation has one repeated real root',
        note: 'We will use the simplified quadratic formula: x = -b / (2a)'
      });
      
      // Step 4: Calculate the root
      const x = -b / (2 * a);
      roots = [x, x];
      
      steps.push({
        step: 4,
        description: 'Calculate the repeated root using the quadratic formula',
        calculation: [
          `x = -${b} / (2 × ${a})`,
          `x = ${-b} / ${2 * a}`,
          `x = ${x.toFixed(6)}`
        ]
      });
      
    } else {
      rootType = 'Two complex conjugate roots';
      steps.push({
        step: 3,
        description: 'Since the discriminant is negative, the equation has two complex conjugate roots',
        note: 'We will use the quadratic formula with complex numbers: x = (-b ± i√(4ac - b²)) / (2a)'
      });
      
      // Step 4: Calculate the complex roots
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
      
      roots = [
        { real: realPart, imaginary: imaginaryPart },
        { real: realPart, imaginary: -imaginaryPart }
      ];
      
      steps.push({
        step: 4,
        description: 'Calculate the two complex roots using the quadratic formula',
        calculation: [
          `Real part = -${b} / (2 × ${a}) = ${-b} / ${2 * a} = ${realPart.toFixed(6)}`,
          `Imaginary part = √(${-discriminant}) / (2 × ${a}) = ${Math.sqrt(-discriminant).toFixed(4)} / ${2 * a} = ${imaginaryPart.toFixed(6)}`,
          '',
          `x₁ = ${realPart.toFixed(6)} + ${imaginaryPart.toFixed(6)}i`,
          `x₂ = ${realPart.toFixed(6)} - ${imaginaryPart.toFixed(6)}i`
        ]
      });
    }
    
    // Step 5: Verify the roots
    steps.push({
      step: 5,
      description: 'Verify the roots by substituting them back into the original equation',
      note: 'You can verify that each root satisfies the equation: a(x²) + bx + c = 0'
    });
    
    // Calculate vertex
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    
    // Calculate axis of symmetry
    const axisOfSymmetry = -b / (2 * a);
    
    // Calculate y-intercept
    const yIntercept = c;
    
    // Calculate x-intercepts (if real roots exist)
    let xIntercepts = [];
    if (discriminant >= 0) {
      xIntercepts = roots;
    }
    
    // Determine if parabola opens upward or downward
    const opens = a > 0 ? 'upward' : 'downward';
    
    setResults({
      a,
      b,
      c,
      discriminant,
      roots,
      rootType,
      vertex: { x: vertexX, y: vertexY },
      axisOfSymmetry,
      yIntercept,
      xIntercepts,
      opens,
      steps
    });
  };

  const handleReset = () => {
    setCoefficients({
      a: '',
      b: '',
      c: ''
    });
    setResults(null);
    setError('');
    setShowSteps(false);
  };

  // Format complex number for display
  const formatComplex = (root) => {
    if (typeof root === 'number') {
      return root.toFixed(6);
    } else {
      const { real, imaginary } = root;
      const realPart = real.toFixed(6);
      const imaginaryPart = Math.abs(imaginary).toFixed(6);
      
      if (imaginary === 0) return realPart;
      if (real === 0) return `${imaginary > 0 ? '' : '-'}${imaginaryPart}i`;
      
      return `${realPart} ${imaginary > 0 ? '+' : '-'} ${imaginaryPart}i`;
    }
  };

  return (
    <>
      <SEO
        title="Quadratic Equation Solver"
        description="Solve quadratic equations step-by-step with detailed solutions. Find roots, vertex, axis of symmetry, and more for any quadratic equation."
        keywords="quadratic equation solver, quadratic formula calculator, solve ax2+bx+c, find roots, vertex, discriminant, complex roots, parabola properties"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Quadratic Equation Solver</h1>
        <p className="calculator-description">
          Solve quadratic equations in the form ax² + bx + c = 0 and find roots, vertex, discriminant, and other properties.
        </p>

        <AdBanner position="top" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Enter Coefficients</h2>
          
          <div className="flex items-center justify-center text-xl font-medium text-gray-700 mb-4">
            <span className="mr-2">Equation:</span>
            <span className="flex items-baseline">
              <input
                type="number"
                value={coefficients.a}
                onChange={(e) => handleCoefficientChange('a', e.target.value)}
                className="w-16 mx-1 p-1 border border-gray-300 rounded text-center"
                placeholder="a"
                step="any"
              />
              <span>x²</span>
              <span className="mx-1">+</span>
              <input
                type="number"
                value={coefficients.b}
                onChange={(e) => handleCoefficientChange('b', e.target.value)}
                className="w-16 mx-1 p-1 border border-gray-300 rounded text-center"
                placeholder="b"
                step="any"
              />
              <span>x</span>
              <span className="mx-1">+</span>
              <input
                type="number"
                value={coefficients.c}
                onChange={(e) => handleCoefficientChange('c', e.target.value)}
                className="w-16 mx-1 p-1 border border-gray-300 rounded text-center"
                placeholder="c"
                step="any"
              />
              <span className="ml-2">=</span>
              <span className="ml-2">0</span>
            </span>
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={calculateRoots}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaCalculator className="inline mr-2" /> Solve Equation
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
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium text-primary-700 mb-2">
                Equation: {results.a}x² + {results.b}x + {results.c} = 0
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Root Type:</strong> {results.rootType}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Discriminant:</strong> Δ = b² - 4ac = {results.discriminant.toFixed(4)}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-primary-700 mb-2">
                  Roots (Solutions)
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>x₁ = </strong> 
                    <span className="font-semibold text-secondary-600">
                      {formatComplex(results.roots[0])}
                    </span>
                  </p>
                  <p>
                    <strong>x₂ = </strong> 
                    <span className="font-semibold text-secondary-600">
                      {formatComplex(results.roots[1])}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-primary-700 mb-2">
                  Parabola Properties
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Vertex:</strong> ({results.vertex.x.toFixed(4)}, {results.vertex.y.toFixed(4)})
                  </p>
                  <p>
                    <strong>Axis of Symmetry:</strong> x = {results.axisOfSymmetry.toFixed(4)}
                  </p>
                  <p>
                    <strong>y-intercept:</strong> {results.yIntercept.toFixed(4)}
                  </p>
                  <p>
                    <strong>Parabola Opens:</strong> {results.opens}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center text-primary-600 hover:text-primary-800 focus:outline-none"
              >
                <FaInfoCircle className="mr-1" />
                {showSteps ? 'Hide Solution Steps' : 'Show Solution Steps'}
              </button>
            </div>
            
            {showSteps && (
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h3 className="text-md font-medium text-gray-800 mb-4">Step-by-Step Solution:</h3>
                
                <div className="space-y-6">
                  {results.steps.map((step, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-4">
                      <h4 className="font-semibold text-primary-700 mb-1">
                        Step {step.step}: {step.description}
                      </h4>
                      
                      {step.equation && (
                        <div className="my-2 font-medium">{step.equation}</div>
                      )}
                      
                      {step.note && (
                        <div className="text-sm text-gray-600 my-2">{step.note}</div>
                      )}
                      
                      {step.calculation && (
                        <div className="bg-white p-3 rounded my-2">
                          {Array.isArray(step.calculation) ? (
                            <div className="space-y-1">
                              {step.calculation.map((line, i) => (
                                <div key={i} className={line === '' ? 'h-2' : ''}>{line}</div>
                              ))}
                            </div>
                          ) : (
                            <div>{step.calculation}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Quadratic Equations</h2>
          <div className="space-y-2">
            <p>
              A quadratic equation is a second-degree polynomial equation in a single variable x, where a, b, and c are constants and a ≠ 0:
            </p>
            <p className="font-medium text-center my-2">
              ax² + bx + c = 0
            </p>
            
            <p>
              <strong>Key concepts:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Discriminant (Δ = b² - 4ac):</strong> Determines the nature of the roots:
                <ul className="list-disc pl-5 mt-1">
                  <li>If Δ &gt; 0: Two distinct real roots</li>
                  <li>If Δ = 0: One repeated real root (double root)</li>
                  <li>If Δ &lt; 0: Two complex conjugate roots</li>
                </ul>
              </li>
              <li><strong>Quadratic Formula:</strong> x = (-b ± √(b² - 4ac)) / (2a)</li>
              <li><strong>Vertex Form:</strong> a(x - h)² + k, where (h, k) is the vertex</li>
              <li><strong>Vertex:</strong> The highest or lowest point of the parabola at x = -b/(2a)</li>
              <li><strong>Axis of Symmetry:</strong> A vertical line passing through the vertex</li>
            </ul>
            
            <p>
              <strong>Applications:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Physics (projectile motion, free fall)</li>
              <li>Economics (profit optimization, supply-demand models)</li>
              <li>Engineering (structural design, electrical circuits)</li>
              <li>Computer graphics (parabolic curves, animations)</li>
              <li>Finance (break-even analysis, compound interest)</li>
            </ul>
            
            <p>
              Quadratic equations can be solved using various methods including factoring, completing the square, and the quadratic formula. The quadratic formula is the most general method that works for all quadratic equations.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default QuadraticEquationSolver;
