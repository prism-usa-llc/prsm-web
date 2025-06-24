import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [formToken, setFormToken] = useState<string>('');
  const [formLoadTime, setFormLoadTime] = useState<number>(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    // Get form token and record load time
    const loadTime = Date.now();
    setFormLoadTime(loadTime);
    
    const getFormToken = async () => {
      try {
        const response = await fetch('/api/v0.1/form-token');
        if (response.ok) {
          const data = await response.json();
          setFormToken(data.token);
        }
      } catch (error) {
        console.error('Error getting form token:', error);
      }
    };
    
    getFormToken();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    if (data.website) {
      // Bot detected via honeypot
      return;
    }

    try {
      const submissionData = {
        ...data,
        form_token: formToken,
        form_load_time: formLoadTime / 1000, // Convert to seconds
      };

      const response = await fetch('/api/v0.1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Thank you for your message! We\'ll get back to you soon.');
        reset();
        // Get new form token
        const tokenResponse = await fetch('/api/v0.1/form-token');
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          setFormToken(tokenData.token);
        }
      } else {
        alert(result.detail || 'There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Ready to transform your business with custom software solutions? 
            We\'d love to hear from you and discuss your project.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <Card className="bg-white shadow-xl border-0">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Name"
                      {...register('name')}
                      error={errors.name?.message}
                      placeholder="Your full name"
                    />

                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="your.email@example.com"
                    />

                    <Input
                      label="Phone (Optional)"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                      placeholder="(555) 123-4567"
                    />

                    {/* Honeypot field - hidden from users */}
                    <div style={{ opacity: 0, position: 'absolute', top: '-9999px', left: '-9999px' }}>
                      <Input
                        {...register('website')}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows={5}
                        className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1 px-4 py-3"
                        placeholder="Tell us about your project or how we can help..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Let\'s work together</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We specialize in creating custom software solutions that help small businesses thrive. 
                  From SMS systems to queue management, we\'re here to bring your ideas to life.
                </p>
              </div>

              <div className="grid gap-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:prsmusallc@gmail.com" className="hover:text-blue-600 transition-colors">
                          prsmusallc@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Mon-Fri: 9AM-6PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Quick Response Guarantee</h3>
                <p className="text-blue-100">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
