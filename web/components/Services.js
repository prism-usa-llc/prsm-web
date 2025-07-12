import { motion } from 'framer-motion'
import { 
  ComputerDesktopIcon, 
  QueueListIcon, 
  CodeBracketIcon,
  WifiIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function Services() {
  const services = [
    {
      icon: ExclamationTriangleIcon,
      title: 'Website Down or Slow Instant Alerting',
      description: 'Never let your customers be the first to report an outage. Our monitoring service checks your website every minute and sends instant alerts if it\'s down or performing slowly.',
      features: [
        '24/7 automated website monitoring',
        'Instant email and SMS alerts',
        'Performance and uptime reports',
        'Peace of mind for your online presence'
      ],
      status: 'available',
      cost: process.env.NEXT_PUBLIC_WEBSITE_MONITORING_COST
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Scout Network Monitoring',
      description: 'Comprehensive network monitoring solution that keeps your business connected. Our Scout system monitors network health, detects outages, and provides detailed diagnostic reports to minimize downtime.',
      features: [
        'Real-time connectivity monitoring',
        'Automatic diagnostic reports',
        'Network performance analysis',
        'Instant outage alerts'
      ],
      status: 'available',
      cost: process.env.NEXT_PUBLIC_NETWORK_MONITORING_COST
    },
    {
      icon: QueueListIcon,
      title: 'SmartLine Queue Management',
      description: 'Revolutionary queue management system that eliminates crowded waiting rooms. Customers scan QR codes to join queues and receive real-time updates, giving them freedom to shop while keeping their place.',
      features: [
        'QR code customer entry',
        'Real-time position tracking',
        'SMS notifications',
        'Customer analytics dashboard',
        'Reduced waiting room congestion'
      ],
      status: 'coming soon',
      cost: null
    },
    {
      icon: CodeBracketIcon,
      title: 'Custom Software Development',
      description: 'Tailored software solutions for your unique business needs. From payment processing websites to database migrations, we create functional software that drives your business forward.',
      features: [
        'Custom web applications',
        'Payment processing integration',
        'Database design & migration',
        'Business process automation'
      ],
      status: 'available',
      cost: process.env.NEXT_PUBLIC_CUSTOM_SOFTWARE_COST
    },
    {
      icon: WifiIcon,
      title: 'Network Installation & IT Services',
      description: 'Professional network setup and IT consulting services. We install secure WiFi networks, configure VPN access, and provide ongoing IT support to keep your business running smoothly.',
      features: [
        'WiFi network installation',
        'Business/guest network segregation',
        'VPN setup and management',
        'Employee access tracking',
        'IT consulting services'
      ],
      status: 'available',
      cost: process.env.NEXT_PUBLIC_NETWORK_INSTALLATION_COST
    }
  ]


  return (
    <section id="services" className="section-padding bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Professional Software Services for Small Business
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            We provide affordable, professional-grade software solutions designed specifically 
            for small businesses. Our services help you operate more efficiently, serve customers 
            better, and grow your business.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h3 className="heading-md mb-3">{service.title}</h3>
                    {service.status === 'coming soon' && (
                      <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  {service.cost && (
                    <div className="mb-4">
                      <p className="text-white font-semibold">Cost:</p>
                      <p className="text-gray-400">{service.cost}</p>
                    </div>
                  )}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-primary">
            Get Custom Quote
          </a>
        </motion.div>
      </div>
    </section>
  )
}