"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { BuyNowModal } from "@/components/ui/BuyNowModal";
import { productData } from "@/lib/productData";
import { ProductListModal } from "@/components/ui/ProductListModal";
import { ServicesModal } from "@/components/ui/ServicesModal";
import { InstallationModal } from "@/components/ui/InstallationModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Truck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSupabase, productService, categoryService, orderService } from "@/supabase";
import { useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    color: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface InteractiveCheckoutProps {
    products?: Product[];
}

const defaultProducts: Product[] = [
    {
        id: "1",
        name: "Smart Switch",
        price: 2500,
        category: "Switch",
        image: "/images/smart_switch/3 gang mechanical.webp",
        color: "White",
    },
    {
        id: "2",
        name: "Smart Curtain",
        price: 25000,
        category: "Curtain",
        image: "/assets/hero-sliding-curtain.jpg",
        color: "Gray",
    },
    {
        id: "3",
        name: "Security",
        price: 8500,
        category: "Security",
        image: "/assets/gallery-1.jpg",
        color: "Black",
    },
    {
        id: "4",
        name: "PDLC Film",
        price: 15000,
        category: "Film",
        image: "/assets/window.jpeg",
        color: "Clear",
    },
];

const getCategoryProducts = (dbProducts: any[], categoryImages: any[]) => {
    const categories = ['Smart Curtain', 'Smart Switch', 'Security', 'Film', 'Services'];
    return categories.map((category, index) => {
        const categoryImagesForCategory = categoryImages.filter(img => img.category === category);
        const firstCategoryImage = categoryImagesForCategory[0];
        const categoryProducts = dbProducts.filter(p => p.category === category);
        const firstProduct = categoryProducts[0];
        
        return {
            id: (index + 1).toString(),
            name: category,
            price: category === 'Services' ? 0 : (firstProduct?.price || 0),
            category: category,
            image: category === 'Services' ? '/images/services/services.png' : (firstCategoryImage?.image_url || firstProduct?.image || '/images/smart_switch/3 gang mechanical.webp'),
            color: category === 'Services' ? 'Available' : 'Available'
        };
    });
};



function InteractiveCheckout({
    products = defaultProducts,
}: InteractiveCheckoutProps) {
    const { loading, executeQuery } = useSupabase();
    const navigate = useNavigate();
    const [dbProducts, setDbProducts] = useState<any[]>([]);
    const [categoryImages, setCategoryImages] = useState<any[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productListOpen, setProductListOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);
    const [installationModalOpen, setInstallationModalOpen] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderLoading, setOrderLoading] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCategoryImages();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await executeQuery(() => productService.getProducts());
            setDbProducts(data || []);
        } catch (err) {
            console.error('Failed to load products:', err);
        }
    };

    const loadCategoryImages = async () => {
        try {
            const data = await executeQuery(() => categoryService.getCategoryImages());
            setCategoryImages(data || []);
        } catch (err) {
            console.error('Failed to load category images:', err);
        }
    };

    const getProductsByCategory = (category: string) => {
        // Handle Services category separately
        if (category === 'Services') {
            return [
                {
                    id: 'service-1',
                    name: 'Consultancy Services',
                    price: 'Free',
                    gangType: 'Consultancy',
                    imageUrl: '/images/services/services.png',
                    isSoldOut: false
                },
                {
                    id: 'service-2',
                    name: 'Installation Services',
                    price: 'Starting from ৳800',
                    gangType: 'Installation',
                    imageUrl: '/images/services/repair.png',
                    isSoldOut: false
                }
            ];
        }
        
        // Always return actual products from database for other categories
        return dbProducts
            .filter(p => p.category === category && p.stock > 0)
            .map(p => ({
                id: p.id,
                name: p.name,
                price: `${p.price.toLocaleString()}৳`,
                gangType: p.category,
                imageUrl: p.image || '/images/smart_switch/one gang.webp',
                isSoldOut: p.stock === 0
            }));
    };

    // Listen for back button event from BuyNowModal
    useState(() => {
        const handleOpenProductList = () => {
            setProductListOpen(true);
        };
        window.addEventListener('openProductList', handleOpenProductList);
        return () => window.removeEventListener('openProductList', handleOpenProductList);
    });

    const addToCart = (product: Product) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.id === product.id
            );
            if (existingItem) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0
                        ? { ...item, quantity: newQuantity }
                        : item;
                }
                return item;
            })
        );
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex gap-8">
                <div className="flex-1 space-y-4">
                    {(dbProducts.length > 0 ? getCategoryProducts(dbProducts, categoryImages) : products).map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "group cursor-pointer",
                                "p-4 rounded-xl",
                                "bg-white dark:bg-zinc-900",
                                "border border-zinc-200 dark:border-zinc-800",
                                "hover:border-zinc-300 dark:hover:border-zinc-700",
                                "transition-all duration-200",
                                "hover:shadow-lg"
                            )}
                            onClick={() => {
                                if (product.id === "1") {
                                    setSelectedCategory("Smart Curtain");
                                    setProductListOpen(true);
                                } else if (product.id === "2") {
                                    setSelectedCategory("Smart Switch");
                                    setProductListOpen(true);
                                } else if (product.id === "3") {
                                    setSelectedCategory("Security");
                                    setProductListOpen(true);
                                } else if (product.id === "4") {
                                    setSelectedCategory("Film");
                                    setProductListOpen(true);
                                } else if (product.id === "5") {
                                    setSelectedCategory("Services");
                                    setProductListOpen(true);
                                } else {
                                    setSelectedProduct(product.id);
                                    setModalOpen(true);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "relative w-12 h-12 rounded-lg overflow-hidden",
                                        "bg-zinc-100 dark:bg-zinc-800",
                                        "transition-colors duration-200",
                                        "group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                                    )}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                            {product.name}
                                        </h3>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        <span>{product.color}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cart Sidebar / Checkout */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                        "w-[480px] flex flex-col",
                        "p-6 rounded-xl",
                        "bg-white dark:bg-zinc-900",
                        "border border-zinc-200 dark:border-zinc-800",
                        "sticky top-4",
                        "max-h-[40rem]",
                        "shadow-lg"
                    )}
                >
                    {showCheckout ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCheckout(false)}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Cart
                                </Button>
                            </div>
                            
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                                Checkout
                            </h2>
                            
                            <div className="flex-1 overflow-y-auto -mx-4 px-4">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setOrderLoading(true);
                                    try {
                                        const orderData = {
                                            customer_name: formData.name,
                                            customer_email: formData.email,
                                            customer_phone: formData.phone,
                                            customer_address: formData.address,
                                            items: cart.map(item => ({
                                                product_id: item.id,
                                                product_name: item.name,
                                                quantity: item.quantity,
                                                price: item.price,
                                                category: item.category
                                            })),
                                            total_amount: totalPrice,
                                            payment_method: totalPrice > 0 ? paymentMethod : 'free'
                                        };
                                        
                                        const createdOrder = await executeQuery(() => orderService.createOrder(orderData));
                                        
                                        setCart([]);
                                        setShowCheckout(false);
                                        setFormData({ name: '', email: '', phone: '', address: '' });
                                        
                                        // Navigate to thank you page with order data including the real order number
                                        const orderWithNumber = { ...orderData, order_number: createdOrder.order_number };
                                        navigate(`/thank-you?data=${encodeURIComponent(JSON.stringify(orderWithNumber))}`);
                                    } finally {
                                        setOrderLoading(false);
                                    }
                                }} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            required
                                            className="mt-1"
                                        />
                                    </div>

                                    {totalPrice > 0 && (
                                        <div>
                                            <Label className="text-sm font-medium">Payment Method</Label>
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                                    <input 
                                                        type="radio" 
                                                        id="cod" 
                                                        name="payment" 
                                                        value="cod" 
                                                        checked={paymentMethod === 'cod'}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-4 h-4"
                                                    />
                                                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer text-sm flex-1">
                                                        <Truck className="w-4 h-4" />
                                                        Cash on Delivery
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                                    <input 
                                                        type="radio" 
                                                        id="online" 
                                                        name="payment" 
                                                        value="online" 
                                                        checked={paymentMethod === 'online'}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-4 h-4"
                                                    />
                                                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer text-sm flex-1">
                                                        <CreditCard className="w-4 h-4" />
                                                        Online Payment
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>

                            <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
                                {totalPrice > 0 && (
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Total</span>
                                        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">৳{totalPrice.toLocaleString()}</span>
                                    </div>
                                )}
                                {totalPrice === 0 && (
                                    <div className="text-center mb-4">
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Free Consultation Service</span>
                                    </div>
                                )}
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={orderLoading || loading}
                                    onClick={async () => {
                                        setOrderLoading(true);
                                        try {
                                            const orderData = {
                                                customer_name: formData.name,
                                                customer_email: formData.email,
                                                customer_phone: formData.phone,
                                                customer_address: formData.address,
                                                items: cart.map(item => ({
                                                    product_id: item.id,
                                                    product_name: item.name,
                                                    quantity: item.quantity,
                                                    price: item.price,
                                                    category: item.category
                                                })),
                                                total_amount: totalPrice,
                                                payment_method: totalPrice > 0 ? paymentMethod : 'free'
                                            };
                                            
                                            const createdOrder = await executeQuery(() => orderService.createOrder(orderData));
                                            
                                            setCart([]);
                                            setShowCheckout(false);
                                            setFormData({ name: '', email: '', phone: '', address: '' });
                                            
                                            // Navigate to thank you page with order data including the real order number
                                            const orderWithNumber = { ...orderData, order_number: createdOrder.order_number };
                                            navigate(`/thank-you?data=${encodeURIComponent(JSON.stringify(orderWithNumber))}`);
                                        } finally {
                                            setOrderLoading(false);
                                        }
                                    }}
                                >
                                    {orderLoading ? 'Processing...' : 'Confirm Order'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <ShoppingCart className="w-5 h-5 text-zinc-500" />
                                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                    Cart ({totalItems})
                                </h2>
                            </div>

                            <motion.div
                                className={cn(
                                    "flex-1 overflow-y-auto",
                                    "min-h-0",
                                    "-mx-4 px-4",
                                    "space-y-3"
                                )}
                            >
                                <AnimatePresence initial={false} mode="popLayout">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-sm">Your cart is empty</p>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.96 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.96 }}
                                                transition={{
                                                    opacity: { duration: 0.2 },
                                                    layout: { duration: 0.2 },
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3",
                                                    "p-2 rounded-lg",
                                                    "bg-zinc-50 dark:bg-zinc-800/50",
                                                    "mb-3"
                                                )}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                            {item.name}
                                                        </span>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() =>
                                                                removeFromCart(item.id)
                                                            }
                                                            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                        >
                                                            <X className="w-3 h-3 text-zinc-400" />
                                                        </motion.button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        -1
                                                                    )
                                                                }
                                                                className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </motion.button>
                                                            <motion.span
                                                                layout
                                                                className="text-xs text-zinc-600 dark:text-zinc-400 w-4 text-center"
                                                            >
                                                                {item.quantity}
                                                            </motion.span>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        1
                                                                    )
                                                                }
                                                                className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </motion.button>
                                                        </div>
                                                        <motion.span
                                                            layout
                                                            className="text-xs text-zinc-500 dark:text-zinc-400"
                                                        >
                                                            ৳
                                                            {(
                                                                item.price * item.quantity
                                                            ).toLocaleString()}
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            
                            <motion.div
                                layout
                                className={cn(
                                    "pt-3 mt-3",
                                    "border-t border-zinc-200 dark:border-zinc-800",
                                    "bg-white dark:bg-zinc-900"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        Total
                                    </span>
                                    <motion.span
                                        layout
                                        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                                    >
                                        ৳<NumberFlow value={totalPrice} />
                                    </motion.span>
                                </div>
                                <Button 
                                    size="sm" 
                                    className="w-full gap-2" 
                                    disabled={cart.length === 0}
                                    onClick={() => setShowCheckout(true)}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Checkout
                                </Button>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </div>
            
            {/* Product List Modal */}
            <ProductListModal
                open={productListOpen}
                onOpenChange={(open) => {
                    setProductListOpen(open);
                    if (!open) {
                        // Add slight delay to show the underlying modal
                        setTimeout(() => {}, 100);
                    }
                }}
                title={`${selectedCategory} Products`}
                products={getProductsByCategory(selectedCategory)}
                onProductClick={(productId) => {
                    if (productId === 'service-1') {
                        // Open services modal for consultancy
                        setServicesModalOpen(true);
                        setProductListOpen(false);
                        return;
                    }
                    
                    if (productId === 'service-2') {
                        // Open installation modal
                        setInstallationModalOpen(true);
                        setProductListOpen(false);
                        return;
                    }
                    
                    const productList = getProductsByCategory(selectedCategory);
                    const variant = productList.find(p => p.id === productId);
                    setSelectedVariant(variant);
                    setProductListOpen(false);
                    setSelectedProduct(
                        selectedCategory === "Smart Curtain" ? "1" :
                        selectedCategory === "Smart Switch" ? "2" : "3"
                    );
                    setModalOpen(true);
                }}
                onAddToCart={(product) => {
                    if (product.id === 'service-1') {
                        // Open services modal for service selection
                        setServicesModalOpen(true);
                        setProductListOpen(false);
                        return;
                    }
                    
                    const cartItem: CartItem = {
                        id: product.id,
                        name: product.name,
                        price: parseInt(product.price.replace(/[^0-9]/g, '')) || 0,
                        category: product.gangType || 'Product',
                        image: product.imageUrl,
                        color: product.gangType || 'Default',
                        quantity: 1
                    };
                    addToCart(cartItem);
                    toast({
                        title: "Added to Cart",
                        description: `${product.name} has been added to your cart.`,
                    });
                }}
            />
            
            {/* Buy Now Modal */}
            {selectedProduct && selectedVariant && (
                <BuyNowModal
                    open={modalOpen}
                    onOpenChange={(open) => {
                        setModalOpen(open);
                        if (!open) {
                            setSelectedVariant(null);
                        }
                    }}
                    product={{
                        id: selectedVariant.id,
                        name: selectedVariant.name,
                        category: selectedVariant.gangType || 'Product',
                        price: parseInt(selectedVariant.price.replace(/[^0-9]/g, '')),
                        description: dbProducts.find(p => p.id === selectedVariant.id)?.description || '',
                        detailed_description: dbProducts.find(p => p.id === selectedVariant.id)?.detailed_description || '',
                        features: dbProducts.find(p => p.id === selectedVariant.id)?.features || '',
                        specifications: dbProducts.find(p => p.id === selectedVariant.id)?.specifications || '',
                        engraving_available: dbProducts.find(p => p.id === selectedVariant.id)?.engraving_available || false,
                        engraving_price: dbProducts.find(p => p.id === selectedVariant.id)?.engraving_price || 0,
                        warranty: dbProducts.find(p => p.id === selectedVariant.id)?.warranty || '',
                        installation_included: dbProducts.find(p => p.id === selectedVariant.id)?.installation_included || false,
                        image: selectedVariant.imageUrl,
                        image2: dbProducts.find(p => p.id === selectedVariant.id)?.image2 || '',
                        image3: dbProducts.find(p => p.id === selectedVariant.id)?.image3 || '',
                        image4: dbProducts.find(p => p.id === selectedVariant.id)?.image4 || '',
                        image5: dbProducts.find(p => p.id === selectedVariant.id)?.image5 || '',
                        stock: dbProducts.find(p => p.id === selectedVariant.id)?.stock || 0
                    }}
                    onAddToCart={async (payload) => {
                        if (selectedVariant) {
                            // Calculate price with engraving
                            const basePrice = parseInt(selectedVariant.price.replace(/[^0-9]/g, ''));
                            const productData = dbProducts.find(p => p.id === selectedVariant.id);
                            const engravingPrice = payload.engravingText && productData?.engraving_price ? productData.engraving_price : 0;
                            const totalPrice = basePrice + engravingPrice;
                            
                            // Add multiple items based on quantity
                            for (let i = 0; i < (payload.quantity || 1); i++) {
                                const cartItem: CartItem = {
                                    id: selectedVariant.id,
                                    name: payload.engravingText ? `${selectedVariant.name} (Engraved: "${payload.engravingText}")` : selectedVariant.name,
                                    price: totalPrice,
                                    category: selectedVariant.gangType || 'Product',
                                    image: selectedVariant.imageUrl,
                                    color: selectedVariant.gangType || 'Default',
                                    quantity: 1
                                };
                                addToCart(cartItem);
                            }
                            toast({
                                title: "Added to Cart",
                                description: `${payload.quantity || 1} x ${selectedVariant.name} added to your cart.`,
                            });
                        }
                    }}
                    onBuyNow={async (payload) => {
                        console.log('Buy now:', payload);
                    }}
                    onToggleFavorite={() => {
                        console.log('Toggle favorite');
                    }}
                />
            )}
            
            {/* Services Selection Modal */}
            <ServicesModal
                open={servicesModalOpen}
                onOpenChange={setServicesModalOpen}
                onBack={() => {
                    setServicesModalOpen(false);
                    setProductListOpen(true);
                }}
                onAddToCart={(cartItem) => {
                    addToCart(cartItem);
                    toast({
                        title: "Added to Cart",
                        description: `${cartItem.name} has been added to your cart.`,
                    });
                }}
            />
            
            {/* Installation Services Modal */}
            <InstallationModal
                open={installationModalOpen}
                onOpenChange={setInstallationModalOpen}
                onBack={() => {
                    setInstallationModalOpen(false);
                    setProductListOpen(true);
                }}
                onAddToCart={(cartItem) => {
                    addToCart(cartItem);
                    toast({
                        title: "Added to Cart",
                        description: `${cartItem.name} has been added to your cart.`,
                    });
                }}
            />
            

        </div>
    );
}

export { InteractiveCheckout, type Product };