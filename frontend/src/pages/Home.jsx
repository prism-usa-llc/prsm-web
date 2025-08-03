import { Link } from 'react-router-dom'
import { QueueListIcon, ClockIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Modern Queue Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your business operations with our smart, multi-location queue management solution
        </p>
        <div className="space-x-4">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/queue/join" className="btn-secondary">
            Join Queue
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center">
          <QueueListIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Smart Queue Management</h3>
          <p className="text-gray-600">
            Efficiently manage queues across multiple locations with real-time updates
          </p>
        </div>
        
        <div className="text-center">
          <DevicePhoneMobileIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Mobile-First Experience</h3>
          <p className="text-gray-600">
            Customers join queues via QR codes and track their position on any device
          </p>
        </div>
        
        <div className="text-center">
          <ClockIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Real-Time Notifications</h3>
          <p className="text-gray-600">
            Automatic SMS notifications when customers are approaching their turn
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of businesses using PRISM Queue to improve customer experience
        </p>
        <Link to="/register" className="btn-primary">
          Start Free Trial
        </Link>
      </div>
    </div>
  )
}

export default Home