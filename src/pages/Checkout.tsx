import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { getCurrentUser, getCart, createOrder, clearCart, createNotification } from "@/lib/storage";
import { products } from "@/data/products";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Shipping Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  
  // Payment Info
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    // Pre-fill user data
    setName(currentUser.name);
    setEmail(currentUser.email);
    if (currentUser.address) setAddress(currentUser.address);
    if (currentUser.phone) setPhone(currentUser.phone);

    updateCartCount();
    
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [currentUser, navigate]);

  const updateCartCount = () => {
    if (currentUser) {
      const cart = getCart(currentUser.id);
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(count);
    }
  };

  if (!currentUser) return null;

  const cart = getCart(currentUser.id);
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item!.price * item!.quantity), 0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !address || !city || !zipCode || !phone) {
      toast.error("Please fill in all shipping information");
      return;
    }

    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("Please fill in all payment information");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Create order
    const order = {
      id: Date.now().toString(),
      userId: currentUser.id,
      items: cartItems.map(item => ({
        productId: item!.id,
        name: item!.name,
        price: item!.price,
        quantity: item!.quantity
      })),
      total,
      status: 'pending' as const,
      shippingAddress: `${address}, ${city}, ${zipCode}`,
      createdAt: new Date().toISOString()
    };

    createOrder(order);
    
    // Create notification
    createNotification({
      id: Date.now().toString(),
      userId: currentUser.id,
      title: "Order Placed Successfully!",
      message: `Your order #${order.id} has been placed and is being processed.`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString()
    });

    clearCart(currentUser.id);
    toast.success("Order placed successfully!");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => {}}
        cartItemCount={cartItemCount}
      />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    💳 This is a demo checkout. Use any card number for testing.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item!.id} className="flex gap-3">
                      <img
                        src={item!.image}
                        alt={item!.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item!.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item!.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item!.price * item!.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full gradient-primary text-white shadow-glow hover:opacity-90 transition-opacity"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
};

export default Checkout;
