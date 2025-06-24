import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to PRSM
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted partner for innovative solutions and exceptional service.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Quality Products
          </h3>
          <p className="text-gray-600 mb-4">
            We deliver high-quality products that meet your specific needs and
            exceed your expectations.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/products")}
          >
            Learn More
          </Button>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Expert Support
          </h3>
          <p className="text-gray-600 mb-4">
            Our dedicated team provides comprehensive support to ensure your
            success every step of the way.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </Button>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Innovation
          </h3>
          <p className="text-gray-600 mb-4">
            Stay ahead with our cutting-edge solutions designed for the modern
            business landscape.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/products")}
          >
            Explore
          </Button>
        </Card>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={() => navigate("/contact")}>
          Get Started Today
        </Button>
      </div>
    </div>
  );
}
