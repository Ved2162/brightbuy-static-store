import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { CartSidebar } from "@/components/CartSidebar";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { getCurrentUser, getCart, addToCart, initializeDemoData } from "@/lib/storage";
import { toast } from "sonner";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  useEffect(() => {
    initializeDemoData();
    updateCartCount();
    
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const user = getCurrentUser();
    if (user) {
      const cart = getCart(user.id);
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(count);
    } else {
      setCartItemCount(0);
    }
  };

  const handleAddToCart = (productId: string) => {
    const user = getCurrentUser();
    
    if (!user) {
      setPendingProductId(productId);
      setAuthModalOpen(true);
      return;
    }

    addToCart(user.id, productId);
    const product = products.find(p => p.id === productId);
    toast.success(`${product?.name} added to cart!`);
    updateCartCount();
  };

  const handleAuthSuccess = () => {
    if (pendingProductId) {
      const user = getCurrentUser();
      if (user) {
        addToCart(user.id, pendingProductId);
        const product = products.find(p => p.id === pendingProductId);
        toast.success(`${product?.name} added to cart!`);
        updateCartCount();
      }
      setPendingProductId(null);
    }
    updateCartCount();
  };

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
        cartItemCount={cartItemCount}
      />

      {/* Hero Section */}
      <section className="relative gradient-hero text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to BrightBuy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Your trusted marketplace for quality products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="gradient-primary text-white shadow-glow hover:opacity-90 transition-opacity text-lg px-8"
              >
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="hero"
                className="text-lg px-8"
              >
                <Link to="/products">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">On orders over $50</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure transactions</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Best Quality</h3>
              <p className="text-muted-foreground">Top-rated products only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked items just for you</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Start Shopping Today</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing deals on quality products
          </p>
          <Button 
            asChild
            size="lg"
            className="gradient-primary text-white shadow-glow hover:opacity-90 transition-opacity text-lg px-8"
          >
            <Link to="/products">
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />

      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={handleAuthSuccess}
      />

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
};

export default Index;
