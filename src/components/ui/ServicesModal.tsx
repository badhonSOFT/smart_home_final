import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface ServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
  onAddToCart: (serviceItem: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    color: string;
    quantity: number;
  }) => void;
}

const consultancyServices = [
  {
    id: 'smart-curtain-consultation',
    name: 'Smart Curtain Consultation',
    description: 'Expert advice on smart curtain solutions',
    price: 0,
    image: '/assets/hero-sliding-curtain.jpg'
  },
  {
    id: 'smart-switch-consultation',
    name: 'Smart Switch Consultation',
    description: 'Professional guidance on smart switch setup',
    price: 0,
    image: '/images/smart_switch/3 gang mechanical.webp'
  },
  {
    id: 'security-consultation',
    name: 'Security System Consultation',
    description: 'Security system planning and advice',
    price: 0,
    image: '/assets/gallery-1.jpg'
  },
  {
    id: 'film-consultation',
    name: 'PDLC Film Consultation',
    description: 'Smart film installation guidance',
    price: 0,
    image: '/assets/window.jpeg'
  },
  {
    id: 'smart-home-consultation',
    name: 'Smart Home Consultation',
    description: 'Complete smart home automation planning and advice',
    price: 0,
    image: '/images/services/services.png'
  },
  {
    id: 'warranty-support',
    name: 'Warranty Support',
    description: 'Extended warranty and support service',
    price: 0,
    image: '/assets/gallery-4.jpg'
  }
];

export function ServicesModal({ open, onOpenChange, onBack, onAddToCart }: ServicesModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddToCart = () => {
    selectedServices.forEach(serviceId => {
      const service = consultancyServices.find(s => s.id === serviceId);
      if (service) {
        const cartItem = {
          id: service.id,
          name: service.name,
          price: service.price,
          category: 'Services',
          image: service.image,
          color: service.price === 0 ? 'Free' : `৳${service.price}`,
          quantity: 1
        };
        onAddToCart(cartItem);
      }
    });
    onOpenChange(false);
    setSelectedServices([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  onOpenChange(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <DialogTitle>Select Consultancy Services</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">Choose the consultancy services you need:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {consultancyServices.map((service) => (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedServices.includes(service.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{service.name}</h4>
                      <Badge variant={service.price === 0 ? 'secondary' : 'default'}>
                        {service.price === 0 ? 'Free' : `৳${service.price}`}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedServices.length} service(s) selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToCart} disabled={selectedServices.length === 0}>
              Add to Cart ({selectedServices.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}