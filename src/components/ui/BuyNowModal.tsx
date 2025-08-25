import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Heart, Star, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { EngravingTrigger } from '@/components/ui/EngravingTrigger';
import { EngravingModal } from '@/components/ui/EngravingModal';

type Image = { id: string; src: string; alt: string };
type LengthOption = { id: string; label: string; meters: number; inches: number; inStock: boolean };
type ShipFrom = { id: string; label: string };

interface BuyNowModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    detailed_description?: string;
    features?: string;
    specifications?: string;
    engraving_available?: boolean;
    engraving_price?: number;
    warranty?: string;
    installation_included?: boolean;
    image?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    stock: number;
  };
  onAddToCart: (payload: any) => Promise<void>;
  onBuyNow: (payload: any) => Promise<void>;
  onToggleFavorite?: () => void;
}

export function BuyNowModal({ open, onOpenChange, product, onAddToCart, onBuyNow, onToggleFavorite }: BuyNowModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingModalOpen, setEngravingModalOpen] = useState(false);

  // Parse features, specifications, and images
  const features = product.features ? product.features.split('\n').filter(f => f.trim()) : [];
  const specifications = product.specifications ? product.specifications.split('\n').filter(s => s.trim()) : [];
  const allImages = [product.image, product.image2, product.image3, product.image4, product.image5].filter(Boolean);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart({
        productId: product.id,
        quantity,
        engravingText: engravingText || undefined
      });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      await onBuyNow({
        productId: product.id,
        quantity,
        engravingText: engravingText || undefined
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Back Button */}
          <div className="md:col-span-2 mb-4">
            <Button
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
                // Trigger product list modal to reopen
                setTimeout(() => {
                  const event = new CustomEvent('openProductList');
                  window.dispatchEvent(event);
                }, 100);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100">
              <img
                src={allImages[selectedImage] || '/images/smart_switch/3 gang mechanical.webp'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/smart_switch/3 gang mechanical.webp';
                }}
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto justify-center">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0",
                      selectedImage === index ? "border-black" : "border-gray-200"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/smart_switch/3 gang mechanical.webp';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            {/* Category & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">{product.category}</span>
                {product.stock <= 3 && product.stock > 0 && (
                  <Badge variant="secondary" className="text-xs">Low Stock</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>
              )}
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900">
              ৳{product.price.toLocaleString()}
              {product.engraving_available && product.engraving_price && (
                <span className="text-sm text-gray-500 ml-2">
                  (+৳{product.engraving_price} for engraving)
                </span>
              )}
            </div>

            {/* Detailed Description */}
            {product.detailed_description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{product.detailed_description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {specifications.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {specifications.map((spec, index) => (
                    <div key={index}>{spec}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Installation */}
            <div className="flex gap-4">
              {product.warranty && (
                <div className="flex-1 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Warranty</div>
                  <div className="text-sm text-blue-700">{product.warranty}</div>
                </div>
              )}
              {product.installation_included && (
                <div className="flex-1 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Installation</div>
                  <div className="text-sm text-green-700">Included</div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stock Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">STOCK: </span>
                <span className={cn(
                  "font-semibold",
                  product.stock === 0 ? "text-red-600" : 
                  product.stock <= 3 ? "text-orange-600" : "text-green-600"
                )}>
                  {product.stock === 0 ? 'Out of Stock' : 
                   product.stock <= 3 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                <div>Free delivery within Dhaka</div>
                <div>Estimated Delivery: 1-3 business days</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 sticky bottom-0 bg-white border-t mt-6 -mx-6 px-6 py-4">
              {/* Engraving - Show only if available */}
              {product.engraving_available && (
                <EngravingTrigger
                  currentText={engravingText}
                  onClick={() => setEngravingModalOpen(true)}
                />
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={loading || product.stock === 0}
                  className="flex-1"
                >
                  {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </Button>
              </div>
              
              {onToggleFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Heart className="w-4 h-4" />
                  Add to Favorites
                </button>
              )}
            </div>
            
            {/* Engraving Modal - Show only if available */}
            {product.engraving_available && (
              <EngravingModal
                open={engravingModalOpen}
                onOpenChange={setEngravingModalOpen}
                productImage={allImages[selectedImage] || product.image || ''}
                initialText={engravingText}
                onSave={({ text }) => {
                  setEngravingText(text);
                  toast({
                    title: "Engraving Saved",
                    description: text ? `Engraving "${text}" added to product.` : "Engraving removed.",
                  });
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}