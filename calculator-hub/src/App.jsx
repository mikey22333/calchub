import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { lazy, Suspense } from 'react';

// Layout
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import LoadingSpinner from './components/layout/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';

// Health Calculators
import BMICalculator from './components/calculators/health/BMICalculator';
import BMRCalculator from './components/calculators/health/BMRCalculator';
import BodyFatCalculator from './components/calculators/health/BodyFatCalculator';
import CalorieCalculator from './components/calculators/health/CalorieCalculator';
import IdealWeightCalculator from './components/calculators/health/IdealWeightCalculator';
import WaterIntakeCalculator from './components/calculators/health/WaterIntakeCalculator';
import HeartRateZoneCalculator from './components/calculators/health/HeartRateZoneCalculator';
import PregnancyDueDateCalculator from './components/calculators/health/PregnancyDueDateCalculator';
import CalorieBmrTdeeCalculator from './components/calculators/health/CalorieBmrTdeeCalculator';

// Finance Calculators
import LoanCalculator from './components/calculators/finance/LoanCalculator';
import CompoundInterestCalculator from './components/calculators/finance/CompoundInterestCalculator';
import TaxCalculator from './components/calculators/finance/TaxCalculator';
import InvestmentCalculator from './components/calculators/finance/InvestmentCalculator';
import InterestCalculator from './components/calculators/finance/InterestCalculator';
import DiscountCalculator from './components/calculators/finance/DiscountCalculator';
import TipCalculator from './components/calculators/finance/TipCalculator';
import MortgageCalculator from './components/calculators/finance/MortgageCalculator';
import GSTVATCalculator from './components/calculators/finance/GSTVATCalculator';
import CurrencyConverter from './components/calculators/finance/CurrencyConverter';
import SalaryHourlyCalculator from './components/calculators/finance/SalaryHourlyCalculator';
import ROICalculator from './components/calculators/finance/ROICalculator';
import CostPerUnitCalculator from './components/calculators/finance/CostPerUnitCalculator';
import CreditCardPayoffCalculator from './components/calculators/finance/CreditCardPayoffCalculator';

// Math Calculators
import PercentageCalculator from './components/calculators/math/PercentageCalculator';
import RatioCalculator from './components/calculators/math/RatioCalculator';
import AverageCalculator from './components/calculators/math/AverageCalculator';
import GeometricCalculator from './components/calculators/math/GeometricCalculator';

// Basic & Scientific Calculators
import BasicCalculator from './components/calculators/basic/BasicCalculator';
import ScientificCalculator from './components/calculators/basic/ScientificCalculator';
import FractionCalculator from './components/calculators/basic/FractionCalculator';
import EquationSolver from './components/calculators/basic/EquationSolver';
// Lazy load our new calculator components
const LogarithmCalculator = lazy(() => import('./components/calculators/basic/LogarithmCalculator'));
const UnitCircleCalculator = lazy(() => import('./components/calculators/basic/UnitCircleCalculator'));
const QuadraticEquationSolver = lazy(() => import('./components/calculators/basic/QuadraticEquationSolver'));
const MatrixCalculator = lazy(() => import('./components/calculators/basic/MatrixCalculator'));
import NumberBaseConverter from './components/calculators/basic/NumberBaseConverter';

// Date & Time Calculators
import AgeCalculator from './components/calculators/dateTime/AgeCalculator';
import DateDifferenceCalculator from './components/calculators/date/DateDifferenceCalculator';
import TimeZoneConverter from './components/calculators/date/TimeZoneConverter';

// Unit & Measurement Calculators
import UnitConverter from './components/calculators/unit/UnitConverter';
import TemperatureConverter from './components/calculators/unit/TemperatureConverter';
import LengthConverter from './components/calculators/unit/LengthConverter';

// Education Calculators
import GPACalculator from './components/calculators/education/GPACalculator';
import GradeCalculator from './components/calculators/education/GradeCalculator';
import StudyTimeCalculator from './components/calculators/education/StudyTimeCalculator';
import CitationGenerator from './components/calculators/education/CitationGenerator';
import StudentLoanCalculator from './components/calculators/education/StudentLoanCalculator';
import LCMHCFCalculator from './components/calculators/math/LCMHCFCalculator';
import FactorialCalculator from './components/calculators/math/FactorialCalculator';
import PrimeChecker from './components/calculators/math/PrimeChecker';
import BaseConverter from './components/calculators/math/BaseConverter';
import AgeUnitsCalculator from './components/calculators/date/AgeUnitsCalculator';
import StatisticsCalculator from './components/calculators/math/StatisticsCalculator';

// Stats & Data Calculators
import StatisticalCalculator from './components/calculators/stats/StatisticalCalculator';
import ProbabilityCalculator from './components/calculators/stats/ProbabilityCalculator';

// Fun & Utility Calculators
import RandomGenerator from './components/calculators/fun/RandomGenerator';
import PasswordGenerator from './components/calculators/fun/PasswordGenerator';
import WordCounter from './components/calculators/fun/WordCounter';

// Home & DIY Calculators
import PaintCalculator from './components/calculators/home/PaintCalculator';

// Category Pages
import CategoryPage from './pages/CategoryPage';

// Not Found Page
const NotFoundPage = () => (
  <div className="calculator-container text-center py-12">
    <h1 className="calculator-title text-3xl mb-6">404 - Page Not Found</h1>
    <p className="calculator-description mb-8">The calculator you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="btn-primary">Go to Homepage</a>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* Health Calculator Routes */}
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/bmr-calculator" element={<BMRCalculator />} />
            <Route path="/body-fat-calculator" element={<BodyFatCalculator />} />
            <Route path="/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/ideal-weight-calculator" element={<IdealWeightCalculator />} />
            <Route path="/water-intake-calculator" element={<WaterIntakeCalculator />} />
            <Route path="/heart-rate-zone-calculator" element={<HeartRateZoneCalculator />} />
            <Route path="/pregnancy-due-date-calculator" element={<PregnancyDueDateCalculator />} />
            <Route path="/calorie-bmr-tdee-calculator" element={<CalorieBmrTdeeCalculator />} />
            
            {/* Finance Calculator Routes */}
            <Route path="/loan-calculator" element={<LoanCalculator />} />
            <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
            <Route path="/tax-calculator" element={<TaxCalculator />} />
            <Route path="/investment-calculator" element={<InvestmentCalculator />} />
            <Route path="/interest-calculator" element={<InterestCalculator />} />
            <Route path="/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/tip-calculator" element={<TipCalculator />} />
            <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/gst-vat-calculator" element={<GSTVATCalculator />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/salary-hourly-calculator" element={<SalaryHourlyCalculator />} />
            <Route path="/roi-calculator" element={<ROICalculator />} />
            <Route path="/cost-per-unit-calculator" element={<CostPerUnitCalculator />} />
            <Route path="/credit-card-payoff-calculator" element={<CreditCardPayoffCalculator />} />
            
            {/* Basic & Scientific Calculator Routes */}
            <Route path="/basic-calculator" element={<BasicCalculator />} />
            <Route path="/scientific-calculator" element={<ScientificCalculator />} />
            <Route path="/fraction-calculator" element={<FractionCalculator />} />
            <Route path="/equation-solver" element={<EquationSolver />} />
            <Route path="/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/logarithm-calculator" element={
              <Suspense fallback={<LoadingSpinner message="Loading Logarithm Calculator..." />}>
                <LogarithmCalculator />
              </Suspense>
            } />
            <Route path="/unit-circle-calculator" element={
              <Suspense fallback={<LoadingSpinner message="Loading Unit Circle Calculator..." />}>
                <UnitCircleCalculator />
              </Suspense>
            } />
            <Route path="/quadratic-equation-solver" element={
              <Suspense fallback={<LoadingSpinner message="Loading Quadratic Equation Solver..." />}>
                <QuadraticEquationSolver />
              </Suspense>
            } />
            <Route path="/matrix-calculator" element={
              <Suspense fallback={<LoadingSpinner message="Loading Matrix Calculator..." />}>
                <MatrixCalculator />
              </Suspense>
            } />
            
            {/* Math Calculator Routes */}
            <Route path="/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/ratio-calculator" element={<RatioCalculator />} />
            <Route path="/average-calculator" element={<AverageCalculator />} />
            <Route path="/lcm-hcf-calculator" element={<LCMHCFCalculator />} />
            <Route path="/factorial-calculator" element={<FactorialCalculator />} />
            <Route path="/prime-checker" element={<PrimeChecker />} />
            <Route path="/base-converter" element={<BaseConverter />} />
            <Route path="/statistics-calculator" element={<StatisticsCalculator />} />
            <Route path="/geometric-calculator" element={<GeometricCalculator />} />
            
            {/* Date & Time Calculator Routes */}
            <Route path="/age-calculator" element={<AgeCalculator />} />
            <Route path="/date-difference-calculator" element={<DateDifferenceCalculator />} />
            <Route path="/age-units-calculator" element={<AgeUnitsCalculator />} />
            <Route path="/time-zone-converter" element={<TimeZoneConverter />} />
            
            {/* Unit & Measurement Calculator Routes */}
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/length-converter" element={<LengthConverter />} />
            
            {/* Education Calculator Routes */}
            <Route path="/gpa-calculator" element={<GPACalculator />} />
            <Route path="/grade-calculator" element={<GradeCalculator />} />
            <Route path="/study-time-calculator" element={<StudyTimeCalculator />} />
            <Route path="/citation-generator" element={<CitationGenerator />} />
            <Route path="/student-loan-calculator" element={<StudentLoanCalculator />} />
            
            {/* Stats & Data Calculator Routes */}
            <Route path="/statistical-calculator" element={<StatisticalCalculator />} />
            <Route path="/probability-calculator" element={<ProbabilityCalculator />} />
            
            {/* Fun & Utility Calculator Routes */}
            <Route path="/random-generator" element={<RandomGenerator />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />
            <Route path="/word-counter" element={<WordCounter />} />
            
            {/* Home & DIY Calculator Routes */}
            <Route path="/paint-calculator" element={<PaintCalculator />} />
            
            {/* Category Routes */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
