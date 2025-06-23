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
        const response = await fetch('/api/form-token');
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

      const response = await fetch('/api/contact', {
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
        const tokenResponse = await fetch('/api/form-token');
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
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <Card>
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
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:ring-1"
                placeholder="Tell us about your project or how we can help..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Send Message
            </Button>
          </form>
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">info@prsmusa.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">(555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">123 Business St, Suite 100</p>
          </div>
        </div>
      </div>
    </div>
  );
}