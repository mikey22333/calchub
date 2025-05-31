import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [calculators, setCalculators] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // List of all calculators with their paths and categories
  useEffect(() => {
    // This could be fetched from an API or central store in a real app
    const allCalculators = [
      // Basic & Scientific
      { name: 'Basic Calculator', path: '/basic-calculator', category: 'Basic & Scientific' },
      { name: 'Scientific Calculator', path: '/scientific-calculator', category: 'Basic & Scientific' },
      { name: 'Fraction Calculator', path: '/fraction-calculator', category: 'Basic & Scientific' },
      { name: 'Equation Solver', path: '/equation-solver', category: 'Basic & Scientific' },
      
      // Finance & Business
      { name: 'Loan Calculator', path: '/loan-calculator', category: 'Finance & Business' },
      { name: 'Compound Interest Calculator', path: '/compound-interest-calculator', category: 'Finance & Business' },
      { name: 'Interest Calculator', path: '/interest-calculator', category: 'Finance & Business' },
      { name: 'Tax Calculator', path: '/tax-calculator', category: 'Finance & Business' },
      { name: 'Investment Calculator', path: '/investment-calculator', category: 'Finance & Business' },
      { name: 'Discount Calculator', path: '/discount-calculator', category: 'Finance & Business' },
      { name: 'Tip Calculator', path: '/tip-calculator', category: 'Finance & Business' },
      { name: 'Mortgage Calculator', path: '/mortgage-calculator', category: 'Finance & Business' },
      
      // Math Tools
      { name: 'Percentage Calculator', path: '/percentage-calculator', category: 'Math Tools' },
      { name: 'Ratio Calculator', path: '/ratio-calculator', category: 'Math Tools' },
      { name: 'Average Calculator', path: '/average-calculator', category: 'Math Tools' },
      { name: 'Geometric Calculator', path: '/geometric-calculator', category: 'Math Tools' },
      
      // Health & Fitness
      { name: 'BMI Calculator', path: '/bmi-calculator', category: 'Health & Fitness' },
      { name: 'BMR Calculator', path: '/bmr-calculator', category: 'Health & Fitness' },
      { name: 'Body Fat Calculator', path: '/body-fat-calculator', category: 'Health & Fitness' },
      { name: 'Calorie Calculator', path: '/calorie-calculator', category: 'Health & Fitness' },
      
      // Fun & Utility
      { name: 'Random Number Generator', path: '/random-number-generator', category: 'Fun & Utility' },
      
      // Date & Time
      { name: 'Age Calculator', path: '/age-calculator', category: 'Date & Time' },
      
      // Unit & Measurement
      { name: 'Unit Converter', path: '/unit-converter', category: 'Unit & Measurement' },
      
      // Education
      { name: 'GPA Calculator', path: '/gpa-calculator', category: 'Education' },
      { name: 'Grade Calculator', path: '/grade-calculator', category: 'Education' },
      { name: 'Study Time Calculator', path: '/study-time-calculator', category: 'Education' },
      
      // Stats & Data
      { name: 'Statistical Calculator', path: '/statistical-calculator', category: 'Stats & Data' },
      { name: 'Probability Calculator', path: '/probability-calculator', category: 'Stats & Data' },

      // Home & DIY
      { name: 'Paint Calculator', path: '/paint-calculator', category: 'Home & DIY' },
    ];
    
    setCalculators(allCalculators);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter calculators based on search term
    const filtered = calculators.filter(calculator => 
      calculator.name.toLowerCase().includes(value.toLowerCase()) ||
      calculator.category.toLowerCase().includes(value.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  // Handle clicking outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchResults.length > 0) {
      // Navigate to the first result
      navigate(searchResults[0].path);
      setSearchTerm('');
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  // Navigate to calculator page when a result is clicked
  const handleResultClick = (path) => {
    navigate(path);
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  // Toggle search bar on mobile
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('calculator-search').focus();
      }, 100);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Desktop search */}
      <div className="hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            id="calculator-search-desktop"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-48 pl-9 pr-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            onFocus={() => setIsSearchOpen(true)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              <FaTimes />
            </button>
          )}
        </form>
        
        {/* Search results dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            <ul className="py-1">
              {searchResults.map((result, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleResultClick(result.path)}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center justify-between text-sm"
                  >
                    <span className="text-primary-600 font-medium">{result.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full ml-2">
                      {result.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Mobile search button and expanded search */}
      <div className="md:hidden">
        <button
          onClick={toggleSearch}
          className="p-1.5 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
          aria-label="Search calculators"
        >
          {isSearchOpen ? <FaTimes className="text-sm" /> : <FaSearch className="text-sm" />}
        </button>
        
        {isSearchOpen && (
          <div className="absolute top-full right-0 mt-1 w-screen px-4 z-50">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="calculator-search"
                type="text"
                placeholder="Search calculators..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  <FaTimes />
                </button>
              )}
            </form>
            
            {/* Mobile search results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg mt-1 max-h-80 overflow-y-auto">
                <ul className="py-2">
                  {searchResults.map((result, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleResultClick(result.path)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span className="text-primary-600 font-medium">{result.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {result.category}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
