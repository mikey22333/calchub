import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaFacebook, FaCalculator, FaChartBar, FaPercent, FaCalendarAlt, FaRuler, FaGraduationCap, FaDice, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const categories = [
    { name: 'Basic & Scientific', path: '/category/basic', icon: <FaCalculator /> },
    { name: 'Finance & Business', path: '/category/finance', icon: <FaChartBar /> },
    { name: 'Math Tools', path: '/category/math', icon: <FaPercent /> },
    { name: 'Health & Fitness', path: '/category/health', icon: <FaHeart /> },
    { name: 'Stats & Data', path: '/category/stats', icon: <FaChartBar /> },
  ];
  
  const popularCalculators = [
    { name: 'BMI Calculator', path: '/bmi-calculator' },
    { name: 'Loan Calculator', path: '/loan-calculator' },
    { name: 'Percentage Calculator', path: '/percentage-calculator' },
    { name: 'Age Calculator', path: '/age-calculator' },
    { name: 'Unit Converter', path: '/unit-converter' },
    { name: 'Statistical Calculator', path: '/statistical-calculator' },
  ];
  
  const links = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];
  
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo, description, and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10 pb-10 border-b border-gray-200">
          {/* Logo and description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🧮</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CalcHub
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your all-in-one destination for free online calculators. Fast, accurate, and easy to use.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-500 flex items-center justify-center text-gray-600 hover:text-white transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-500 flex items-center justify-center text-gray-600 hover:text-white transition-colors duration-300">
                <FaGithub />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-500 flex items-center justify-center text-gray-600 hover:text-white transition-colors duration-300">
                <FaFacebook />
              </a>
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscribe to our newsletter</h3>
            <p className="text-gray-600 mb-4">Get updates on new calculators and features. We don't spam!</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Middle section with links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link 
                    to={category.path} 
                    className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors duration-300"
                  >
                    <span className="text-blue-500">{category.icon}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Popular Calculators */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular Calculators</h4>
            <ul className="space-y-3">
              {popularCalculators.map((calc) => (
                <li key={calc.path}>
                  <Link 
                    to={calc.path} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                  >
                    {calc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Links</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h4>
            <address className="not-italic text-gray-600 space-y-3">
              <p>Email: <a href="mailto:contact@calchub.com" className="hover:text-blue-600 transition-colors duration-300">contact@calchub.com</a></p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>123 Calculator Street<br />Math City, MC 12345</p>
            </address>
          </div>
        </div>
        
        {/* Bottom copyright section */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600 text-sm">&copy; {currentYear} CalcHub. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">
            Designed with <span className="text-red-500">❤️</span> for all your calculation needs.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
