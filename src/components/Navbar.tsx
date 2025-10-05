import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, logoutUser, getCart, getUserNotifications } from "@/lib/storage";

interface NavbarProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  cartItemCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar = ({ 
  onCartClick, 
  onAuthClick, 
  cartItemCount = 0,
  searchQuery = "",
  onSearchChange 
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = getCurrentUser();
  const notifications = currentUser ? getUserNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-secondary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">BrightBuy</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white relative hover:bg-white/10">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-2 font-semibold">Notifications</div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-4">
                      <div className="font-medium">{notif.title}</div>
                      <div className="text-sm text-muted-foreground">{notif.message}</div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white relative hover:bg-white/10"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <User className="w-5 h-5 mr-2" />
                    {currentUser.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  {currentUser.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onAuthClick} className="gradient-primary text-white hover:opacity-90">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </Button>
            {currentUser ? (
              <>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" asChild>
                  <Link to="/profile">My Profile</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" asChild>
                  <Link to="/orders">My Orders</Link>
                </Button>
                {currentUser.isAdmin && (
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={onAuthClick} className="w-full gradient-primary text-white">
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
