import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { CartSidebar } from "@/components/CartSidebar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { getCurrentUser, getCart, addToCart } from "@/lib/storage";
import { toast } from "sonner";

const Products = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className={selectedCategory === "All" ? "gradient-primary text-white" : ""}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>

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

export default Products;
