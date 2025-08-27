import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Minus, Plus, Heart, Star, ArrowLeft, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { EngravingTrigger } from '@/components/ui/EngravingTrigger';
import { EngravingModal } from '@/components/ui/EngravingModal';

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
    engraving_image?: string;
    engraving_text_color?: string;
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
      onOpenChange(false);
    } catch (error) {
      console.error('Add to cart failed:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
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
    } catch (error) {
      console.error('Buy now failed:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to process purchase. Please try again.",
        variant: "destructive"
      });
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
          <div className="flex gap-4">
            {/* Thumbnail Column */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-2 w-20">
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
            
            {/* Main Image */}
            <div className="flex-1">
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
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
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-600">{product.category}</span>
              {product.stock <= 3 && product.stock > 0 && (
                <Badge variant="secondary" className="text-xs">Low Stock</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900">
              ৳{product.price.toLocaleString()}
              {product.engraving_available && product.engraving_price && (
                <span className="text-sm text-gray-500 ml-2">
                  (+৳{product.engraving_price} for engraving)
                </span>
              )}
            </div>

            {/* Product Details Accordion */}
            <Accordion type="multiple" defaultValue={["description"]} className="w-full">
              {/* Description */}
              {(product.description || product.detailed_description) && (
                <AccordionItem value="description" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700 whitespace-pre-line pb-4">
                    {product.description && (
                      <p className="mb-3">{product.description}</p>
                    )}
                    {product.detailed_description && (
                      <div>{product.detailed_description}</div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Features */}
              {features.length > 0 && (
                <AccordionItem value="features" className="border rounded-lg px-4 mt-2">
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                    Features
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Specifications */}
              {specifications.length > 0 && (
                <AccordionItem value="specifications" className="border rounded-lg px-4 mt-2">
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="text-sm text-gray-700 space-y-2">
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          {spec}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Warranty & Installation */}
            <div className="flex gap-3">
              {product.warranty && (
                <div className="flex-1 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-blue-900">Warranty</div>
                  <div className="text-sm text-blue-700">{product.warranty}</div>
                </div>
              )}
              {product.installation_included && (
                <div className="flex-1 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="text-sm font-semibold text-green-900">Installation</div>
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



            {/* Actions */}
            <div className="space-y-3 pt-4 sticky bottom-0 bg-white border-t mt-6 -mx-6 px-6 py-4">
              {/* Engraving - Show only if available */}
              {product.engraving_available && (
                <EngravingTrigger
                  currentText={engravingText}
                  productName={product.name}
                  onClick={() => setEngravingModalOpen(true)}
                />
              )}
              
              <Button
                variant="outline"
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
                className="w-full"
              >
                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
              </Button>
            </div>
            
            {/* Engraving Modal - Show only if available */}
            {product.engraving_available && (
              <EngravingModal
                open={engravingModalOpen}
                onOpenChange={setEngravingModalOpen}
                productImage={allImages[selectedImage] || product.image || ''}
                engravingImage={product.engraving_image}
                productName={product.name}
                engravingTextColor={product.engraving_text_color}
                initialText={engravingText}
                onSave={({ text }) => {
                  setEngravingText(text);
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}