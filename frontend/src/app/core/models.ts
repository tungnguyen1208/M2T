export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthUserDto {
  id: number;
  fullName: string;
  userName: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AuthUserDto;
}

export interface CategoryDto {
  id: number;
  name: string;
  icon: string;
}

export interface ProductDto {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  imageUrl: string;
  status: string;
  categoryId: number;
  categoryName: string;
}

export interface UpsertProductRequest {
  name: string;
  sku: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  status: number;
}

export interface CustomerDto {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  orderCount: number;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderDto {
  id: number;
  code: string;
  customerId: number;
  customerName: string;
  totalAmount: number;
  status: string;
  orderedAt: string;
  items: OrderItemDto[];
}

export interface DashboardSummaryDto {
  revenueToday: number;
  ordersToday: number;
  topProductsSold: number;
  newCustomers: number;
  profitToday: number;
}

export interface RevenuePointDto {
  label: string;
  revenue: number;
}

export interface TopProductDto {
  rank: number;
  productId: number;
  name: string;
  imageUrl: string;
  soldQuantity: number;
  revenue: number;
}

export interface InventoryStatusDto {
  categoryName: string;
  productCount: number;
  stockQuantity: number;
  percentage: number;
}

export interface InventoryTransactionDto {
  id: number;
  productId: number;
  productName: string;
  type: string;
  quantity: number;
  note: string;
  createdAt: string;
}
