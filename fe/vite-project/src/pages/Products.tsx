import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Products() {
  const navigate = useNavigate();

  const services = [
    {
      id: 'sms-alerts',
      name: 'SMS Alert Systems',
      description: 'Custom SMS messaging solutions to keep your customers informed and engaged with real-time notifications and alerts.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      features: [
        'Real-time SMS notifications',
        'Custom message templates',
        'Automated triggers and workflows',
        'Customer engagement tracking',
        'Two-way messaging support',
        'Integration with existing systems'
      ],
      useCases: [
        'Order status updates',
        'Appointment reminders', 
        'Emergency alerts',
        'Marketing campaigns',
        'Customer service notifications'
      ],
      pricing: 'Starting at $99/month',
      category: 'Communication'
    },
    {
      id: 'queue-management',
      name: 'Queue Management Systems',
      description: 'Streamline customer flow with our digital queue systems that allow customers to check in remotely and return when ready.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: [
        'Self-service check-in',
        'SMS notifications for queue updates',
        'Real-time queue status display',
        'Analytics dashboard',
        'Staff management interface',
        'Mobile-friendly design'
      ],
      useCases: [
        'Restaurants and cafes',
        'Medical offices',
        'Service centers',
        'Government offices',
        'Retail stores'
      ],
      pricing: 'Starting at $149/month',
      category: 'Operations'
    },
    {
      id: 'website-monitoring',
      name: 'Website Monitoring & Alerting',
      description: '24/7 website monitoring with SMS alerts when your site is down or slow. Get notified instantly when performance drops below your threshold.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
      ),
      features: [
        'Real-time uptime monitoring',
        'Performance threshold alerts (3+ seconds)',
        'Instant SMS notifications',
        'Detailed outage reports',
        'Multiple URL monitoring',
        'Custom alert thresholds'
      ],
      useCases: [
        'E-commerce websites',
        'Business websites',
        'Web applications',
        'API endpoints',
        'Critical business systems'
      ],
      pricing: 'Starting at $49/month',
      category: 'Monitoring'
    },
    {
      id: 'it-consulting',
      name: 'IT Consulting & Infrastructure',
      description: 'Complete IT infrastructure setup including computer networks, VPN solutions, and secure customer WiFi access.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      features: [
        'Network design and setup',
        'VPN configuration and management',
        'Secure customer WiFi',
        'Network security assessment',
        'Hardware procurement',
        'Ongoing support and maintenance'
      ],
      useCases: [
        'Office network setup',
        'Remote work solutions',
        'Customer WiFi for businesses',
        'Network security upgrades',
        'IT infrastructure planning'
      ],
      pricing: 'Custom quote based on needs',
      category: 'Infrastructure'
    },
    {
      id: 'custom-development',
      name: 'Custom Software Development',
      description: 'Bespoke software solutions built specifically for your business needs and workflow requirements.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: [
        'Custom web applications',
        'Database design and optimization',
        'API development and integration',
        'Mobile app development',
        'Legacy system modernization',
        'Ongoing maintenance and support'
      ],
      useCases: [
        'Business process automation',
        'Customer management systems',
        'Inventory management',
        'Reporting and analytics',
        'Integration between systems'
      ],
      pricing: 'Project-based pricing',
      category: 'Development'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Software Solutions
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive technology solutions designed specifically for small businesses. 
            From SMS systems to custom development, we help you streamline operations and grow.
          </p>
          <div className="mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/contact')} 
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Use Cases</h4>
                      <ul className="space-y-2">
                        {service.useCases.map((useCase, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-gray-500">Pricing</span>
                      <p className="text-lg font-semibold text-gray-900">{service.pricing}</p>
                    </div>
                    <Button 
                      onClick={() => navigate('/contact')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We specialize in creating bespoke software solutions tailored to your unique business requirements. 
            Let's discuss how we can help streamline your operations and drive growth.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Your Project
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}