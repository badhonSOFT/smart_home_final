"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { BuyNowModal } from "@/components/ui/BuyNowModal";
import { productData } from "@/lib/productData";

import { ServicesModal } from "@/components/ui/ServicesModal";
import { InstallationModal } from "@/components/ui/InstallationModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Truck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSupabase, productService, categoryService } from "@/supabase";
import { orderService } from "@/supabase/orders";
import { useNavigate } from "react-router-dom";
import { SaveEmailModal } from "@/components/ui/SaveEmailModal";
import { Mail, Printer } from "lucide-react";

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
    const categories = ['Smart Curtain', 'Smart Switch', 'Security', 'PDLC Film', 'Services'];
    return categories.map((category, index) => {
        // Handle both 'Film' and 'PDLC Film' for category images
        const categoryImagesForCategory = categoryImages.filter(img => 
            img.category === category || (category === 'PDLC Film' && img.category === 'Film')
        );
        const firstCategoryImage = categoryImagesForCategory[0];
        
        // Handle both 'Film' and 'PDLC Film' for products
        const categoryFilter = category === 'PDLC Film' ? ['Film', 'PDLC Film'] : [category];
        const categoryProducts = dbProducts.filter(p => categoryFilter.includes(p.category));
        const firstProduct = categoryProducts[0];
        
        const getImageForCategory = () => {
            if (category === 'Services') return '/images/services/services.png';
            if (category === 'Smart Curtain') return firstCategoryImage?.image_url || '/assets/hero-sliding-curtain.jpg';
            if (category === 'Smart Switch') return firstCategoryImage?.image_url || '/images/smart_switch/3 gang mechanical.webp';
            if (category === 'Security') return firstCategoryImage?.image_url || '/assets/gallery-1.jpg';
            if (category === 'PDLC Film') return firstCategoryImage?.image_url || '/assets/window.jpeg';
            return firstCategoryImage?.image_url || firstProduct?.image || '/images/smart_switch/3 gang mechanical.webp';
        };
        
        return {
            id: (index + 1).toString(),
            name: category,
            price: category === 'Services' ? 0 : (firstProduct?.price || 0),
            category: category,
            image: getImageForCategory(),
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
    const [activeCategory, setActiveCategory] = useState('Smart Curtain');
    const [isManualSelection, setIsManualSelection] = useState(false);
    const [activeField, setActiveField] = useState('name');
    const [saveEmailModalOpen, setSaveEmailModalOpen] = useState(false);
    const [showMobileCart, setShowMobileCart] = useState(false);

    const categoryToIdMap: { [key: string]: string } = {
        'Smart Curtain': '1',
        'Smart Switch': '2',
        'Security': '3',
        'PDLC Film': '3'
    };

    const calculateItemPrice = (selectedVariant: any, payload: any, dbProducts: any[]) => {
        const basePrice = parseInt(selectedVariant.price.replace(/[^0-9]/g, ''), 10) || 0;
        const productData = dbProducts.find(p => p.id === selectedVariant.id);
        const engravingPrice = payload.engravingText && productData?.engraving_price ? productData.engraving_price : 0;
        return { basePrice, engravingPrice, totalPrice: basePrice + engravingPrice, productData };
    };

    const createCartItem = (selectedVariant: any, payload: any, totalPrice: number): CartItem => {
        return {
            id: selectedVariant.id,
            name: payload.engravingText ? `${selectedVariant.name} (Engraved: "${payload.engravingText}")` : selectedVariant.name,
            price: totalPrice,
            category: selectedVariant.gangType || 'Product',
            image: selectedVariant.imageUrl,
            color: selectedVariant.gangType || 'Default',
            quantity: payload.quantity || 1
        };
    };

    const handleOrderSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Validate form data
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }
        
        if (cart.length === 0) {
            toast({
                title: "Empty Cart",
                description: "Please add items to your cart before checkout.",
                variant: "destructive"
            });
            return;
        }
        
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
            
            console.log('Submitting order:', JSON.stringify(orderData, null, 2));
            const createdOrder = await orderService.createOrder(orderData);
            console.log('Order created:', JSON.stringify(createdOrder, null, 2));
            
            if (!createdOrder) {
                throw new Error('Order creation failed - no data returned');
            }
            
            // Clear form and cart
            setCart([]);
            setShowCheckout(false);
            setShowMobileCart(false);
            setFormData({ name: '', email: '', phone: '', address: '' });
            
            // Navigate to thank you page
            const orderWithNumber = { ...orderData, order_number: createdOrder.order_number };
            navigate(`/thank-you?data=${encodeURIComponent(JSON.stringify(orderWithNumber))}`);
            
            toast({
                title: "Order Confirmed!",
                description: `Order ${createdOrder.order_number} has been placed successfully.`,
            });
        } catch (error) {
            console.error('Order submission failed:', JSON.stringify(error, null, 2));
            toast({
                title: "Order Failed",
                description: error instanceof Error ? error.message : "Failed to submit order. Please try again.",
                variant: "destructive"
            });
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategoryImages();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await executeQuery(() => productService.getProducts());
            setDbProducts(data || []);
        } catch (err) {
            console.error('Failed to load products:', JSON.stringify(err, null, 2));
        }
    };

    const loadCategoryImages = async () => {
        try {
            const data = await executeQuery(() => categoryService.getCategoryImages());
            setCategoryImages(data || []);
        } catch (err) {
            console.error('Failed to load category images:', JSON.stringify(err, null, 2));
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
        // Handle both 'Film' and 'PDLC Film' for backward compatibility
        const categoryFilter = category === 'PDLC Film' ? ['Film', 'PDLC Film'] : [category];
        return dbProducts
            .filter(p => categoryFilter.includes(p.category) && p.stock > 0)
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
    useEffect(() => {
        const handleOpenProductList = () => {
            // Handle back navigation if needed
        };
        window.addEventListener('openProductList', handleOpenProductList);
        return () => window.removeEventListener('openProductList', handleOpenProductList);
    }, []);

    const addToCart = (product: Product | CartItem) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.id === product.id
            );
            const quantityToAdd = 'quantity' in product ? product.quantity : 1;
            if (existingItem) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }
            return [...currentCart, { ...product, quantity: quantityToAdd }];
        });
        setShowMobileCart(true);
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

    const categories = dbProducts.length > 0 ? getCategoryProducts(dbProducts, categoryImages) : products;
    
    // Get all products grouped by category
    const allProductsByCategory = categories.map(category => {
        const products = getProductsByCategory(category.category);
        // Debug: Category products loaded
        return {
            category: category.category,
            products: products
        };
    });

    // Auto-select category based on scroll position
    useEffect(() => {
        let throttleTimer: NodeJS.Timeout | null = null;
        
        const handleScroll = () => {
            if (throttleTimer) return;
            
            throttleTimer = setTimeout(() => {
                if (isManualSelection) {
                    throttleTimer = null;
                    return;
                }
                
                const container = document.querySelector('.products-scroll-container');
                if (!container) {
                    throttleTimer = null;
                    return;
                }
                
                const containerRect = container.getBoundingClientRect();
                const headerOffset = 140;
                
                let visibleCategory = activeCategory;
                let maxVisibility = 0;
                
                allProductsByCategory.forEach(group => {
                    const element = document.getElementById(`category-${group.category.replace(/\s+/g, '-')}`);
                    if (element) {
                        const elementRect = element.getBoundingClientRect();
                        const relativeTop = elementRect.top - containerRect.top - headerOffset;
                        
                        if (relativeTop <= 50 && relativeTop > -element.offsetHeight + 100) {
                            const visibility = Math.max(0, Math.min(100, 100 - Math.abs(relativeTop)));
                            if (visibility > maxVisibility) {
                                maxVisibility = visibility;
                                visibleCategory = group.category;
                            }
                        }
                    }
                });
                
                if (visibleCategory !== activeCategory) {
                    setActiveCategory(visibleCategory);
                }
                
                throttleTimer = null;
            }, 100);
        };

        const scrollContainer = document.querySelector('.products-scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
                if (throttleTimer) clearTimeout(throttleTimer);
            };
        }
    }, [allProductsByCategory, activeCategory, isManualSelection]);

    return (
        <>
            <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row gap-2 lg:gap-6 bg-gradient-to-br from-gray-50 to-white rounded-none lg:rounded-2xl overflow-hidden">
            {/* Left Side - Scrollable Products */}
            <div className="flex-1 overflow-y-auto products-scroll-container h-[60vh] lg:h-[calc(100vh-200px)] min-h-[400px]">
                {/* Category Tabs */}
                <div className="mb-4 lg:mb-6 sticky top-[80px] lg:top-0 bg-white z-40 pb-3 lg:pb-4 pt-1 lg:pt-2 shadow-sm lg:shadow-none">
                    <div className="grid grid-cols-5 lg:grid-cols-5 gap-1 lg:gap-3 px-3 lg:px-4">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => {
                                    setIsManualSelection(true);
                                    setActiveCategory(category.category);
                                    
                                    setTimeout(() => {
                                        const targetId = `category-${category.category.replace(/\s+/g, '-')}`;
                                        const element = document.getElementById(targetId);
                                        const container = document.querySelector('.products-scroll-container');
                                        
                                        if (element && container) {
                                            const isMobile = window.innerWidth < 1024;
                                            const containerRect = container.getBoundingClientRect();
                                            const elementRect = element.getBoundingClientRect();
                                            
                                            if (isMobile) {
                                                // Mobile scroll - account for sticky header
                                                const scrollOffset = container.scrollTop + (elementRect.top - containerRect.top) - 120;
                                                container.scrollTo({
                                                    top: Math.max(0, scrollOffset),
                                                    behavior: 'smooth'
                                                });
                                            } else {
                                                // Desktop scroll with offset
                                                const scrollOffset = container.scrollTop + (elementRect.top - containerRect.top) - 180;
                                                container.scrollTo({
                                                    top: Math.max(0, scrollOffset),
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }
                                        
                                        setTimeout(() => setIsManualSelection(false), 800);
                                    }, 10);
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 lg:gap-2 p-2 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-300 aspect-square",
                                    activeCategory === category.category
                                        ? "bg-blue-100 text-blue-800 border border-blue-200 shadow-md"
                                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:shadow-sm"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-white shadow-sm">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/smart_switch/3 gang mechanical.webp';
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] lg:text-xs font-medium text-center leading-tight">
                                    {category.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* All Products by Category */}
                <div className="pb-8">
                    {allProductsByCategory.map((categoryGroup, index) => (
                        <div key={categoryGroup.category} id={`category-${categoryGroup.category.replace(/\s+/g, '-')}`} className="mb-8">
                            {/* Section Title - Always Show */}
                            <div className="mb-4 lg:mb-6 px-3 lg:px-4">
                                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-500 pb-2 inline-block">
                                    {categoryGroup.category}
                                </h2>
                                <p className="text-sm text-gray-600 mt-2">
                                    {categoryGroup.products.length} products available
                                </p>
                            </div>

                            {/* Product Grid or No Products Message */}
                            {categoryGroup.products.length > 0 ? (
                                <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3 px-3 lg:px-4 relative z-0">
                                    {categoryGroup.products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-2 relative cursor-pointer border border-gray-100 hover:border-green-200 group aspect-square flex flex-col"
                            whileHover={{ y: -2, scale: 1.01 }}
                            onClick={() => {
                                if (product.id === 'service-1') {
                                    setServicesModalOpen(true);
                                    return;
                                }
                                if (product.id === 'service-2') {
                                    setInstallationModalOpen(true);
                                    return;
                                }
                                const variant = categoryGroup.products.find(p => p.id === product.id);
                                setSelectedVariant(variant);
                                setSelectedProduct(categoryToIdMap[categoryGroup.category] || '3');
                                setModalOpen(true);
                            }}
                        >
                            {/* Badge */}
                            {product.isSoldOut && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-medium z-10">
                                    Sold Out
                                </div>
                            )}
                            
                            {/* Product Image */}
                            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden group-hover:from-green-50 group-hover:to-green-100 transition-all duration-300 p-1 mb-1">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/smart_switch/3 gang mechanical.webp';
                                    }}
                                />
                            </div>
                            
                            {/* Product Info */}
                            <div className="space-y-0.5 mt-auto">
                                <h3 className="font-medium text-gray-900 text-xs leading-tight truncate">
                                    {product.name}
                                </h3>
                                <p className="text-green-600 text-xs font-semibold">
                                    {typeof product.price === 'string' ? product.price : `৳${product.price}`}
                                </p>
                            </div>
                            
                            {/* Add Button */}
                            <motion.button
                                className="absolute bottom-1 right-1 w-5 h-5 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (product.id === 'service-1') {
                                        setServicesModalOpen(true);
                                        return;
                                    }
                                    if (product.id === 'service-2') {
                                        setInstallationModalOpen(true);
                                        return;
                                    }
                                    const cartItem: CartItem = {
                                        id: product.id,
                                        name: product.name,
                                        price: parseInt(product.price.toString().replace(/[^0-9]/g, '')) || 0,
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
                            >
                                +
                            </motion.button>
                                    </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <p>No products available in this category</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Cart Toggle Button */}
            {!showMobileCart && cart.length > 0 && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setShowMobileCart(true)}
                    className="lg:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                    </span>
                </motion.button>
            )}

            {/* Right Side - Fixed Cart */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                    "w-full lg:w-[480px] flex flex-col lg:sticky lg:top-6",
                    "fixed bottom-0 left-0 right-0 lg:relative",
                    showCheckout ? "top-0 lg:top-6" : "",
                    "p-3 lg:p-4 md:p-6 rounded-t-xl lg:rounded-xl",
                    showCheckout ? "rounded-none lg:rounded-xl" : "",
                    "bg-white dark:bg-zinc-900",
                    "border-t lg:border border-zinc-200 dark:border-zinc-800",
                    "shadow-2xl lg:shadow-lg z-50 lg:z-auto",
                    !showMobileCart && "hidden lg:flex"
                )}
                style={{ 
                    height: showCheckout ? (window.innerWidth < 1024 ? '100vh' : 'auto') : 'auto', 
                    minHeight: showCheckout ? (window.innerWidth < 1024 ? '100vh' : '60vh') : '200px', 
                    maxHeight: showCheckout ? (window.innerWidth < 1024 ? '100vh' : '80vh') : 'calc(100vh - 200px)'
                }}
            >
                    {showCheckout ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCheckout(false)}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Cart
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowCheckout(false);
                                        setShowMobileCart(false);
                                    }}
                                    className="lg:hidden p-1 h-8 w-8"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                                Checkout
                            </h2>
                            
                            <div className="flex-1 overflow-y-auto -mx-2 lg:-mx-4 px-2 lg:px-4" style={{ scrollBehavior: 'auto' }}>
                                <form onSubmit={handleOrderSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                            className="mt-1"
                                            autoFocus
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

                            <div className="sticky bottom-0 bg-white dark:bg-zinc-900 pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 -mx-2 lg:-mx-4 px-2 lg:px-4">
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
                                    className="w-full mb-2" 
                                    disabled={orderLoading || loading}
                                    onClick={handleOrderSubmit}
                                >
                                    {orderLoading ? 'Processing...' : 'Confirm Order'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-5 h-5 text-zinc-500" />
                                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                        Cart ({totalItems})
                                    </h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowMobileCart(false)}
                                    className="lg:hidden p-1 h-8 w-8"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <motion.div
                                className={cn(
                                    "flex-1 overflow-y-auto",
                                    "min-h-0 max-h-[120px] lg:max-h-none",
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
                                
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="flex-1 gap-2" 
                                            disabled={cart.length === 0}
                                            onClick={() => setSaveEmailModalOpen(true)}
                                        >
                                            <Mail className="w-4 h-4" />
                                            Save/Email
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="flex-1 gap-2" 
                                            disabled={cart.length === 0}
                                            onClick={() => {
                                                const sanitizeText = (text: string) => text.replace(/[<>&"']/g, (match) => {
                                                    const escapeMap: { [key: string]: string } = {
                                                        '<': '&lt;',
                                                        '>': '&gt;',
                                                        '&': '&amp;',
                                                        '"': '&quot;',
                                                        "'": '&#x27;'
                                                    };
                                                    return escapeMap[match];
                                                });
                                                
                                                try {
                                                    const printContent = `
                                                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                                                            <h1 style="text-align: center; color: #333;">Smart Home Quote</h1>
                                                            <hr style="margin: 20px 0;">
                                                            <h3>Items:</h3>
                                                            ${cart.map(item => `
                                                                <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
                                                                    <strong>${sanitizeText(item.name)}</strong><br>
                                                                    Quantity: ${item.quantity}<br>
                                                                    Price: ৳${item.price.toLocaleString()}<br>
                                                                    Subtotal: ৳${(item.price * item.quantity).toLocaleString()}
                                                                </div>
                                                            `).join('')}
                                                            <hr style="margin: 20px 0;">
                                                            <h3 style="text-align: right;">Total: ৳${totalPrice.toLocaleString()}</h3>
                                                            <p style="text-align: center; margin-top: 30px; color: #666;">
                                                                Generated on ${new Date().toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    `;
                                                    const printWindow = window.open('', '_blank');
                                                    if (printWindow) {
                                                        printWindow.document.write(printContent);
                                                        printWindow.document.close();
                                                        printWindow.print();
                                                    } else {
                                                        toast({
                                                            title: "Print Failed",
                                                            description: "Please allow popups to print the quote.",
                                                        });
                                                    }
                                                } catch (error) {
                                                    toast({
                                                        title: "Print Error",
                                                        description: "Failed to generate print preview.",
                                                    });
                                                }
                                            }}
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print
                                        </Button>
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
                                </div>
                            </motion.div>
                        </>
                    )}
            </motion.div>
            </div>
            
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
                    product={(() => {
                        const sanitizedId = selectedVariant.id.replace(/[^a-zA-Z0-9-]/g, '');
                        const productData = dbProducts.find(p => p.id === sanitizedId);
                        return {
                            id: selectedVariant.id,
                            name: selectedVariant.name,
                            category: selectedVariant.gangType || 'Product',
                            price: parseInt(selectedVariant.price.replace(/[^0-9]/g, '')),
                            description: productData?.description || '',
                            detailed_description: productData?.detailed_description || '',
                            features: productData?.features || '',
                            specifications: productData?.specifications || '',
                            engraving_available: productData?.engraving_available || false,
                            engraving_price: productData?.engraving_price || 0,
                            engraving_image: productData?.engraving_image || '',
                            engraving_text_color: productData?.engraving_text_color || '#000000',
                            warranty: productData?.warranty || '',
                            installation_included: productData?.installation_included || false,
                            image: selectedVariant.imageUrl,
                            image2: productData?.image2 || '',
                            image3: productData?.image3 || '',
                            image4: productData?.image4 || '',
                            image5: productData?.image5 || '',
                            stock: productData?.stock || 0
                        };
                    })()}
                    onAddToCart={async (payload) => {
                        if (selectedVariant) {
                            const sanitizedVariant = { ...selectedVariant, id: selectedVariant.id.replace(/[^a-zA-Z0-9-]/g, '') };
                            const { totalPrice } = calculateItemPrice(sanitizedVariant, payload, dbProducts);
                            const cartItem = createCartItem(sanitizedVariant, payload, totalPrice);
                            addToCart(cartItem);
                        }
                    }}
                    onBuyNow={async (payload) => {
                        if (selectedVariant) {
                            const sanitizedVariant = { ...selectedVariant, id: selectedVariant.id.replace(/[^a-zA-Z0-9-]/g, '') };
                            const { totalPrice } = calculateItemPrice(sanitizedVariant, payload, dbProducts);
                            const cartItem = createCartItem(sanitizedVariant, payload, totalPrice);
                            
                            setCart([cartItem]);
                            setModalOpen(false);
                            setShowCheckout(true);
                            
                            toast({
                                title: "Proceeding to Checkout",
                                description: `${cartItem.name} added for immediate purchase.`,
                            });
                        }
                    }}
                    onToggleFavorite={() => {
                        toast({
                            title: "Added to Favorites",
                            description: "Product added to your favorites list.",
                        });
                    }}
                />
            )}
            
            {/* Services Selection Modal */}
            <ServicesModal
                open={servicesModalOpen}
                onOpenChange={setServicesModalOpen}
                onBack={() => {
                    setServicesModalOpen(false);
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
                }}
                onAddToCart={(cartItem) => {
                    addToCart(cartItem);
                    toast({
                        title: "Added to Cart",
                        description: `${cartItem.name} has been added to your cart.`,
                    });
                }}
            />
            
            {/* Save Email Modal */}
            <SaveEmailModal
                open={saveEmailModalOpen}
                onOpenChange={setSaveEmailModalOpen}
                cartItems={cart}
                totalPrice={totalPrice}
            />
        </>
    );
}

export { InteractiveCheckout, type Product };