import { useState } from 'react';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const RandomGenerator = () => {
  const [generatorType, setGeneratorType] = useState('number');
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const generate = () => {
    let generatedResult;
    
    switch (generatorType) {
      case 'number':
        generatedResult = generateRandomNumbers();
        break;
      case 'password':
        generatedResult = generatePassword();
        break;
      case 'dice':
        generatedResult = rollDice();
        break;
      default:
        generatedResult = null;
    }
    
    setResult(generatedResult);
    
    // Add to history
    if (generatedResult) {
      const newHistoryItem = {
        id: Date.now(),
        type: generatorType,
        result: generatedResult,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory([newHistoryItem, ...history.slice(0, 9)]);
    }
  };

  const generateRandomNumbers = () => {
    const min = parseInt(minNumber);
    const max = parseInt(maxNumber);
    const qty = parseInt(quantity);
    
    if (isNaN(min) || isNaN(max) || isNaN(qty) || min > max || qty < 1) {
      alert('Please enter valid values');
      return null;
    }
    
    if (!allowDuplicates && (max - min + 1) < qty) {
      alert(`Cannot generate ${qty} unique numbers in the range ${min}-${max}`);
      return null;
    }
    
    let numbers = [];
    
    if (allowDuplicates) {
      for (let i = 0; i < qty; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    } else {
      // Fisher-Yates shuffle algorithm for unique numbers
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      numbers = pool.slice(0, qty);
    }
    
    return numbers;
  };

  const generatePassword = () => {
    const length = parseInt(passwordLength);
    
    if (isNaN(length) || length < 1) {
      alert('Please enter a valid password length');
      return null;
    }
    
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      alert('Please select at least one character type');
      return null;
    }
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  };

  const rollDice = () => {
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    
    if (isNaN(count) || isNaN(sides) || count < 1 || sides < 1) {
      alert('Please enter valid dice count and sides');
      return null;
    }
    
    let rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    return { rolls, total };
  };

  const handleReset = () => {
    setResult(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <>
      <SEO 
        title="Random Generator" 
        description="Generate random numbers, passwords, and dice rolls with this versatile random generator tool."
        keywords="random number generator, password generator, dice roller, random generator"
      />
      
      <div className="calculator-container">
        <h1 className="calculator-title">Random Generator</h1>
        <p className="calculator-description">
          Generate random numbers, secure passwords, and dice rolls with this versatile random generator tool.
        </p>

        <div className="mb-6">
          <div className="input-group">
            <label className="input-label">Generator Type</label>
            <select
              value={generatorType}
              onChange={(e) => setGeneratorType(e.target.value)}
              className="input-field"
            >
              <option value="number">Random Numbers</option>
              <option value="password">Password Generator</option>
              <option value="dice">Dice Roller</option>
            </select>
          </div>

          {generatorType === 'number' && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label htmlFor="minNumber" className="input-label">Minimum Value</label>
                  <input
                    type="number"
                    id="minNumber"
                    value={minNumber}
                    onChange={(e) => setMinNumber(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="maxNumber" className="input-label">Maximum Value</label>
                  <input
                    type="number"
                    id="maxNumber"
                    value={maxNumber}
                    onChange={(e) => setMaxNumber(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="quantity" className="input-label">How many numbers?</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input-field"
                  min="1"
                  max="100"
                />
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="allowDuplicates"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="allowDuplicates" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Allow duplicate numbers
                </label>
              </div>
            </div>
          )}

          {generatorType === 'password' && (
            <div className="mt-4">
              <div className="input-group">
                <label htmlFor="passwordLength" className="input-label">Password Length</label>
                <input
                  type="number"
                  id="passwordLength"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(e.target.value)}
                  className="input-field"
                  min="4"
                  max="64"
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeUppercase"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeUppercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Include uppercase letters (A-Z)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeLowercase"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeLowercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Include lowercase letters (a-z)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeNumbers"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeNumbers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Include numbers (0-9)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeSymbols"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeSymbols" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Include symbols (!@#$%^&*...)
                  </label>
                </div>
              </div>
            </div>
          )}

          {generatorType === 'dice' && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label htmlFor="diceCount" className="input-label">Number of Dice</label>
                  <input
                    type="number"
                    id="diceCount"
                    value={diceCount}
                    onChange={(e) => setDiceCount(e.target.value)}
                    className="input-field"
                    min="1"
                    max="10"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="diceSides" className="input-label">Sides per Die</label>
                  <input
                    type="number"
                    id="diceSides"
                    value={diceSides}
                    onChange={(e) => setDiceSides(e.target.value)}
                    className="input-field"
                    min="2"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button className="btn-primary" onClick={generate}>
              Generate
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <AdBanner position="middle" />

        {result && (
          <div className="result-container">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            
            {generatorType === 'number' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">
                  {result.length > 1 ? 'Random Numbers' : 'Random Number'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.map((num, index) => (
                    <span key={index} className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {generatorType === 'password' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Generated Password</p>
                <div className="flex items-center">
                  <code className="block p-3 bg-gray-100 rounded font-mono text-lg break-all">
                    {result}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert('Password copied to clipboard!');
                    }}
                    className="ml-3 p-2 text-gray-500 hover:text-primary-600"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Password strength: {
                    passwordLength >= 12 && includeUppercase && includeLowercase && includeNumbers && includeSymbols
                      ? 'Very Strong'
                      : passwordLength >= 8 && ((includeUppercase && includeLowercase && includeNumbers) || includeSymbols)
                        ? 'Strong'
                        : passwordLength >= 6 && ((includeUppercase || includeLowercase) && (includeNumbers || includeSymbols))
                          ? 'Medium'
                          : 'Weak'
                  }
                </p>
              </div>
            )}
            
            {generatorType === 'dice' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      {diceCount > 1 ? `${diceCount} Dice (${diceSides}-sided)` : `1 Die (${diceSides}-sided)`}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.rolls.map((roll, index) => (
                        <span key={index} className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-800 rounded-lg font-bold text-lg">
                          {roll}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 text-center">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-3xl font-bold text-primary-600">{result.total}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {history.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">History</h3>
              <button 
                onClick={clearHistory}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear History
              </button>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
                        {item.type === 'number' ? 'Random Numbers' : 
                         item.type === 'password' ? 'Password' : 
                         'Dice Roll'}
                      </p>
                      <div className="mt-1">
                        {item.type === 'number' && (
                          <div className="flex flex-wrap gap-1">
                            {item.result.map((num, index) => (
                              <span key={index} className="inline-block px-2 py-0.5 text-xs bg-primary-50 text-primary-800 rounded-full">
                                {num}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.type === 'password' && (
                          <code className="text-xs break-all">{item.result}</code>
                        )}
                        {item.type === 'dice' && (
                          <p className="text-sm">
                            {item.result.rolls.join(', ')} = {item.result.total}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RandomGenerator;
