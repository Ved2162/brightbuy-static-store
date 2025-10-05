import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { getCurrentUser, saveUser, getCart } from "@/lib/storage";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone || "");
    setAddress(currentUser.address || "");

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      name,
      email,
      phone,
      address
    };

    saveUser(updatedUser);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => {}}
        cartItemCount={cartItemCount}
      />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/orders")}
                  >
                    View Orders
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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

export default Profile;
