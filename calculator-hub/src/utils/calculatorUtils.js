/**
 * Common utility functions for calculator components
 */

/**
 * Formats a number with commas as thousands separators
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a currency value
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

/**
 * Validates if a value is a valid number
 * @param {any} value - The value to check
 * @returns {boolean} True if valid number, false otherwise
 */
export const isValidNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  
  const number = parseFloat(value);
  return !isNaN(number) && isFinite(number);
};

/**
 * Clamps a number between min and max values
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Converts a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {Object} conversionRates - Object containing conversion rates
 * @returns {number} Converted value
 */
export const convertUnit = (value, fromUnit, toUnit, conversionRates) => {
  if (fromUnit === toUnit) {
    return value;
  }
  
  const baseValue = value * (conversionRates[fromUnit] || 1);
  return baseValue / (conversionRates[toUnit] || 1);
};

/**
 * Calculates percentage of a value
 * @param {number} percent - The percentage
 * @param {number} value - The value
 * @returns {number} Result of percentage calculation
 */
export const calculatePercentage = (percent, value) => {
  return (percent / 100) * value;
};

/**
 * Calculates what percentage one value is of another
 * @param {number} part - The part value
 * @param {number} whole - The whole value
 * @returns {number} Percentage result
 */
export const calculatePercentageOf = (part, whole) => {
  if (whole === 0) {
    return 0;
  }
  return (part / whole) * 100;
};

/**
 * Rounds a number to specified decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export const roundToDecimals = (value, decimals = 2) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};
