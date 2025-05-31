import React, { useState } from 'react';
import { FaCalculator, FaRedo, FaPlus, FaMinus, FaTimes, FaEquals, FaExchangeAlt } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const MatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);
  const [matrixB, setMatrixB] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);
  const [matrixASizeRows, setMatrixASizeRows] = useState(3);
  const [matrixASizeCols, setMatrixASizeCols] = useState(3);
  const [matrixBSizeRows, setMatrixBSizeRows] = useState(3);
  const [matrixBSizeCols, setMatrixBSizeCols] = useState(3);
  const [operation, setOperation] = useState('add');
  const [scalar, setScalar] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Initialize or resize a matrix
  const initializeMatrix = (rows, cols, currentMatrix = null) => {
    const newMatrix = [];
    for (let i = 0; i < rows; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < cols; j++) {
        // Preserve existing values when resizing
        newMatrix[i][j] = currentMatrix && i < currentMatrix.length && j < currentMatrix[i].length 
          ? currentMatrix[i][j] 
          : 0;
      }
    }
    return newMatrix;
  };

  // Handle matrix size changes
  const handleMatrixASizeChange = (rows, cols) => {
    setMatrixASizeRows(rows);
    setMatrixASizeCols(cols);
    setMatrixA(initializeMatrix(rows, cols, matrixA));
    setResult(null);
  };

  const handleMatrixBSizeChange = (rows, cols) => {
    setMatrixBSizeRows(rows);
    setMatrixBSizeCols(cols);
    setMatrixB(initializeMatrix(rows, cols, matrixB));
    setResult(null);
  };

  // Handle matrix cell value changes
  const handleMatrixAChange = (row, col, value) => {
    const newValue = value === '' ? 0 : parseFloat(value);
    const newMatrix = [...matrixA];
    newMatrix[row][col] = isNaN(newValue) ? 0 : newValue;
    setMatrixA(newMatrix);
    setResult(null);
  };

  const handleMatrixBChange = (row, col, value) => {
    const newValue = value === '' ? 0 : parseFloat(value);
    const newMatrix = [...matrixB];
    newMatrix[row][col] = isNaN(newValue) ? 0 : newValue;
    setMatrixB(newMatrix);
    setResult(null);
  };

  // Matrix operations
  const addMatrices = (a, b) => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrices must have the same dimensions for addition');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < a[0].length; j++) {
        result[i][j] = a[i][j] + b[i][j];
      }
    }
    return result;
  };

  const subtractMatrices = (a, b) => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrices must have the same dimensions for subtraction');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < a[0].length; j++) {
        result[i][j] = a[i][j] - b[i][j];
      }
    }
    return result;
  };

  const multiplyMatrices = (a, b) => {
    if (a[0].length !== b.length) {
      throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        result[i][j] = 0;
        for (let k = 0; k < a[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  };

  const multiplyByScalar = (matrix, scalar) => {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrix[0].length; j++) {
        result[i][j] = matrix[i][j] * scalar;
      }
    }
    return result;
  };

  const transposeMatrix = (matrix) => {
    const result = [];
    for (let j = 0; j < matrix[0].length; j++) {
      result[j] = [];
      for (let i = 0; i < matrix.length; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  };

  // Calculate determinant using recursive method
  const calculateDeterminant = (matrix) => {
    // Base case for 1x1 matrix
    if (matrix.length === 1) {
      return matrix[0][0];
    }
    
    // Base case for 2x2 matrix
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let determinant = 0;
    for (let j = 0; j < matrix.length; j++) {
      // Create submatrix by excluding first row and current column
      const subMatrix = [];
      for (let i = 1; i < matrix.length; i++) {
        subMatrix[i-1] = [];
        for (let k = 0; k < matrix.length; k++) {
          if (k !== j) {
            subMatrix[i-1].push(matrix[i][k]);
          }
        }
      }
      
      // Add or subtract the determinant of the submatrix
      const sign = j % 2 === 0 ? 1 : -1;
      determinant += sign * matrix[0][j] * calculateDeterminant(subMatrix);
    }
    
    return determinant;
  };

  // Calculate matrix of cofactors
  const calculateCofactorMatrix = (matrix) => {
    const cofactorMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
      cofactorMatrix[i] = [];
      for (let j = 0; j < matrix.length; j++) {
        // Create submatrix by excluding current row and column
        const subMatrix = [];
        for (let r = 0; r < matrix.length; r++) {
          if (r !== i) {
            const row = [];
            for (let c = 0; c < matrix.length; c++) {
              if (c !== j) {
                row.push(matrix[r][c]);
              }
            }
            subMatrix.push(row);
          }
        }
        
        // Calculate minor and apply sign
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        cofactorMatrix[i][j] = sign * calculateDeterminant(subMatrix);
      }
    }
    return cofactorMatrix;
  };

  // Calculate inverse of matrix
  const calculateInverse = (matrix) => {
    if (matrix.length !== matrix[0].length) {
      throw new Error('Matrix must be square to have an inverse');
    }
    
    const determinant = calculateDeterminant(matrix);
    
    if (Math.abs(determinant) < 1e-10) {
      throw new Error('Matrix is singular (determinant is zero), inverse does not exist');
    }
    
    // For 1x1 matrix
    if (matrix.length === 1) {
      return [[1 / matrix[0][0]]];
    }
    
    // Calculate cofactor matrix
    const cofactorMatrix = calculateCofactorMatrix(matrix);
    
    // Transpose cofactor matrix to get adjugate
    const adjugate = transposeMatrix(cofactorMatrix);
    
    // Divide adjugate by determinant
    const inverse = [];
    for (let i = 0; i < adjugate.length; i++) {
      inverse[i] = [];
      for (let j = 0; j < adjugate[0].length; j++) {
        inverse[i][j] = adjugate[i][j] / determinant;
      }
    }
    
    return inverse;
  };

  // Perform the selected operation
  const performOperation = () => {
    setError('');
    try {
      let resultMatrix = null;
      
      switch (operation) {
        case 'add':
          resultMatrix = addMatrices(matrixA, matrixB);
          break;
        case 'subtract':
          resultMatrix = subtractMatrices(matrixA, matrixB);
          break;
        case 'multiply':
          resultMatrix = multiplyMatrices(matrixA, matrixB);
          break;
        case 'scalar':
          resultMatrix = multiplyByScalar(matrixA, scalar);
          break;
        case 'transpose':
          resultMatrix = transposeMatrix(matrixA);
          break;
        case 'determinant': {
          if (matrixASizeRows !== matrixASizeCols) {
            throw new Error('Matrix must be square to calculate determinant');
          }
          const det = calculateDeterminant(matrixA);
          setResult({ type: 'scalar', value: det });
          return;
        }
        case 'inverse':
          if (matrixASizeRows !== matrixASizeCols) {
            throw new Error('Matrix must be square to calculate inverse');
          }
          resultMatrix = calculateInverse(matrixA);
          break;
        default:
          throw new Error('Invalid operation');
      }
      
      setResult({ type: 'matrix', matrix: resultMatrix });
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset calculator
  const handleReset = () => {
    setMatrixA(initializeMatrix(3, 3));
    setMatrixB(initializeMatrix(3, 3));
    setMatrixASizeRows(3);
    setMatrixASizeCols(3);
    setMatrixBSizeRows(3);
    setMatrixBSizeCols(3);
    setOperation('add');
    setScalar(1);
    setResult(null);
    setError('');
  };

  // Render a matrix input
  const renderMatrixInput = (matrix, handleChange, rows, cols) => {
    return (
      <div className="overflow-x-auto">
        <table className="matrix-table">
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                {Array.from({ length: cols }, (_, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      value={matrix[i][j] || 0}
                      onChange={(e) => handleChange(i, j, e.target.value)}
                      className="w-14 h-10 text-center border border-gray-300 rounded"
                      step="any"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render a matrix display (for results)
  const renderMatrixDisplay = (matrix) => {
    return (
      <div className="overflow-x-auto">
        <table className="matrix-table">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td key={j} className="w-14 h-10 text-center border border-gray-300 rounded bg-gray-50">
                    {typeof value === 'number' && Math.abs(value) < 0.000001 ? '0' : value.toFixed(4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Matrix Calculator"
        description="Perform matrix operations including addition, subtraction, multiplication, determinant, inverse, and more."
        keywords="matrix calculator, matrix operations, determinant calculator, inverse matrix, matrix multiplication, linear algebra calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Matrix Calculator</h1>
        <p className="calculator-description">
          Perform matrix operations including addition, subtraction, multiplication, determinant, inverse, and more.
        </p>

        <AdBanner position="top" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matrix A */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Matrix A</h2>
              
              <div className="flex space-x-4 mb-4">
                <div>
                  <label htmlFor="matrixARows" className="block text-sm font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <select
                    id="matrixARows"
                    value={matrixASizeRows}
                    onChange={(e) => handleMatrixASizeChange(parseInt(e.target.value), matrixASizeCols)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="matrixACols" className="block text-sm font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <select
                    id="matrixACols"
                    value={matrixASizeCols}
                    onChange={(e) => handleMatrixASizeChange(matrixASizeRows, parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {renderMatrixInput(matrixA, handleMatrixAChange, matrixASizeRows, matrixASizeCols)}
            </div>
            
            {/* Matrix B */}
            <div className={operation === 'transpose' || operation === 'determinant' || operation === 'inverse' ? 'opacity-50' : ''}>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Matrix B</h2>
              
              <div className="flex space-x-4 mb-4">
                <div>
                  <label htmlFor="matrixBRows" className="block text-sm font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <select
                    id="matrixBRows"
                    value={matrixBSizeRows}
                    onChange={(e) => handleMatrixBSizeChange(parseInt(e.target.value), matrixBSizeCols)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled={operation === 'transpose' || operation === 'determinant' || operation === 'inverse'}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="matrixBCols" className="block text-sm font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <select
                    id="matrixBCols"
                    value={matrixBSizeCols}
                    onChange={(e) => handleMatrixBSizeChange(matrixBSizeRows, parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled={operation === 'transpose' || operation === 'determinant' || operation === 'inverse'}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {renderMatrixInput(
                matrixB, 
                handleMatrixBChange, 
                matrixBSizeRows, 
                matrixBSizeCols
              )}
            </div>
          </div>
          
          {/* Operation Selection */}
          <div className="mt-6 mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Operation</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setOperation('add')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'add'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaPlus className="mr-1" /> Addition
              </button>
              
              <button
                onClick={() => setOperation('subtract')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'subtract'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaMinus className="mr-1" /> Subtraction
              </button>
              
              <button
                onClick={() => setOperation('multiply')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'multiply'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaTimes className="mr-1" /> Multiplication
              </button>
              
              <button
                onClick={() => setOperation('scalar')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'scalar'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaTimes className="mr-1" /> Scalar Mult.
              </button>
              
              <button
                onClick={() => setOperation('transpose')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'transpose'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaExchangeAlt className="mr-1" /> Transpose
              </button>
              
              <button
                onClick={() => setOperation('determinant')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'determinant'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                det(A)
              </button>
              
              <button
                onClick={() => setOperation('inverse')}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${
                  operation === 'inverse'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                A<sup>-1</sup>
              </button>
            </div>
            
            {operation === 'scalar' && (
              <div className="mt-4">
                <label htmlFor="scalar" className="block text-sm font-medium text-gray-700 mb-1">
                  Scalar Value
                </label>
                <input
                  type="number"
                  id="scalar"
                  value={scalar}
                  onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  step="any"
                />
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 mt-6">
            <button
              onClick={performOperation}
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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            
            {result.type === 'matrix' ? (
              <div>
                <div className="flex justify-center">
                  {renderMatrixDisplay(result.matrix)}
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>Matrix dimensions: {result.matrix.length} × {result.matrix[0].length}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-lg font-medium mb-2">
                  {operation === 'determinant' ? 'Determinant:' : 'Result:'}
                </p>
                <p className="text-2xl font-bold text-primary-700">
                  {result.value.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">About Matrix Operations</h2>
          <div className="space-y-2">
            <p>
              Matrices are rectangular arrays of numbers arranged in rows and columns. They are fundamental in linear algebra and have applications in various fields including computer graphics, physics, engineering, and data science.
            </p>
            
            <p>
              <strong>Basic matrix operations:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Addition/Subtraction:</strong> Matrices must have the same dimensions. Add/subtract corresponding elements.</li>
              <li><strong>Multiplication:</strong> For matrices A(m×n) and B(n×p), the product AB is an m×p matrix. The number of columns in A must equal the number of rows in B.</li>
              <li><strong>Scalar Multiplication:</strong> Multiply each element of the matrix by the scalar value.</li>
              <li><strong>Transpose:</strong> Flip a matrix over its diagonal, switching rows and columns.</li>
              <li><strong>Determinant:</strong> A scalar value calculated from a square matrix, useful for finding inverses and solving systems of equations.</li>
              <li><strong>Inverse:</strong> For a square matrix A, the inverse A<sup>-1</sup> satisfies A·A<sup>-1</sup> = A<sup>-1</sup>·A = I (identity matrix). Only non-singular matrices (det(A) ≠ 0) have inverses.</li>
            </ul>
            
            <p>
              <strong>Applications of matrices:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Solving systems of linear equations</li>
              <li>Computer graphics and 3D transformations</li>
              <li>Network analysis and graph theory</li>
              <li>Quantum mechanics and physics simulations</li>
              <li>Data science and machine learning algorithms</li>
              <li>Economic models and game theory</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
      
      <style jsx>{`
        .matrix-table {
          border-collapse: separate;
          border-spacing: 4px;
        }
      `}</style>
    </>
  );
};

export default MatrixCalculator;
