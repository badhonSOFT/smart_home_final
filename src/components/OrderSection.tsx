import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Truck, CreditCard, Shield, Info } from 'lucide-react';
import slidingImage from '@/assets/specification/slider_product.webp';
import rollerImage from '@/assets/specification/roller_product.webp';
import defaultImage from '@/assets/gallery-1.jpg';

interface OrderForm {
  curtainType: 'sliding' | 'roller' | '';
  motorType: 'wifi' | 'zigbee' | '';
  height: string;
  width: string;
  installation: 'self' | 'sohub' | '';
  remoteSetup: boolean;
  name: string;
  phone: string;
  address: string;
  payment: '10' | '100' | 'cod' | 'ssl' | '';
}

const OrderSection = () => {
  const [form, setForm] = useState<OrderForm>({
    curtainType: '',
    motorType: '',
    height: '',
    width: '',
    installation: '',
    remoteSetup: false,
    name: '',
    phone: '',
    address: '',
    payment: ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const motorTypeRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const installationRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToNext = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const prices = {
    sliding: { wifi: 36000, zigbee: 36000 },
    roller: { wifi: 13000, zigbee: 13000 }
  };

  const calculatePrice = () => {
    if (!form.curtainType || !form.motorType) return 0;
    
    let basePrice = prices[form.curtainType][form.motorType];
    const width = parseFloat(form.width || '0');
    const trackPrice = width * 500;
    const hubPrice = form.motorType === 'zigbee' ? 3000 : 0;
    const installationPrice = form.installation === 'sohub' ? 2000 : 0;
    const remoteSetupPrice = form.remoteSetup ? 1000 : 0;
    
    const subtotal = basePrice + trackPrice + hubPrice + installationPrice + remoteSetupPrice;
    const discount = form.payment === '100' ? subtotal * 0.05 : 0;
    
    return { basePrice, trackPrice, hubPrice, installationPrice, remoteSetupPrice, subtotal, discount, total: subtotal - discount };
  };

  const pricing = calculatePrice();

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const isFormValid = form.curtainType && form.motorType && form.width && 
                     form.installation && form.name && form.phone && form.address && form.payment;

  return (
    <section 
      id="order" 
      className="min-h-screen bg-background py-16 pt-24"
    >
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-headline text-primary mb-4">Order Your Curtain Luxe</h2>
          <p className="text-body text-muted-foreground">
            Configure your perfect smart curtain solution with transparent pricing.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Sticky Product Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square rounded-lg overflow-hidden shadow-medium transition-all duration-500">
              <img 
                src={
                  form.curtainType === 'sliding' ? slidingImage :
                  form.curtainType === 'roller' ? rollerImage :
                  defaultImage
                } 
                alt={
                  form.curtainType === 'sliding' ? 'Sliding curtain system' :
                  form.curtainType === 'roller' ? 'Roller curtain system' :
                  'Select curtain type'
                }
                className={`w-full h-full transition-opacity duration-300 ${
                  form.curtainType ? 'object-contain' : 'object-cover'
                }`} 
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {form.curtainType === 'sliding' ? 'Smooth • Silent • Precise' :
                 form.curtainType === 'roller' ? 'Minimal • Max Control' :
                 'Select your curtain type above'}
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              {/* Curtain Type */}
              <div className="space-y-3">
                <Label>1. Curtain Type</Label>
                <div className="space-y-3">
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.curtainType === 'sliding' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, curtainType: 'sliding' }));
                      scrollToNext(motorTypeRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.curtainType === 'sliding' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.curtainType === 'sliding' ? 'text-white' : 'text-gray-900'}`}>Sliding</h4>
                        <p className={`text-xs ${form.curtainType === 'sliding' ? 'text-gray-300' : 'text-gray-500'}`}>Smooth horizontal motion</p>
                      </div>
                    </div>
                  </Card>
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.curtainType === 'roller' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, curtainType: 'roller' }));
                      scrollToNext(motorTypeRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.curtainType === 'roller' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.curtainType === 'roller' ? 'text-white' : 'text-gray-900'}`}>Roller</h4>
                        <p className={`text-xs ${form.curtainType === 'roller' ? 'text-gray-300' : 'text-gray-500'}`}>Vertical roll mechanism</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Motor Type */}
              <div ref={motorTypeRef} className={`space-y-3 ${!form.curtainType ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label>2. Motor Type</Label>
                <div className="space-y-3">
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.motorType === 'wifi' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, motorType: 'wifi' }));
                      scrollToNext(sizeRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.motorType === 'wifi' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.motorType === 'wifi' ? 'text-white' : 'text-gray-900'}`}>Wi-Fi</h4>
                        <p className={`text-xs ${form.motorType === 'wifi' ? 'text-gray-300' : 'text-gray-500'}`}>Direct internet connection</p>
                      </div>
                    </div>
                  </Card>
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.motorType === 'zigbee' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, motorType: 'zigbee' }));
                      scrollToNext(sizeRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.motorType === 'zigbee' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.motorType === 'zigbee' ? 'text-white' : 'text-gray-900'}`}>Zigbee</h4>
                        <p className={`text-xs ${form.motorType === 'zigbee' ? 'text-gray-300' : 'text-gray-500'}`}>Mesh network protocol</p>
                      </div>
                    </div>
                  </Card>
                </div>
                {form.motorType === 'zigbee' && (
                  <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Zigbee motors require a Hub. We've added one — transparently, as part of our #BuiltForComfort model.
                    </p>
                  </div>
                )}
              </div>

              {/* Track Size */}
              <div ref={sizeRef} className={`space-y-4 ${!form.motorType ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label>3. Track Size (per feet ৳500)</Label>
                <div className="space-y-2">
                  <Label>Width (ft)</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={form.width}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, width: e.target.value }));
                      if (e.target.value) scrollToNext(installationRef);
                    }}
                  />
                </div>
              </div>

              {/* Installation */}
              <div ref={installationRef} className={`space-y-3 ${!form.width ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label>4. Installation</Label>
                <div className="space-y-3">
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.installation === 'self' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, installation: 'self' }));
                      scrollToNext(deliveryRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.installation === 'self' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.installation === 'self' ? 'text-white' : 'text-gray-900'}`}>Self Install</h4>
                        <p className={`text-xs ${form.installation === 'self' ? 'text-gray-300' : 'text-gray-500'}`}>DIY with guide</p>
                      </div>
                    </div>
                  </Card>
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.installation === 'sohub' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, installation: 'sohub', remoteSetup: false }));
                      scrollToNext(deliveryRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.installation === 'sohub' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.installation === 'sohub' ? 'text-white' : 'text-gray-900'}`}>SOHUB Install</h4>
                        <p className={`text-xs ${form.installation === 'sohub' ? 'text-gray-300' : 'text-gray-500'}`}>+৳2,000</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Remote Setup */}
              {form.installation !== 'sohub' && (
                <div className={`flex items-center justify-between ${!form.installation ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Label>5. Remote Setup (+৳1,000)</Label>
                  <Switch 
                    checked={form.remoteSetup}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, remoteSetup: checked }))}
                  />
                </div>
              )}

              <Separator />

              {/* Delivery Details */}
              <div ref={deliveryRef} className={`space-y-4 ${!form.installation ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="font-semibold">6. Delivery Details</h3>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input 
                    placeholder="Complete delivery address"
                    value={form.address}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, address: e.target.value }));
                      if (e.target.value && form.name && form.phone) scrollToNext(paymentRef);
                    }}
                  />
                </div>
              </div>

              {/* Payment */}
              <div ref={paymentRef} className={`space-y-3 ${!form.name || !form.phone || !form.address ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label>7. Payment Option</Label>
                <div className="space-y-3">
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.payment === '10' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, payment: '10' }));
                      scrollToNext(confirmButtonRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.payment === '10' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.payment === '10' ? 'text-white' : 'text-gray-900'}`}>Advance</h4>
                        <p className={`text-xs ${form.payment === '10' ? 'text-gray-300' : 'text-gray-500'}`}>Pay 10% now</p>
                      </div>
                    </div>
                  </Card>
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg relative ${
                      form.payment === '100' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, payment: '100' }));
                      scrollToNext(confirmButtonRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.payment === '100' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.payment === '100' ? 'text-white' : 'text-gray-900'}`}>Full Payment</h4>
                        <p className="text-xs text-green-600 font-medium">5% Discount</p>
                      </div>
                    </div>
                    {form.payment === '100' && (
                      <div className="absolute -top-1 -right-1">
                        <Badge className="bg-green-500 text-white text-xs px-1 py-0.5">
                          SAVE 5%
                        </Badge>
                      </div>
                    )}
                  </Card>
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.payment === 'cod' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, payment: 'cod' }));
                      scrollToNext(confirmButtonRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.payment === 'cod' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.payment === 'cod' ? 'text-white' : 'text-gray-900'}`}>Cash on Delivery</h4>
                        <p className={`text-xs ${form.payment === 'cod' ? 'text-gray-300' : 'text-gray-500'}`}>Pay when delivered</p>
                      </div>
                    </div>
                  </Card>
                  <Card 
                    className={`p-3 cursor-pointer transition-all border-2 rounded-lg ${
                      form.payment === 'ssl' 
                        ? 'border-black bg-gray-800 text-white' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, payment: 'ssl' }));
                      scrollToNext(confirmButtonRef);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        {form.payment === 'ssl' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${form.payment === 'ssl' ? 'text-white' : 'text-gray-900'}`}>SSL Payment</h4>
                        <p className={`text-xs ${form.payment === 'ssl' ? 'text-gray-300' : 'text-gray-500'}`}>Secure online payment</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Price Summary */}
              {typeof pricing === 'object' && pricing.total > 0 && (
                <Card className="p-4 bg-surface">
                  <h4 className="font-semibold mb-3">Price Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Curtain + Motor</span>
                      <span>৳{pricing.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Track ({form.width} ft width)</span>
                      <span>৳{pricing.trackPrice.toLocaleString()}</span>
                    </div>
                    {pricing.hubPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Zigbee Hub</span>
                        <span>৳{pricing.hubPrice.toLocaleString()}</span>
                      </div>
                    )}
                    {pricing.installationPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Installation</span>
                        <span>৳{pricing.installationPrice.toLocaleString()}</span>
                      </div>
                    )}
                    {pricing.remoteSetupPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Remote Setup</span>
                        <span>৳{pricing.remoteSetupPrice.toLocaleString()}</span>
                      </div>
                    )}
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (5%)</span>
                        <span>-৳{pricing.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>৳{pricing.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    What you see is what you pay — no hidden markup, no branding tax. This is #BuiltForComfort.
                  </p>
                </Card>
              )}

              {/* Delivery & Payment Info */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Truck className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">3-4 Weeks</p>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                </div>
                <div className="space-y-2">
                  <CreditCard className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Multiple</p>
                  <p className="text-xs text-muted-foreground">Payment Methods</p>
                </div>
                <div className="space-y-2">
                  <Shield className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Secure</p>
                  <p className="text-xs text-muted-foreground">SSL Protected</p>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground italic">
                "We never inflate prices to offer fake discounts. We price honestly from the start."
              </p>

              {/* Submit Button */}
              <Button 
                ref={confirmButtonRef}
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full btn-cta"
              >
                Confirm Order
              </Button>

              {/* Success Message */}
              {showSuccess && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Order Confirmed!</p>
                      <p className="text-sm">We'll contact you within 24 hours to finalize details.</p>
                      <p className="text-xs mt-1">Timeline: Design → Production → Delivery (3-4 weeks)</p>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;