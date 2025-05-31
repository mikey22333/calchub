import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaChartBar, FaPercent, FaCalendarAlt, FaRuler, FaGraduationCap, FaDice, FaHeart, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import SearchBar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Basic & Scientific', path: '/category/basic', icon: <FaCalculator className="text-primary-500" /> },
    { name: 'Finance & Business', path: '/category/finance', icon: <FaChartBar className="text-secondary-500" /> },
    { name: 'Math Tools', path: '/category/math', icon: <FaPercent className="text-accent-500" /> },
    { name: 'Unit & Measurement', path: '/category/unit', icon: <FaRuler className="text-primary-500" /> },
    { name: 'Health & Fitness', path: '/category/health', icon: <FaHeart className="text-secondary-500" /> },
    { name: 'Date & Time', path: '/category/date-time', icon: <FaCalendarAlt className="text-accent-500" /> },
    { name: 'Education', path: '/category/education', icon: <FaGraduationCap className="text-primary-500" /> },
    { name: 'Stats & Data', path: '/category/stats', icon: <FaChartBar className="text-secondary-500" /> },
    { name: 'Fun & Utility', path: '/category/fun', icon: <FaDice className="text-accent-500" /> },
  ];

  // Direct links to calculators
  const calculators = [
    { name: 'BMI Calculator', path: '/bmi-calculator' },
    { name: 'Loan Calculator', path: '/loan-calculator' },
    { name: 'Percentage Calculator', path: '/percentage-calculator' },
    { name: 'Age Calculator', path: '/age-calculator' },
    { name: 'Unit Converter', path: '/unit-converter' },
    { name: 'GPA Calculator', path: '/gpa-calculator' },
    { name: 'Basic Calculator', path: '/basic-calculator' },
    { name: 'Scientific Calculator', path: '/scientific-calculator' },
    { name: 'Statistical Calculator', path: '/statistical-calculator' },
    { name: 'Probability Calculator', path: '/probability-calculator' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full">
                  <span className="text-2xl">🧮</span>
                </div>
              </div>
              <span className="text-2xl font-display font-extrabold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                CalcHub
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center justify-between flex-grow">
            <div className="flex gap-0.5 items-center">
              {categories.slice(0, 5).map((category) => (
                <Link 
                  key={category.path}
                  to={category.path}
                  className="px-4 py-2 text-neutral-700 text-sm font-medium rounded-xl hover:bg-primary-50 hover:text-primary-700 transition duration-200 flex items-center gap-1.5"
                >
                  <span className="w-4 h-4 flex items-center justify-center">{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
              <div className="relative group">
                <button className="px-4 py-2 text-neutral-700 text-sm font-medium rounded-xl hover:bg-primary-50 hover:text-primary-700 transition duration-200 flex items-center gap-1.5">
                  More Categories
                  <FaChevronDown className="text-xs group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-2xl shadow-card py-3 z-50 hidden group-hover:block transform origin-top scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition duration-200">
                  <div className="grid grid-cols-1 gap-1">
                    {categories.slice(5).map((category) => (
                      <Link 
                        key={category.path}
                        to={category.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition duration-200 text-sm"
                      >
                        <span className="w-6 h-6 flex items-center justify-center">{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Search Bar */}
            <div>
              <SearchBar />
            </div>
          </nav>
          
          {/* Mobile menu button and search */}
          <div className="flex items-center md:hidden gap-2">
            <div className="mr-1">
              <SearchBar />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-xl rounded-b-2xl p-4 absolute w-full left-0 right-0 transform transition-transform duration-300 ease-in-out">
          <div className="grid gap-2 pb-2">
            <h3 className="font-bold text-sm text-primary-600 mb-1 ml-2">All Categories</h3>
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="flex items-center gap-2 px-3 py-2.5 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl text-sm font-medium transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-5 h-5 flex items-center justify-center">{category.icon}</span>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
