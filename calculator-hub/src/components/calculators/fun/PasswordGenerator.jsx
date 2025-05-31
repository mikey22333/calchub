import React, { useState, useRef } from 'react';
import { FaKey, FaRandom, FaCopy, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const passwordRef = useRef(null);

  const generatePassword = () => {
    setError('');
    setCopied(false);

    // Check if at least one character set is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      setError('Please select at least one character set');
      return;
    }

    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Remove similar characters if option is selected
    const similarChars = 'iIlL1oO0';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
    
    let availableChars = '';
    
    if (includeUppercase) {
      availableChars += excludeSimilar ? uppercaseChars.replace(/[iIlLoO]/g, '') : uppercaseChars;
    }
    
    if (includeLowercase) {
      availableChars += excludeSimilar ? lowercaseChars.replace(/[iIlLoO]/g, '') : lowercaseChars;
    }
    
    if (includeNumbers) {
      availableChars += excludeSimilar ? numberChars.replace(/[10]/g, '') : numberChars;
    }
    
    if (includeSymbols) {
      let symbols = symbolChars;
      if (avoidAmbiguous) {
        symbols = symbols.split('').filter(char => !ambiguousChars.includes(char)).join('');
      }
      availableChars += symbols;
    }
    
    if (availableChars.length === 0) {
      setError('No characters available with current settings');
      return;
    }
    
    // Generate password
    let newPassword = '';
    let hasUpper = !includeUppercase;
    let hasLower = !includeLowercase;
    let hasNumber = !includeNumbers;
    let hasSymbol = !includeSymbols;
    
    // First, ensure we have at least one character from each selected set
    if (includeUppercase) {
      const validChars = excludeSimilar ? uppercaseChars.replace(/[iIlLoO]/g, '') : uppercaseChars;
      newPassword += validChars.charAt(Math.floor(Math.random() * validChars.length));
      hasUpper = true;
    }
    
    if (includeLowercase) {
      const validChars = excludeSimilar ? lowercaseChars.replace(/[iIlLoO]/g, '') : lowercaseChars;
      newPassword += validChars.charAt(Math.floor(Math.random() * validChars.length));
      hasLower = true;
    }
    
    if (includeNumbers) {
      const validChars = excludeSimilar ? numberChars.replace(/[10]/g, '') : numberChars;
      newPassword += validChars.charAt(Math.floor(Math.random() * validChars.length));
      hasNumber = true;
    }
    
    if (includeSymbols) {
      let validChars = symbolChars;
      if (avoidAmbiguous) {
        validChars = validChars.split('').filter(char => !ambiguousChars.includes(char)).join('');
      }
      newPassword += validChars.charAt(Math.floor(Math.random() * validChars.length));
      hasSymbol = true;
    }
    
    // Fill the rest of the password
    while (newPassword.length < passwordLength) {
      const randomChar = availableChars.charAt(Math.floor(Math.random() * availableChars.length));
      newPassword += randomChar;
    }
    
    // Shuffle the password to ensure randomness
    newPassword = shuffleString(newPassword);
    
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };
  
  const shuffleString = (str) => {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  };
  
  const calculatePasswordStrength = (pass) => {
    // Basic password strength calculation
    let strength = 0;
    
    // Length contribution (up to 40%)
    strength += Math.min(40, pass.length * 2);
    
    // Character variety contribution (up to 60%)
    if (/[A-Z]/.test(pass)) strength += 15;
    if (/[a-z]/.test(pass)) strength += 15;
    if (/[0-9]/.test(pass)) strength += 15;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 15;
    
    setPasswordStrength(strength);
  };
  
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Moderate';
    return 'Strong';
  };

  return (
    <>
      <SEO
        title="Password Generator"
        description="Generate secure, random passwords with customizable options for length and character types."
        keywords="password generator, secure password, random password, strong password, password creator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Password Generator</h1>
        <p className="calculator-description">
          Create strong, secure passwords with customizable options for length and character types.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-lg font-mono"
                placeholder="Your password will appear here"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-2 bg-gray-200 border border-gray-300 text-gray-700"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition duration-150 ease-in-out"
                title="Copy to clipboard"
              >
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            
            {password && (
              <div className="mt-3">
                <div className="flex items-center mb-1">
                  <div className="text-sm font-medium mr-2">Strength:</div>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm font-medium">{getStrengthLabel()}</div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="passwordLength" className="block text-sm font-medium text-gray-700 mb-1">
              Password Length: {passwordLength} characters
            </label>
            <div className="flex items-center">
              <span className="mr-2 text-sm">8</span>
              <input
                type="range"
                id="passwordLength"
                min="8"
                max="64"
                value={passwordLength}
                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                className="flex-grow h-2 bg-gray-200 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm">64</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">Character Sets</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Uppercase (A-Z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lowercase (a-z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Numbers (0-9)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Symbols (!@#$%^&*)</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">Advanced Options</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Exclude similar characters (i, l, 1, L, o, 0, O)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={avoidAmbiguous}
                    onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Avoid ambiguous symbols ({'{}'} [']'] (')')/ \ ' " ` ~ , ; : . {'<'} {'>'})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={generatePassword}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaRandom className="mr-2" /> Generate Password
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Password Security Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Use a different password for each account</li>
            <li>Aim for at least 12 characters for better security</li>
            <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>Consider using a password manager to store your passwords securely</li>
            <li>Change your passwords regularly, especially for important accounts</li>
            <li>Never share your passwords with others</li>
          </ul>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default PasswordGenerator;
