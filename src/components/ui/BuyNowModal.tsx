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
    brand: string;
    title: string;
    sku: string;
    rating?: number;
    reviews?: number;
    sold?: number;
    price: number;
    images: Image[];
    badges?: string[];
    shipFrom: ShipFrom[];
    lengthOptions: LengthOption[];
    shipping: { cost: number; label: string; est: string };
  };
  onAddToCart: (payload: any) => Promise<void>;
  onBuyNow: (payload: any) => Promise<void>;
  onToggleFavorite?: () => void;
}

export function BuyNowModal({ open, onOpenChange, product, onAddToCart, onBuyNow, onToggleFavorite }: BuyNowModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedShipFrom, setSelectedShipFrom] = useState(product.shipFrom[0]?.id || '');
  const [selectedLength, setSelectedLength] = useState(product.lengthOptions.find(opt => opt.inStock)?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingModalOpen, setEngravingModalOpen] = useState(false);

  const selectedLengthOption = product.lengthOptions.find(opt => opt.id === selectedLength);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart({
        productId: product.sku,
        lengthId: selectedLength,
        shipFromId: selectedShipFrom,
        quantity
      });
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      await onBuyNow({
        productId: product.sku,
        lengthId: selectedLength,
        shipFromId: selectedShipFrom,
        quantity
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
                src={product.images[selectedImage]?.src}
                alt={product.images[selectedImage]?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto justify-center">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0",
                    selectedImage === index ? "border-black" : "border-gray-200"
                  )}
                >
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            {/* Brand & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">{product.brand}</span>
                {product.badges?.map(badge => (
                  <Badge key={badge} variant="secondary" className="text-xs">{badge}</Badge>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{product.title}</h2>
              <p className="text-sm text-gray-500 mb-2">Model: {product.sku}</p>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-4 h-4", i < product.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
                      />
                    ))}
                  </div>
                  {product.reviews && <span className="text-sm text-gray-500">({product.reviews})</span>}
                  {product.sold && <Badge variant="outline" className="text-xs">{product.sold} sold</Badge>}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900">
              ৳{product.price.toFixed(2)}
            </div>

            {/* Ship From */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Ships From</label>
              <div className="flex gap-2">
                {product.shipFrom.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedShipFrom(option.id)}
                    className={cn(
                      "px-3 py-1 rounded-full border text-sm",
                      selectedShipFrom === option.id
                        ? "border-black bg-gray-100"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Length</label>
              <div className="grid grid-cols-4 gap-2">
                {product.lengthOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => option.inStock && setSelectedLength(option.id)}
                    disabled={!option.inStock}
                    className={cn(
                      "p-2 rounded-lg border text-xs text-center",
                      selectedLength === option.id
                        ? "border-black bg-gray-100 ring-2 ring-black ring-opacity-20"
                        : option.inStock
                        ? "border-gray-300 hover:border-gray-400"
                        : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-gray-500">{option.inches}" inch</div>
                  </button>
                ))}
              </div>
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

            {/* Shipping */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">SHIPPING: </span>
                <span className="font-semibold">
                  {product.shipping.cost === 0 ? 'Free Shipping' : `৳${product.shipping.cost.toFixed(2)}`}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                <div>{product.shipping.label}</div>
                <div>Estimated Delivery: {product.shipping.est}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 sticky bottom-0 bg-white border-t mt-6 -mx-6 px-6 py-4">
              {/* Engraving */}
              <EngravingTrigger
                currentText={engravingText}
                onClick={() => setEngravingModalOpen(true)}
              />
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={loading || !selectedLength}
                  className="flex-1"
                >
                  ADD TO CART
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
            
            {/* Engraving Modal */}
            <EngravingModal
              open={engravingModalOpen}
              onOpenChange={setEngravingModalOpen}
              productImage={product.images[selectedImage]?.src || ''}
              initialText={engravingText}
              onSave={({ text }) => {
                setEngravingText(text);
                toast({
                  title: "Engraving Saved",
                  description: text ? `Engraving "${text}" added to product.` : "Engraving removed.",
                });
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}