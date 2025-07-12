import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Services', href: '#services' },
    { name: 'Solutions', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header className="bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-500">
              {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-blue-500 font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a href="#contact" className="btn-primary">
              Get Quote
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-5">
            <div className="flex flex-col space-y-5">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-blue-500 font-medium transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Quote
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}