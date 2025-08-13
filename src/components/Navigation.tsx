import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg transition-all duration-300">
      <div className="container-width">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Curtain Luxe
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('specs')}
              className="transition-colors font-medium text-gray-600 hover:text-gray-900"
            >
              Specs
            </button>
            <button 
              onClick={() => handleNavigation('gallery')}
              className="transition-colors font-medium text-gray-600 hover:text-gray-900"
            >
              Gallery
            </button>
            <button 
              onClick={() => handleNavigation('compare')}
              className="transition-colors font-medium text-gray-600 hover:text-gray-900"
            >
              Compare
            </button>
            <button 
              onClick={() => handleNavigation('faq')}
              className="transition-colors font-medium text-gray-600 hover:text-gray-900"
            >
              FAQ
            </button>
            <button 
              onClick={() => navigate('/built-for-comfort')}
              className="transition-colors font-medium text-gray-600 hover:text-gray-900"
            >
              #BuiltForComfort
            </button>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={() => handleNavigation('order')}
            className="px-6 py-2 rounded-lg font-semibold bg-[#0A1D3A] text-white hover:bg-[#0C2347] transition-all"
          >
            Buy Now
          </Button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;