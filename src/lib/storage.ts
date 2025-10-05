// Local Storage Management

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'admin' | 'info';
  read: boolean;
  createdAt: string;
}

// Auth
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const getAllUsers = (): User[] => {
  const usersStr = localStorage.getItem('users');
  return usersStr ? JSON.parse(usersStr) : [];
};

export const saveUser = (user: User) => {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('users', JSON.stringify(users));
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  // In a real app, we'd check hashed passwords
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const registerUser = (email: string, password: string, name: string): User => {
  const user: User = {
    id: Date.now().toString(),
    email,
    name,
    isAdmin: false
  };
  saveUser(user);
  setCurrentUser(user);
  return user;
};

export const logoutUser = () => {
  setCurrentUser(null);
};

// Cart
export const getCart = (userId: string): CartItem[] => {
  const cartStr = localStorage.getItem(`cart_${userId}`);
  return cartStr ? JSON.parse(cartStr) : [];
};

export const saveCart = (userId: string, cart: CartItem[]) => {
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
};

export const addToCart = (userId: string, productId: string, quantity: number = 1) => {
  const cart = getCart(userId);
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(userId, cart);
};

export const removeFromCart = (userId: string, productId: string) => {
  const cart = getCart(userId);
  const updatedCart = cart.filter(item => item.productId !== productId);
  saveCart(userId, updatedCart);
};

export const updateCartQuantity = (userId: string, productId: string, quantity: number) => {
  const cart = getCart(userId);
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(userId, cart);
  }
};

export const clearCart = (userId: string) => {
  saveCart(userId, []);
};

// Orders
export const getAllOrders = (): Order[] => {
  const ordersStr = localStorage.getItem('orders');
  return ordersStr ? JSON.parse(ordersStr) : [];
};

export const getUserOrders = (userId: string): Order[] => {
  return getAllOrders().filter(order => order.userId === userId);
};

export const createOrder = (order: Order) => {
  const orders = getAllOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

// Notifications
export const getUserNotifications = (userId: string): Notification[] => {
  const notificationsStr = localStorage.getItem('notifications');
  const allNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
  return allNotifications.filter(n => n.userId === userId);
};

export const createNotification = (notification: Notification) => {
  const notificationsStr = localStorage.getItem('notifications');
  const notifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
  notifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

export const markNotificationAsRead = (notificationId: string) => {
  const notificationsStr = localStorage.getItem('notifications');
  const notifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
};

// Initialize demo data
export const initializeDemoData = () => {
  const users = getAllUsers();
  if (users.length === 0) {
    // Create admin user
    const admin: User = {
      id: 'admin-1',
      email: 'admin@brightbuy.com',
      name: 'Admin User',
      isAdmin: true
    };
    saveUser(admin);

    // Create demo customer
    const customer: User = {
      id: 'user-1',
      email: 'demo@example.com',
      name: 'Demo Customer',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567'
    };
    saveUser(customer);
  }
};
