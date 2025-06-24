import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle hash navigation on page load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  // Also handle hash changes after navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Custom Software Solutions for Small Business
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Specializing in SMS messaging alerts, website monitoring, queue
            management systems, and comprehensive IT consulting to help your
            business thrive in the digital age.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("solutions")}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Our Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology solutions tailored for small businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  SMS Alert Systems
                </h3>
                <p className="text-gray-600">
                  Custom SMS messaging solutions to keep your customers informed
                  and engaged with real-time notifications and alerts.
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Queue Management
                </h3>
                <p className="text-gray-600">
                  Streamline customer flow with our digital queue systems that
                  allow customers to check in remotely and return when ready.
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  IT Consulting
                </h3>
                <p className="text-gray-600">
                  Complete IT infrastructure setup including computer networks,
                  VPN solutions, and secure customer WiFi access.
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Website Monitoring
                </h3>
                <p className="text-gray-600">
                  24/7 website monitoring with SMS alerts when your site is down
                  or slow. Get notified instantly when performance drops below
                  your threshold.
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Custom Development
                </h3>
                <p className="text-gray-600">
                  Bespoke software solutions built specifically for your
                  business needs and workflow requirements.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Solutions Section */}
      <section id="solutions" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-world applications we've developed for businesses like yours
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white border-l-4 border-l-blue-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer Queue System
              </h3>
              <p className="text-gray-600 mb-4">
                Perfect for restaurants and service businesses. Customers can
                check themselves in, receive SMS updates, and return exactly
                when their turn is up. Reduces wait times and improves customer
                satisfaction.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Self-service check-in
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  SMS notifications
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Real-time queue updates
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
            </Card>

            <Card className="bg-white border-l-4 border-l-green-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure Network Infrastructure
              </h3>
              <p className="text-gray-600 mb-4">
                Complete network setup with VPN capabilities and logical
                segregation for customer WiFi access. Ensures your business data
                stays secure while providing convenient customer internet
                access.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  VPN setup & management
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Network segregation
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Secure customer WiFi
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  24/7 monitoring
                </li>
              </ul>
            </Card>

            <Card className="bg-white border-l-4 border-l-purple-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Website Monitoring & Alerting
              </h3>
              <p className="text-gray-600 mb-4">
                Never miss a website outage again. Our comprehensive monitoring
                system checks your website's availability and performance 24/7,
                sending instant SMS alerts when issues are detected.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Real-time uptime monitoring
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Performance threshold alerts
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Instant SMS notifications
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Detailed outage reports
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Building Systems & Solutions Through Software
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At PRSM USA, we believe that every small business deserves access
              to cutting-edge technology solutions. We specialize in creating
              custom software that addresses real business challenges, with a
              particular focus on SMS messaging systems that keep businesses
              connected with their customers.
            </p>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Our team combines technical expertise with deep understanding of
              small business operations. We don't just build software – we
              create comprehensive solutions that integrate seamlessly into your
              existing workflow and help your business grow.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact-cta" className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss how our custom software solutions can help your
            business grow
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <a
                href="mailto:prsmusallc@gmail.com"
                className="text-blue-200 hover:text-white"
              >
                prsmusallc@gmail.com
              </a>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-blue-200">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
              <p className="text-blue-200">Mon-Fri: 9AM-6PM EST</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => navigate("/contact")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Send Message
          </Button>
        </div>
      </section>
    </div>
  );
}
