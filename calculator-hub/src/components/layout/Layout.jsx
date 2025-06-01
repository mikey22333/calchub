import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdBanner from './AdBanner';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <Header />
      
      <main className="flex-grow relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 p-4 bg-white bg-opacity-90 rounded-2xl shadow-soft">
            <AdBanner position="top" />
          </div>
          
          <div className="relative">
            <Outlet />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
