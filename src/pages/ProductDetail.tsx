import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { CartSidebar } from "@/components/CartSidebar";
import { products } from "@/data/products";
import { getCurrentUser, getCart, addToCart } from "@/lib/storage";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

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

  const handleAddToCart = () => {
    const user = getCurrentUser();
    
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!product) return;

    addToCart(user.id, product.id, quantity);
    toast.success(`${product.name} added to cart!`);
    updateCartCount();
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          onCartClick={() => setCartOpen(true)}
          onAuthClick={() => setAuthModalOpen(true)}
          cartItemCount={cartItemCount}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
        cartItemCount={cartItemCount}
      />

      <div className="container mx-auto px-4 py-8 flex-1">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/products")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-destructive text-white text-lg px-3 py-1">
                Save {discount}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Secure checkout</span>
                </div>
                {product.inStock && (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="text-success font-medium">In Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full gradient-primary text-white shadow-glow hover:opacity-90 transition-opacity text-lg py-6"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={updateCartCount}
      />

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
};

export default ProductDetail;
