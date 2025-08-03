import { motion } from 'framer-motion'
import { 
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function Features() {
  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Affordable Solutions',
      description: 'Professional-grade software at small business prices. No enterprise costs, just effective solutions.'
    },
    {
      icon: ClockIcon,
      title: 'Quick Implementation',
      description: 'Get up and running fast with our streamlined setup process and expert installation.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Reliable & Secure',
      description: 'Built with security in mind. Your data and your customers\' information stay protected.'
    },
    {
      icon: ChartBarIcon,
      title: 'Business Analytics',
      description: 'Gain valuable insights into your operations with built-in reporting and analytics.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile-First Design',
      description: 'All solutions work seamlessly on desktop, tablet, and mobile devices.'
    },
    {
      icon: UserGroupIcon,
      title: 'Dedicated Support',
      description: 'Personal support from our team. We\'re here to help you succeed.'
    }
  ]

  const smartLineFeatures = [
    {
      title: 'Eliminate Crowded Waiting Rooms',
      description: 'Customers no longer need to wait in crowded spaces. They can shop, grab coffee, or handle other tasks while maintaining their place in line.'
    },
    {
      title: 'Customer Analytics Dashboard',
      description: 'Understand your customer flow patterns, peak hours, and service times. Make data-driven decisions to improve efficiency.'
    },
    {
      title: 'Improved Customer Satisfaction',
      description: 'Happy customers return more often. Give them the freedom to use their time productively while waiting for service.'
    },
    {
      title: 'Staff Efficiency',
      description: 'Your staff can focus on serving customers instead of managing physical queues and answering "how much longer?" questions.'
    }
  ]

  return (
    <section id="features" className="section-padding bg-gray-800">
      <div className="container-custom">
        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Why Small Businesses Choose PRISM USA
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            We understand the unique challenges small businesses face. Our solutions are designed 
            to be affordable, easy to implement, and immediately beneficial to your operations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-blue-500/10 transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* SmartLine Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-2xl p-8 lg:p-12 shadow-2xl"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="heading-lg mb-6 text-blue-500">
                SmartLine Queue Management
              </h3>
              <p className="text-body mb-8">
                Our SmartLine system modernizes your waiting line. It allows customers to join a virtual queue, giving them the freedom to wait wherever they like while staying updated on their status.
              </p>
              
              <div className="space-y-6">
                {smartLineFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <h4 className="font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">Customer scans QR code</span>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">Position #7 in queue</span>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">Customer shops freely</span>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">SMS: "You're 3rd in line!"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}