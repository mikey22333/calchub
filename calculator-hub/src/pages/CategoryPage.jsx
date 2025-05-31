import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCalculator, FaChartBar, FaBalanceScale, FaHeartbeat, FaDice, FaClock, FaRuler, FaGraduationCap, FaChartLine, FaHome } from 'react-icons/fa';
import AdBanner from '../components/layout/AdBanner';
import SEO from '../components/layout/SEO';

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  // Scroll to top when navigating to a category page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);
  
  // Define category data
  const categories = {
    basic: {
      name: 'Basic & Scientific Calculators',
      description: 'Standard calculator, scientific calculator, equation solver, and more.',
      icon: <FaCalculator className="text-primary-500" />,
      calculators: [
        { name: 'Basic Calculator', path: '/basic-calculator', description: 'Perform basic arithmetic operations' },
        { name: 'Scientific Calculator', path: '/scientific-calculator', description: 'Advanced scientific calculations with functions and constants' },
        { name: 'Fraction Calculator', path: '/fraction-calculator', description: 'Add, subtract, multiply, and divide fractions' },
        { name: 'Equation Solver', path: '/equation-solver', description: 'Solve linear and quadratic equations' },
        { name: 'Quadratic Equation Solver', path: '/quadratic-equation-solver', description: 'Solve quadratic equations with step-by-step solutions' },
        { name: 'Logarithm Calculator', path: '/logarithm-calculator', description: 'Calculate logarithms with any base, including natural and common logarithms' },
        { name: 'Unit Circle Calculator', path: '/unit-circle-calculator', description: 'Calculate trigonometric values and coordinates on the unit circle' },
        { name: 'Matrix Calculator', path: '/matrix-calculator', description: 'Perform matrix operations like addition, multiplication, determinant, and inverse' },
        { name: 'Number Base Converter', path: '/number-base-converter', description: 'Convert between binary, octal, decimal, and hexadecimal' }
      ]
    },
    finance: {
      name: 'Finance & Business Calculators',
      description: 'Loan calculator, investment returns, interest calculators, and more.',
      icon: <FaChartBar className="text-primary-500" />,
      calculators: [
        { name: 'Loan Calculator', path: '/loan-calculator', description: 'Calculate monthly payments, total interest, and amortization schedule' },
        { name: 'Mortgage Calculator', path: '/mortgage-calculator', description: 'Calculate mortgage payments, total interest, and generate amortization schedules' },
        { name: 'Compound Interest Calculator', path: '/compound-interest-calculator', description: 'Calculate compound interest over time' },
        { name: 'Interest Calculator', path: '/interest-calculator', description: 'Calculate simple and compound interest' },
        { name: 'Tax Calculator', path: '/tax-calculator', description: 'Calculate income tax based on different tax brackets' },
        { name: 'Investment Calculator', path: '/investment-calculator', description: 'Calculate investment returns and growth' },
        { name: 'Discount Calculator', path: '/discount-calculator', description: 'Calculate discounted prices, savings, and discount percentages' },
        { name: 'Tip Calculator', path: '/tip-calculator', description: 'Calculate tips, split bills, and determine how much each person should pay' },
        { name: 'GST & VAT Calculator', path: '/gst-vat-calculator', description: 'Calculate GST/VAT inclusive and exclusive prices with different tax rates' },
        { name: 'Currency Converter', path: '/currency-converter', description: 'Convert between different currencies with up-to-date exchange rates' },
        { name: 'Salary to Hourly Calculator', path: '/salary-hourly-calculator', description: 'Convert annual salary to hourly wage and vice versa' },
        { name: 'ROI Calculator', path: '/roi-calculator', description: 'Calculate return on investment and annualized ROI' },
        { name: 'Cost Per Unit Calculator', path: '/cost-per-unit-calculator', description: 'Calculate production cost per unit based on fixed and variable costs' },
        { name: 'Credit Card Payoff Calculator', path: '/credit-card-payoff-calculator', description: 'Calculate time to pay off credit card debt or required monthly payment' }
      ]
    },
    math: {
      name: 'Math Tools',
      description: 'Percentage calculator, ratio calculator, LCM & HCF calculator, factorial calculator, and other math utilities.',
      icon: <FaBalanceScale className="text-primary-500" />,
      calculators: [
        { name: 'Percentage Calculator', path: '/percentage-calculator', description: 'Calculate percentages, increases, and decreases' },
        { name: 'Ratio Calculator', path: '/ratio-calculator', description: 'Calculate and simplify ratios' },
        { name: 'Average Calculator', path: '/average-calculator', description: 'Calculate mean, median, mode, and other averages' },
        { name: 'Statistics Calculator', path: '/statistics-calculator', description: 'Calculate mean, median, mode, variance, standard deviation, and more' },
        { name: 'Statistical Calculator', path: '/statistical-calculator', description: 'Calculate mean, median, mode, standard deviation, and other statistical measures' },
        { name: 'LCM & HCF Calculator', path: '/lcm-hcf-calculator', description: 'Calculate Least Common Multiple and Highest Common Factor' },
        { name: 'Factorial Calculator', path: '/factorial-calculator', description: 'Calculate factorial of a number with step-by-step explanations' },
        { name: 'Prime Checker', path: '/prime-checker', description: 'Check if a number is prime and find all its factors' },
        { name: 'Base Converter', path: '/base-converter', description: 'Convert between binary, decimal, hexadecimal, and other number systems' },
        { name: 'Geometric Calculator', path: '/geometric-calculator', description: 'Calculate properties of 2D and 3D geometric shapes' }
      ]
    },
    health: {
      name: 'Health & Fitness Calculators',
      description: 'BMI calculator, calorie calculator, body fat calculator, ideal weight calculator, water intake calculator, and more health-related calculators.',
      icon: <FaHeartbeat className="text-primary-500" />,
      calculators: [
        { name: 'BMI Calculator', path: '/bmi-calculator', description: 'Calculate Body Mass Index based on height and weight' },
        { name: 'Calorie Calculator', path: '/calorie-calculator', description: 'Calculate daily calorie needs and macronutrient breakdown based on your goals' },
        { name: 'BMR Calculator', path: '/bmr-calculator', description: 'Calculate Basal Metabolic Rate and daily calorie needs' },
        { name: 'Body Fat Calculator', path: '/body-fat-calculator', description: 'Calculate body fat percentage using different methods' },
        { name: 'Ideal Weight Calculator', path: '/ideal-weight-calculator', description: 'Calculate ideal body weight based on height, gender, and body frame' },
        { name: 'Water Intake Calculator', path: '/water-intake-calculator', description: 'Calculate daily water intake needs based on weight, age, and activity level' },
        { name: 'Heart Rate Zone Calculator', path: '/heart-rate-zone-calculator', description: 'Calculate heart rate training zones for optimal exercise performance' },
        { name: 'Pregnancy Due Date Calculator', path: '/pregnancy-due-date-calculator', description: 'Calculate pregnancy due date, conception date, and trimester information' },
        { name: 'Calorie, BMR & TDEE Calculator', path: '/calorie-bmr-tdee-calculator', description: 'Calculate BMR, TDEE, and daily calorie needs with macronutrient breakdown' }
      ]
    },
    fun: {
      name: 'Fun & Utility Calculators',
      description: 'Random number generator, password generator, word counter, and other fun tools.',
      icon: <FaDice className="text-primary-500" />,
      calculators: [
        { name: 'Random Generator', path: '/random-generator', description: 'Generate random numbers, passwords, and dice rolls' },
        { name: 'Password Generator', path: '/password-generator', description: 'Create strong, secure passwords with customizable options' },
        { name: 'Word Counter', path: '/word-counter', description: 'Count words, characters, sentences, and paragraphs in your text' }
      ]
    },
    'date-time': {
      name: 'Date & Time Calculators',
      description: 'Age calculator, date difference calculator, age in days/weeks/months, and other date/time related calculators.',
      icon: <FaClock className="text-primary-500" />,
      calculators: [
        { name: 'Age Calculator', path: '/age-calculator', description: 'Calculate age in years, months, and days from birth date' },
        { name: 'Age Units Calculator', path: '/age-units-calculator', description: 'Calculate age in days, weeks, months, and other units' },
        { name: 'Date Difference Calculator', path: '/date-difference-calculator', description: 'Calculate the exact time between two dates in various units' },
        { name: 'Time Zone Converter', path: '/time-zone-converter', description: 'Convert times between different time zones around the world' }
      ]
    },
    unit: {
      name: 'Unit & Measurement Calculators',
      description: 'Convert between different units of length, weight, temperature, and more.',
      icon: <FaRuler className="text-primary-500" />,
      calculators: [
        { name: 'Unit Converter', path: '/unit-converter', description: 'Convert between various units of measurement' },
        { name: 'Temperature Converter', path: '/temperature-converter', description: 'Convert between Celsius, Fahrenheit, and Kelvin' },
        { name: 'Length Converter', path: '/length-converter', description: 'Convert between meters, feet, inches, miles, and more' }
      ]
    },
    education: {
      name: 'Education Calculators',
      description: 'GPA calculator, citation generator, student loan calculator, and other academic tools.',
      icon: <FaGraduationCap className="text-primary-500" />,
      calculators: [
        { name: 'GPA Calculator', path: '/gpa-calculator', description: 'Calculate Grade Point Average based on course grades and credits' },
        { name: 'Grade Calculator', path: '/grade-calculator', description: 'Calculate final grades based on weighted assessments, tests, and exams' },
        { name: 'Study Time Calculator', path: '/study-time-calculator', description: 'Plan study time based on course load, difficulty, and personal efficiency' },
        { name: 'Citation Generator', path: '/citation-generator', description: 'Generate properly formatted citations in APA, MLA, Chicago, and Harvard styles' },
        { name: 'Student Loan Calculator', path: '/student-loan-calculator', description: 'Calculate student loan payments, interest costs, and create a repayment schedule' }
      ]
    },
    home: {
      name: 'Home & DIY Calculators',
      description: 'Paint calculator and other home improvement tools.',
      icon: <FaHome className="text-primary-500" />,
      calculators: [
        { name: 'Paint Calculator', path: '/paint-calculator', description: 'Calculate how much paint you need for your walls' }
      ]
    },
    stats: {
      name: 'Stats & Data Calculators',
      description: 'Probability calculator and data analysis tools.',
      icon: <FaChartLine className="text-primary-500" />,
      calculators: [
        { name: 'Probability Calculator', path: '/probability-calculator', description: 'Calculate probability of events and combinations' }
      ]
    }
  };

  // Get the current category data
  const categoryData = categories[categoryId] || {
    name: 'Category Not Found',
    description: 'The requested category does not exist.',
    icon: <FaCalculator className="text-primary-500" />,
    calculators: []
  };

  return (
    <>
      <SEO 
        title={`${categoryData.name} - CalcHub`}
        description={`Free online ${categoryData.description} Fast, accurate, and easy to use.`}
        keywords={`calculator, ${categoryId} calculator, online calculator, free calculator`}
      />
      
      <div className="calculator-container">
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{categoryData.icon}</span>
          <h1 className="calculator-title">{categoryData.name}</h1>
        </div>
        <p className="calculator-description mb-8">
          {categoryData.description}
        </p>

        <AdBanner position="top" />

        {categoryData.calculators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categoryData.calculators.map((calculator) => (
              <Link
                key={calculator.path}
                to={calculator.path}
                className="bg-white rounded-lg border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5"
              >
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  {calculator.name}
                </h3>
                <p className="text-neutral-500 text-sm">
                  {calculator.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              No calculators found
            </h3>
            <p className="text-yellow-700">
              There are currently no calculators in this category. Please check back later.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="text-primary-500 hover:text-primary-600 font-medium">
            &larr; Back to All Categories
          </Link>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CategoryPage;
