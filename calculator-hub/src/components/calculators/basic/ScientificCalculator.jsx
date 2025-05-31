import { useState } from 'react';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState(0);
  const [isRadianMode, setIsRadianMode] = useState(true);
  const [isInvMode, setIsInvMode] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [prevVal, setPrevVal] = useState(null);
  const [operator, setOperator] = useState(null);

  // Convert degrees to radians
  const toRadians = (degrees) => {
    return isRadianMode ? degrees : (degrees * Math.PI / 180);
  };

  // Convert radians to degrees
  const fromRadians = (radians) => {
    return isRadianMode ? radians : (radians * 180 / Math.PI);
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperator(null);
    setWaitingForOperand(false);
    setEquation('');
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputValue);
    } else if (operator) {
      const currentVal = prevVal || 0;
      let newVal = 0;

      switch (operator) {
        case '+':
          newVal = currentVal + inputValue;
          break;
        case '-':
          newVal = currentVal - inputValue;
          break;
        case '*':
          newVal = currentVal * inputValue;
          break;
        case '/':
          newVal = currentVal / inputValue;
          break;
        case '^':
          newVal = Math.pow(currentVal, inputValue);
          break;
        default:
          break;
      }

      setEquation(`${equation} ${display} ${nextOperator === '=' ? '' : nextOperator}`);
      setPrevVal(newVal);
      setDisplay(String(newVal));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  const performUnaryOperation = (operation) => {
    const currentValue = parseFloat(display);
    let newValue = 0;

    switch (operation) {
      case 'sqrt':
        newValue = Math.sqrt(currentValue);
        break;
      case 'square':
        newValue = Math.pow(currentValue, 2);
        break;
      case 'cube':
        newValue = Math.pow(currentValue, 3);
        break;
      case 'reciprocal':
        newValue = 1 / currentValue;
        break;
      case 'factorial':
        newValue = factorial(currentValue);
        break;
      case 'sin':
        newValue = isInvMode ? fromRadians(Math.asin(currentValue)) : Math.sin(toRadians(currentValue));
        break;
      case 'cos':
        newValue = isInvMode ? fromRadians(Math.acos(currentValue)) : Math.cos(toRadians(currentValue));
        break;
      case 'tan':
        newValue = isInvMode ? fromRadians(Math.atan(currentValue)) : Math.tan(toRadians(currentValue));
        break;
      case 'ln':
        newValue = isInvMode ? Math.exp(currentValue) : Math.log(currentValue);
        break;
      case 'log':
        newValue = isInvMode ? Math.pow(10, currentValue) : Math.log10(currentValue);
        break;
      default:
        return;
    }

    setDisplay(String(newValue));
    setWaitingForOperand(true);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleMemoryOperation = (operation) => {
    const currentValue = parseFloat(display);
    
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
      default:
        break;
    }
  };

  const handleBackspace = () => {
    if (display !== '0') {
      setDisplay(display.substring(0, display.length - 1) || '0');
    }
  };

  const handleConstant = (constant) => {
    switch (constant) {
      case 'pi':
        setDisplay(String(Math.PI));
        break;
      case 'e':
        setDisplay(String(Math.E));
        break;
      default:
        break;
    }
    setWaitingForOperand(true);
  };

  const toggleMode = () => {
    setIsRadianMode(!isRadianMode);
  };

  const toggleInv = () => {
    setIsInvMode(!isInvMode);
  };

  // Button styles
  const numberButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const operatorButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#dbeafe',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const functionButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const memoryButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#e0f2fe',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const controlButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const equalButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#0284c7',
    color: 'white',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const toggleButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: isInvMode ? '#bae6fd' : '#f1f5f9',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const modeButtonStyle = {
    padding: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Scientific Calculator</h1>
      <p className="calculator-description">
        Advanced calculator with scientific functions like trigonometry, logarithms, and more.
      </p>

      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        backgroundColor: '#f8fafc',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b',
            minHeight: '1.25rem',
            textAlign: 'right',
            marginBottom: '0.25rem',
            fontFamily: 'monospace',
          }}>
            {equation}
          </div>
          <div style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'right',
            color: '#0f172a',
            fontFamily: 'monospace',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {display}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#64748b',
          }}>
            <span>{isRadianMode ? 'RAD' : 'DEG'}</span>
            <span>{isInvMode ? 'INV' : ''}</span>
            <span>{memory !== 0 ? 'M' : ''}</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1px',
          backgroundColor: '#e5e7eb',
        }}>
          {/* First Row */}
          <button 
            onClick={toggleMode}
            style={modeButtonStyle}
          >
            {isRadianMode ? 'RAD' : 'DEG'}
          </button>
          <button 
            onClick={toggleInv}
            style={toggleButtonStyle}
          >
            INV
          </button>
          <button 
            onClick={() => handleConstant('pi')}
            style={functionButtonStyle}
          >
            π
          </button>
          <button 
            onClick={() => handleConstant('e')}
            style={functionButtonStyle}
          >
            e
          </button>
          <button 
            onClick={clearDisplay}
            style={controlButtonStyle}
          >
            C
          </button>

          {/* Second Row */}
          <button 
            onClick={() => performUnaryOperation('square')}
            style={functionButtonStyle}
          >
            x²
          </button>
          <button 
            onClick={() => performUnaryOperation('cube')}
            style={functionButtonStyle}
          >
            x³
          </button>
          <button 
            onClick={() => performOperation('^')}
            style={operatorButtonStyle}
          >
            xʸ
          </button>
          <button 
            onClick={() => performUnaryOperation('reciprocal')}
            style={functionButtonStyle}
          >
            1/x
          </button>
          <button 
            onClick={handleBackspace}
            style={controlButtonStyle}
          >
            ⌫
          </button>

          {/* Third Row */}
          <button 
            onClick={() => performUnaryOperation('sqrt')}
            style={functionButtonStyle}
          >
            √
          </button>
          <button 
            onClick={() => performUnaryOperation('factorial')}
            style={functionButtonStyle}
          >
            n!
          </button>
          <button 
            onClick={() => performUnaryOperation(isInvMode ? 'asin' : 'sin')}
            style={functionButtonStyle}
          >
            {isInvMode ? 'sin⁻¹' : 'sin'}
          </button>
          <button 
            onClick={() => performUnaryOperation(isInvMode ? 'acos' : 'cos')}
            style={functionButtonStyle}
          >
            {isInvMode ? 'cos⁻¹' : 'cos'}
          </button>
          <button 
            onClick={() => performUnaryOperation(isInvMode ? 'atan' : 'tan')}
            style={functionButtonStyle}
          >
            {isInvMode ? 'tan⁻¹' : 'tan'}
          </button>

          {/* Fourth Row */}
          <button 
            onClick={() => performUnaryOperation('log')}
            style={functionButtonStyle}
          >
            {isInvMode ? '10^x' : 'log'}
          </button>
          <button 
            onClick={() => performUnaryOperation('ln')}
            style={functionButtonStyle}
          >
            {isInvMode ? 'e^x' : 'ln'}
          </button>
          <button 
            onClick={() => inputDigit(7)}
            style={numberButtonStyle}
          >
            7
          </button>
          <button 
            onClick={() => inputDigit(8)}
            style={numberButtonStyle}
          >
            8
          </button>
          <button 
            onClick={() => inputDigit(9)}
            style={numberButtonStyle}
          >
            9
          </button>

          {/* Fifth Row */}
          <button 
            onClick={() => handleMemoryOperation('MC')}
            style={memoryButtonStyle}
          >
            MC
          </button>
          <button 
            onClick={() => handleMemoryOperation('MR')}
            style={memoryButtonStyle}
          >
            MR
          </button>
          <button 
            onClick={() => inputDigit(4)}
            style={numberButtonStyle}
          >
            4
          </button>
          <button 
            onClick={() => inputDigit(5)}
            style={numberButtonStyle}
          >
            5
          </button>
          <button 
            onClick={() => inputDigit(6)}
            style={numberButtonStyle}
          >
            6
          </button>

          {/* Sixth Row */}
          <button 
            onClick={() => handleMemoryOperation('M+')}
            style={memoryButtonStyle}
          >
            M+
          </button>
          <button 
            onClick={() => handleMemoryOperation('M-')}
            style={memoryButtonStyle}
          >
            M-
          </button>
          <button 
            onClick={() => inputDigit(1)}
            style={numberButtonStyle}
          >
            1
          </button>
          <button 
            onClick={() => inputDigit(2)}
            style={numberButtonStyle}
          >
            2
          </button>
          <button 
            onClick={() => inputDigit(3)}
            style={numberButtonStyle}
          >
            3
          </button>

          {/* Seventh Row */}
          <button 
            onClick={() => performOperation('/')}
            style={operatorButtonStyle}
          >
            ÷
          </button>
          <button 
            onClick={() => performOperation('*')}
            style={operatorButtonStyle}
          >
            ×
          </button>
          <button 
            onClick={() => inputDigit(0)}
            style={numberButtonStyle}
          >
            0
          </button>
          <button 
            onClick={inputDot}
            style={numberButtonStyle}
          >
            .
          </button>
          <button 
            onClick={toggleSign}
            style={numberButtonStyle}
          >
            ±
          </button>

          {/* Eighth Row */}
          <button 
            onClick={() => performOperation('-')}
            style={operatorButtonStyle}
          >
            -
          </button>
          <button 
            onClick={() => performOperation('+')}
            style={operatorButtonStyle}
          >
            +
          </button>
          <button 
            onClick={inputPercent}
            style={functionButtonStyle}
          >
            %
          </button>
          <button 
            onClick={() => performOperation('=')}
            style={{
              ...equalButtonStyle,
              gridColumn: 'span 2',
            }}
          >
            =
          </button>
        </div>
      </div>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>How to use:</h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
          <li>Use number buttons for input</li>
          <li>Toggle between Radians and Degrees with the RAD/DEG button</li>
          <li>Use INV to access inverse functions (sin⁻¹, cos⁻¹, etc.)</li>
          <li>Constants: π (Pi) and e (Euler's number)</li>
          <li>Memory functions: MC (Memory Clear), MR (Memory Recall), M+ (Memory Add), M- (Memory Subtract)</li>
        </ul>
      </div>
    </div>
  );
};

export default ScientificCalculator;
