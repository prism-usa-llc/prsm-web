import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="section-padding bg-gray-900">
      <div className="container-custom">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="heading-xl mb-6">
              Affordable Software Solutions for
              <span className="text-blue-500"> Small Businesses</span>
            </h1>
            <p className="text-body mb-10 max-w-3xl mx-auto">
              Transform your business operations with our professional software services. 
              From network monitoring to customer queue management, we provide the technology 
              solutions small businesses need to thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="btn-primary">
                Get Started Today
              </a>
              <a href="#services" className="btn-secondary">
                View Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}