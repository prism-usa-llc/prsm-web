export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              PRISM USA
            </div>
            <p className="text-gray-400 mb-4">
              Professional software solutions for small businesses. 
              Affordable, reliable, and designed to help you grow.
            </p>
            <p className="text-gray-500 text-sm">
              Serving small businesses nationwide with cutting-edge software solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Scout Network Monitoring
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  SmartLine Queue Management
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Custom Software Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Network Installation & IT
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get In Touch</h4>
            <div className="space-y-2 text-gray-400">
              <p>
                <span className="text-white">Email:</span>{' '}
                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="hover:text-white transition-colors">
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </p>
              <p>
                <span className="text-white">Phone:</span>{' '}
                <a href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`} className="hover:text-white transition-colors">
                  {process.env.NEXT_PUBLIC_PHONE_NUMBER}
                </a>
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Response time: Within 24 hours
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} PRISM USA LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}