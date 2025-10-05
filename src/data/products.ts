export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
}

export const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports",
  "Beauty",
  "Toys",
  "Automotive"
];

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality.",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.8,
    reviews: 2547,
    inStock: true,
    featured: true
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with this advanced smartwatch featuring heart rate monitoring, GPS, and sleep tracking.",
    price: 249.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.6,
    reviews: 1823,
    inStock: true,
    featured: true
  },
  {
    id: "3",
    name: "4K Ultra HD Smart TV 55\"",
    description: "Immersive viewing experience with stunning 4K resolution, HDR support, and built-in streaming apps.",
    price: 799.99,
    originalPrice: 999.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.7,
    reviews: 3421,
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "Premium Leather Jacket",
    description: "Genuine leather jacket with modern styling, perfect for any season. Available in multiple colors.",
    price: 199.99,
    image: "/placeholder.svg",
    category: "Fashion",
    rating: 4.5,
    reviews: 892,
    inStock: true
  },
  {
    id: "5",
    name: "Stainless Steel Coffee Maker",
    description: "Programmable coffee maker with thermal carafe, brew strength control, and auto shut-off feature.",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg",
    category: "Home & Kitchen",
    rating: 4.4,
    reviews: 1567,
    inStock: true
  },
  {
    id: "6",
    name: "Bestselling Novel Collection",
    description: "Set of 5 award-winning contemporary novels from bestselling authors. Perfect gift for book lovers.",
    price: 59.99,
    image: "/placeholder.svg",
    category: "Books",
    rating: 4.9,
    reviews: 4523,
    inStock: true
  },
  {
    id: "7",
    name: "Yoga Mat with Carrying Strap",
    description: "Extra thick, non-slip yoga mat made from eco-friendly materials. Ideal for all types of yoga and exercise.",
    price: 34.99,
    image: "/placeholder.svg",
    category: "Sports",
    rating: 4.6,
    reviews: 2134,
    inStock: true
  },
  {
    id: "8",
    name: "Organic Skincare Gift Set",
    description: "Luxurious 6-piece skincare set with natural ingredients. Includes cleanser, toner, serum, and moisturizer.",
    price: 79.99,
    image: "/placeholder.svg",
    category: "Beauty",
    rating: 4.7,
    reviews: 1892,
    inStock: true
  },
  {
    id: "9",
    name: "Building Blocks Set - 1000 Pieces",
    description: "Creative building set with 1000 colorful pieces. Encourages imagination and develops motor skills.",
    price: 49.99,
    image: "/placeholder.svg",
    category: "Toys",
    rating: 4.8,
    reviews: 3245,
    inStock: true
  },
  {
    id: "10",
    name: "Car Phone Mount",
    description: "Universal dashboard and windshield mount with 360-degree rotation and one-touch release.",
    price: 19.99,
    image: "/placeholder.svg",
    category: "Automotive",
    rating: 4.3,
    reviews: 987,
    inStock: true
  },
  {
    id: "11",
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.",
    price: 69.99,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.7,
    reviews: 1456,
    inStock: true
  },
  {
    id: "12",
    name: "Designer Sunglasses",
    description: "Polarized UV protection sunglasses with premium frame and scratch-resistant lenses.",
    price: 159.99,
    originalPrice: 249.99,
    image: "/placeholder.svg",
    category: "Fashion",
    rating: 4.5,
    reviews: 734,
    inStock: true
  }
];
