import { Link } from 'react-router-dom';
import AdBanner from '../components/layout/AdBanner';

const HomePage = () => {
  const categories = [
    {
      id: 'basic',
      name: 'Basic & Scientific',
      icon: '🔢',
      description: 'Standard calculator, scientific calculator, equation solver, matrix calculator, logarithm calculator, and more.',
      featured: ['Basic Calculator', 'Scientific Calculator', 'Matrix Calculator', 'Logarithm Calculator', 'Unit Circle Calculator', 'Quadratic Equation Solver', 'Equation Solver', 'Fraction Calculator'],
      color: 'bg-blue-100 dark:bg-blue-900',
      path: '/category/basic'
    },
    {
      id: 'finance',
      name: 'Finance & Business',
      icon: '💰',
      description: 'Loan calculator, investment returns, interest calculators, and more.',
      featured: ['Loan Calculator', 'Mortgage Calculator', 'Currency Converter', 'GST & VAT Calculator', 'ROI Calculator', 'Credit Card Payoff Calculator'],
      color: 'bg-green-100 dark:bg-green-900',
      path: '/category/finance'
    },
    {
      id: 'math',
      name: 'Math Tools',
      icon: '🧮',
      description: 'Percentage calculator, ratio calculator, LCM & HCF calculator, factorial calculator, and other math utilities.',
      featured: ['Percentage Calculator', 'Ratio Calculator', 'Statistical Calculator', 'LCM & HCF Calculator', 'Factorial Calculator', 'Prime Checker', 'Base Converter', 'Statistics Calculator'],
      color: 'bg-yellow-100 dark:bg-yellow-900',
      path: '/category/math'
    },
    {
      id: 'unit',
      name: 'Unit & Measurement',
      icon: '📏',
      description: 'Convert between different units of length, weight, temperature, and more.',
      featured: ['Unit Converter', 'Temperature Converter', 'Length Converter'],
      color: 'bg-purple-100 dark:bg-purple-900',
      path: '/category/unit'
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: '🧍',
      description: 'BMI calculator, calorie calculator, body fat calculator, ideal weight calculator, and more.',
      featured: ['BMI Calculator', 'Body Fat Calculator', 'Ideal Weight Calculator', 'Water Intake Calculator', 'Heart Rate Zone Calculator', 'Calorie, BMR & TDEE Calculator', 'Pregnancy Due Date Calculator'],
      color: 'bg-red-100 dark:bg-red-900',
      path: '/category/health'
    },
    {
      id: 'date-time',
      name: 'Date & Time',
      icon: '📅',
      description: 'Age calculator, age units calculator, date difference calculator, and more time-related tools.',
      featured: ['Age Calculator', 'Age Units Calculator', 'Date Difference Calculator'],
      color: 'bg-indigo-100 dark:bg-indigo-900',
      path: '/category/date-time'
    },
    {
      id: 'education',
      name: 'Education',
      icon: '📚',
      description: 'GPA calculator, citation generator, student loan calculator, and other academic tools.',
      featured: ['GPA Calculator', 'Citation Generator', 'Student Loan Calculator', 'Grade Calculator', 'Study Time Calculator'],
      color: 'bg-pink-100 dark:bg-pink-900',
      path: '/category/education'
    },
    {
      id: 'stats',
      name: 'Stats & Data',
      icon: '📊',
      description: 'Probability calculators and data analysis tools.',
      featured: ['Probability Calculator'],
      color: 'bg-teal-100 dark:bg-teal-900',
      path: '/category/stats'
    },
    {
      id: 'fun',
      name: 'Fun & Utility',
      icon: '🧠',
      description: 'Random number generator, dice roller, password generator, and more.',
      featured: ['Random Number Generator', 'Password Generator', 'Word Counter'],
      color: 'bg-orange-100 dark:bg-orange-900',
      path: '/category/fun'
    },
    {
      id: 'home',
      name: 'Home & DIY',
      icon: '🏠',
      description: 'Paint calculator and other home improvement tools.',
      featured: ['Paint Calculator'],
      color: 'bg-cyan-100 dark:bg-cyan-900',
      path: '/category/home'
    }
  ];

  const featuredCalculators = [
    {
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index based on height and weight',
      path: '/bmi-calculator',
      icon: '🧍'
    },
    {
      name: 'Ideal Weight Calculator',
      description: 'Calculate ideal body weight based on height, gender, and body frame',
      path: '/ideal-weight-calculator',
      icon: '⚖️'
    },
    {
      name: 'Water Intake Calculator',
      description: 'Calculate daily water intake needs based on weight, age, and activity level',
      path: '/water-intake-calculator',
      icon: '💧'
    },
    {
      name: 'Loan Calculator',
      description: 'Calculate monthly payments, total interest, and amortization schedule',
      path: '/loan-calculator',
      icon: '💰'
    },
    {
      name: 'Currency Converter',
      description: 'Convert between different currencies with up-to-date exchange rates',
      path: '/currency-converter',
      icon: '💱'
    },
    {
      name: 'Percentage Calculator',
      description: 'Calculate percentages, increases, decreases, and more',
      path: '/percentage-calculator',
      icon: '🧮'
    },
    {
      name: 'Citation Generator',
      description: 'Generate properly formatted citations in APA, MLA, Chicago, and Harvard styles',
      path: '/citation-generator',
      icon: '📚'
    },
    {
      name: 'Age Calculator',
      description: 'Calculate age in years, months, and days from date of birth',
      path: '/age-calculator',
      icon: '📅'
    },
    {
      name: 'Basic Calculator',
      description: 'Perform basic arithmetic operations with a simple, user-friendly interface',
      path: '/basic-calculator',
      icon: '🔢'
    },
    {
      name: 'Scientific Calculator',
      description: 'Advanced calculator with trigonometric, logarithmic, and other scientific functions',
      path: '/scientific-calculator',
      icon: '📐'
    },
    {
      name: 'Statistical Calculator',
      description: 'Calculate mean, median, mode, standard deviation, and other statistical measures',
      path: '/statistical-calculator',
      icon: '📊'
    },
    {
      name: 'Heart Rate Zone Calculator',
      description: 'Calculate heart rate training zones for optimal exercise performance',
      path: '/heart-rate-zone-calculator',
      icon: '❤️'
    }
  ];

  return (
    <div>
      <section className="mb-12">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 rounded-lg blur-xl opacity-50"></div>
            <h1 className="relative text-5xl font-display font-extrabold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent mb-6 py-2">
              All-in-One Calculator Hub
            </h1>
          </div>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            Free online calculators for finance, math, health, education, and more. Fast, accurate, and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCalculators.map((calculator) => (
            <Link
              key={calculator.path}
              to={calculator.path}
              className="group relative overflow-hidden p-6 bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-500 mr-4 group-hover:bg-primary-100 transition-colors duration-300">
                  <span className="text-2xl">{calculator.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors duration-300">
                  {calculator.name}
                </h3>
              </div>
              <p className="text-neutral-600 pl-16">{calculator.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <AdBanner position="middle" />

      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-neutral-800">
            Browse Calculators by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <span className="text-neutral-600 text-xl mr-3">{category.icon}</span>
                  <h3 className="text-lg font-medium text-neutral-800">
                    {category.name}
                  </h3>
                </div>
                
                <p className="text-neutral-500 text-sm mb-4">{category.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Popular Calculators</h4>
                  <ul className="space-y-1">
                    {category.featured.map((item, index) => (
                      <li key={index} className="text-neutral-600 text-sm">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link
                  to={category.path}
                  className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
