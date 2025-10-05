import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { getCurrentUser, getAllOrders, getAllUsers, getCart } from "@/lib/storage";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";

const Admin = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/");
      return;
    }

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

  if (!currentUser || !currentUser.isAdmin) return null;

  const allOrders = getAllOrders();
  const allUsers = getAllUsers();
  
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = allOrders.length;
  const totalCustomers = allUsers.filter(u => !u.isAdmin).length;
  
  const recentOrders = allOrders.slice(-5).reverse();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => {}}
        cartItemCount={cartItemCount}
      />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {totalOrders} orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All time orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per order
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const user = allUsers.find(u => u.id === order.userId);
                      return (
                        <div 
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {user?.name || 'Unknown'} • {order.items.length} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {order.status}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
};

export default Admin;
