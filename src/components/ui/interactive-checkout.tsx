"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { BuyNowModal } from "@/components/ui/BuyNowModal";
import { productData } from "@/lib/productData";
import { ProductListModal } from "@/components/ui/ProductListModal";
import { toast } from "@/components/ui/use-toast";

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
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        color: "White",
    },
    {
        id: "2",
        name: "Smart Curtain",
        price: 25000,
        category: "Curtain",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        color: "Gray",
    },
    {
        id: "3",
        name: "Security",
        price: 8500,
        category: "Security",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
        color: "Black",
    },
    {
        id: "4",
        name: "PDLC Film",
        price: 15000,
        category: "Film",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
        color: "Clear",
    },
];

const switchProducts = [
    { id: "sw1", name: "Zemismart Tuya", price: "3,500৳", gangType: "2 Gang", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    { id: "sw2", name: "Zemismart Tuya", price: "3,850৳", gangType: "3 Gang", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    { id: "sw3", name: "Zemismart Zigbee", price: "3,500৳", gangType: "2 Gang", isSoldOut: true, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    { id: "sw4", name: "Zemismart 4 Gang", price: "3,500৳", gangType: "4 Gang", isSoldOut: true, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    { id: "sw5", name: "Sonoff 4-gang WiFi", price: "2,199৳", gangType: "4 Gang Mechanical", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
];

const curtainProducts = [
    { id: "ct1", name: "Smart Sliding Curtain", price: "36,000৳", gangType: "WiFi Motor", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
    { id: "ct2", name: "Smart Roller Curtain", price: "13,000৳", gangType: "Zigbee Motor", imageUrl: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400" },
];

const securityProducts = [
    { id: "sc1", name: "Sohub Protect SP 01", price: "8,500৳", gangType: "Indoor", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400" },
    { id: "sc2", name: "Sohub Protect SP 05", price: "12,500৳", gangType: "Outdoor", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400" },
];

function InteractiveCheckout({
    products = defaultProducts,
}: InteractiveCheckoutProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productListOpen, setProductListOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

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
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex gap-6">
                <div className="flex-1 space-y-3">
                    {products.map((product) => (
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
                                "transition-all duration-200"
                            )}
                            onClick={() => {
                                if (product.id === "1") {
                                    setSelectedCategory("Smart Switch");
                                    setProductListOpen(true);
                                } else if (product.id === "2") {
                                    setSelectedCategory("Smart Curtain");
                                    setProductListOpen(true);
                                } else if (product.id === "3") {
                                    setSelectedCategory("Security");
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
                                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {product.name}
                                        </h3>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                        <span>৳{product.price.toLocaleString()}</span>
                                        <span>•</span>
                                        <span>{product.color}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cart Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                        "w-80 flex flex-col",
                        "p-4 rounded-xl",
                        "bg-white dark:bg-zinc-900",
                        "border border-zinc-200 dark:border-zinc-800",
                        "sticky top-4",
                        "max-h-[32rem]"
                    )}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <ShoppingCart className="w-4 h-4 text-zinc-500" />
                        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
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
                        <Button size="sm" className="w-full gap-2" disabled={cart.length === 0}>
                            <CreditCard className="w-4 h-4" />
                            Checkout
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Product List Modal */}
            <ProductListModal
                open={productListOpen}
                onOpenChange={setProductListOpen}
                title={`${selectedCategory} Products`}
                products={
                    selectedCategory === "Smart Switch" ? switchProducts :
                    selectedCategory === "Smart Curtain" ? curtainProducts :
                    securityProducts
                }
                onProductClick={(productId) => {
                    const productList = 
                        selectedCategory === "Smart Switch" ? switchProducts :
                        selectedCategory === "Smart Curtain" ? curtainProducts :
                        securityProducts;
                    
                    const variant = productList.find(p => p.id === productId);
                    setSelectedVariant(variant);
                    setProductListOpen(false);
                    setSelectedProduct(
                        selectedCategory === "Smart Switch" ? "1" :
                        selectedCategory === "Smart Curtain" ? "2" : "3"
                    );
                    setModalOpen(true);
                }}
                onAddToCart={(product) => {
                    const cartItem: CartItem = {
                        id: product.id,
                        name: product.name,
                        price: parseInt(product.price.replace(/[^0-9]/g, '')),
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
            {selectedProduct && productData[selectedProduct as keyof typeof productData] && (
                <BuyNowModal
                    open={modalOpen}
                    onOpenChange={(open) => {
                        setModalOpen(open);
                        if (!open) {
                            setSelectedVariant(null);
                        }
                    }}
                    product={productData[selectedProduct as keyof typeof productData]}
                    onAddToCart={async (payload) => {
                        if (selectedVariant) {
                            // Add multiple items based on quantity
                            for (let i = 0; i < (payload.quantity || 1); i++) {
                                const cartItem: CartItem = {
                                    id: selectedVariant.id,
                                    name: selectedVariant.name,
                                    price: parseInt(selectedVariant.price.replace(/[^0-9]/g, '')),
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
        </div>
    );
}

export { InteractiveCheckout, type Product };