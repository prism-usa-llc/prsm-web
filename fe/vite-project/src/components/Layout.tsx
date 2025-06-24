import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home page with section hash
      window.location.href = `/#${id}`;
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">PRSM USA</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <a 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </a>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Solutions
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </button>
                <a 
                  href="/contact" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Contact
                </a>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-white/95 backdrop-blur-sm">
                <a 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium text-left w-full"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium text-left w-full"
                >
                  Solutions
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium text-left w-full"
                >
                  About
                </button>
                <a 
                  href="/contact" 
                  className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="w-full">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PRSM USA</h3>
              <p className="text-gray-300 mb-4">
                Custom software solutions for small businesses. Specializing in SMS messaging, 
                queue management, and IT consulting.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>SMS Alert Systems</li>
                <li>Queue Management</li>
                <li>Website Monitoring</li>
                <li>IT Consulting</li>
                <li>Custom Development</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>
                  <a href="mailto:prsmusallc@gmail.com" className="hover:text-white transition-colors">
                    prsmusallc@gmail.com
                  </a>
                </p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PRSM USA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
