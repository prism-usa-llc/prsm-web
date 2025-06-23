import Card from '../components/Card';
import Button from '../components/Button';

export default function Products() {
  const products = [
    {
      id: 1,
      name: 'Product One',
      description: 'A comprehensive solution for your business needs.',
      features: ['Feature A', 'Feature B', 'Feature C'],
    },
    {
      id: 2,
      name: 'Product Two', 
      description: 'Advanced tools to streamline your workflow.',
      features: ['Advanced Analytics', 'Real-time Sync', 'Custom Reports'],
    },
    {
      id: 3,
      name: 'Product Three',
      description: 'Enterprise-grade security and performance.',
      features: ['Enterprise Security', 'Scalable Architecture', '24/7 Support'],
    },
  ];

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Our Products
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our range of innovative solutions designed to help your business thrive.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="h-full">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {product.description}
              </p>
              <ul className="space-y-2 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="mt-auto">
                Learn More
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Need a custom solution? We'd love to help.
        </p>
        <Button variant="outline">
          Contact Our Team
        </Button>
      </div>
    </div>
  );
}