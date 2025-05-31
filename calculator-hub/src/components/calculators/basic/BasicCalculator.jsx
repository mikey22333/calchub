import { useState } from 'react';

const BasicCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevVal, setPrevVal] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState(null);
  const [memory, setMemory] = useState(0);

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

  // Keyboard event handler for calculator - can be implemented in future updates
  const _handleKeyDown = (event) => {
    let { key } = event;

    if (key === 'Enter') key = '=';

    if (/\d/.test(key)) {
      event.preventDefault();
      inputDigit(parseInt(key, 10));
    } else if (key === '.') {
      event.preventDefault();
      inputDot();
    } else if (key === 'Backspace') {
      event.preventDefault();
      if (display !== '0') {
        setDisplay(display.substring(0, display.length - 1) || '0');
      }
    } else if (key === 'Clear' || key === 'Escape') {
      event.preventDefault();
      clearDisplay();
    } else if (key === '+/-') {
      event.preventDefault();
      toggleSign();
    } else if (key === '%') {
      event.preventDefault();
      inputPercent();
    } else if (['+', '-', '*', '/', '='].includes(key)) {
      event.preventDefault();
      performOperation(key);
    }
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

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Basic Calculator</h1>
      <p className="calculator-description">
        A simple calculator for basic arithmetic operations.
      </p>

      <div style={{
        maxWidth: '320px',
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
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          backgroundColor: '#e5e7eb',
        }}>
          {/* Memory Row */}
          <button 
            onClick={() => handleMemoryOperation('MC')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#e0f2fe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'}
          >
            MC
          </button>
          <button 
            onClick={() => handleMemoryOperation('MR')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#e0f2fe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'}
          >
            MR
          </button>
          <button 
            onClick={() => handleMemoryOperation('M+')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#e0f2fe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'}
          >
            M+
          </button>
          <button 
            onClick={() => handleMemoryOperation('M-')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#e0f2fe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'}
          >
            M-
          </button>

          {/* First Row */}
          <button 
            onClick={clearDisplay}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#fee2e2',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
          >
            C
          </button>
          <button 
            onClick={toggleSign}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          >
            +/-
          </button>
          <button 
            onClick={inputPercent}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          >
            %
          </button>
          <button 
            onClick={() => performOperation('/')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#dbeafe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
          >
            ÷
          </button>

          {/* Second Row */}
          <button 
            onClick={() => inputDigit(7)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            7
          </button>
          <button 
            onClick={() => inputDigit(8)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            8
          </button>
          <button 
            onClick={() => inputDigit(9)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            9
          </button>
          <button 
            onClick={() => performOperation('*')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#dbeafe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
          >
            ×
          </button>

          {/* Third Row */}
          <button 
            onClick={() => inputDigit(4)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            4
          </button>
          <button 
            onClick={() => inputDigit(5)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            5
          </button>
          <button 
            onClick={() => inputDigit(6)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            6
          </button>
          <button 
            onClick={() => performOperation('-')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#dbeafe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
          >
            -
          </button>

          {/* Fourth Row */}
          <button 
            onClick={() => inputDigit(1)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            1
          </button>
          <button 
            onClick={() => inputDigit(2)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            2
          </button>
          <button 
            onClick={() => inputDigit(3)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            3
          </button>
          <button 
            onClick={() => performOperation('+')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#dbeafe',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
          >
            +
          </button>

          {/* Fifth Row */}
          <button 
            onClick={handleBackspace}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          >
            ⌫
          </button>
          <button 
            onClick={() => inputDigit(0)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            0
          </button>
          <button 
            onClick={inputDot}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            .
          </button>
          <button 
            onClick={() => performOperation('=')}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#0284c7',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
          >
            =
          </button>
        </div>
      </div>

      <div className="calculator-description" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>How to use:</h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
          <li>Use the number buttons to input values</li>
          <li>Use the operation buttons (+, -, ×, ÷) to perform calculations</li>
          <li>Press = to see the result</li>
          <li>Use C to clear the calculator</li>
          <li>Memory functions: MC (Memory Clear), MR (Memory Recall), M+ (Memory Add), M- (Memory Subtract)</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicCalculator;
