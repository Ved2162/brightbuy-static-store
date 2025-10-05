import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { getCart, removeFromCart, updateCartQuantity, getCurrentUser } from "@/lib/storage";
import { products } from "@/data/products";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSidebar = ({ open, onOpenChange }: CartSidebarProps) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const cart = currentUser ? getCart(currentUser.id) : [];
  
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item!.price * item!.quantity), 0
  );

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (!currentUser) return;
    if (newQuantity < 1) return;
    updateCartQuantity(currentUser.id, productId, newQuantity);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (productId: string) => {
    if (!currentUser) return;
    removeFromCart(currentUser.id, productId);
    toast.success("Item removed from cart");
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add some products to get started!
              </p>
              <Button onClick={() => onOpenChange(false)} className="gradient-primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto -mx-6 px-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item!.id} className="flex gap-4 bg-card p-4 rounded-lg border">
                      <img
                        src={item!.image}
                        alt={item!.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item!.name}</h4>
                        <p className="text-primary font-bold mt-1">
                          ${item!.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item!.id, item!.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item!.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item!.id, item!.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-destructive"
                            onClick={() => handleRemove(item!.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span className="text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full gradient-primary text-white shadow-glow" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
