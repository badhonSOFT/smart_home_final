import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, CreditCard, Smartphone } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-900">
      <div className="container-width px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Left: Logo & Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Curtain Luxe</h3>
              <p className="text-sm text-gray-700 mb-2">
                Smart Comfort. Designed for You.
              </p>
              <p className="text-xs text-gray-600 mb-4">
                Part of #BuiltForComfort
              </p>
              <a 
                href="https://connect.sohub.com.bd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Powered by SOHUB
              </a>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('specs')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Specs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('compare')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Compare
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('order')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Order
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Installation Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  User Manual
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Troubleshooting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Warranty
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">hello@curtainluxe.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                <span className="text-gray-700 text-xs">
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="mt-8 pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">We Accept</p>
            <img 
              src="/src/assets/footer/payment.png" 
              alt="Payment methods - bKash, Nagad, Visa, Mastercard" 
              className="mx-auto h-12"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300">
        <div className="container-width px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 Curtain Luxe. All rights reserved.</p>
            <p>
              Powered by{' '}
              <a 
                href="https://connect.sohub.com.bd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                SOHUB
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;