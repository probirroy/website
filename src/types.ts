export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number; // base price in INR
  sizes: number[]; // e.g., [7, 8, 9, 10, 11]
  category: "Running" | "Sneakers" | "Casual" | "Formal";
  image: string;
  stock: number;
}

export interface CartItem {
  id: string; // unique item id: product.id + '-' + size
  product: Product;
  selectedSize: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: "India" | "Bangladesh";
  paymentMethod: "UPI" | "Razorpay" | "bKash" | "Nagad" | "SSLCommerz";
  totalAmount: number;
  currency: "INR" | "BDT";
  status: "pending" | "processing" | "completed";
  items: OrderItem[];
  createdAt: string;
}

export interface DashboardStats {
  totalRevenueINR: number;
  totalRevenueBDT: number;
  totalOrders: number;
  totalProducts: number;
  orders: Order[];
}
