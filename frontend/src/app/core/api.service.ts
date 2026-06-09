import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CategoryDto,
  CustomerDto,
  DashboardSummaryDto,
  InventoryStatusDto,
  InventoryTransactionDto,
  OrderDto,
  PagedResult,
  ProductDto,
  RevenuePointDto,
  TopProductDto,
  UpsertProductRequest,
} from './models';

const API_BASE = 'http://127.0.0.1:5259/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  dashboardSummary() {
    return this.http.get<DashboardSummaryDto>(`${API_BASE}/dashboard/summary`);
  }

  revenue() {
    return this.http.get<RevenuePointDto[]>(`${API_BASE}/dashboard/revenue`);
  }

  topProducts() {
    return this.http.get<TopProductDto[]>(`${API_BASE}/products/top-selling`, { params: { take: 5 } });
  }

  recentOrders() {
    return this.http.get<OrderDto[]>(`${API_BASE}/orders/recent`, { params: { take: 5 } });
  }

  inventoryStatus() {
    return this.http.get<InventoryStatusDto[]>(`${API_BASE}/inventory/status`);
  }

  categories() {
    return this.http.get<CategoryDto[]>(`${API_BASE}/categories`);
  }

  products(filters: { search?: string; categoryId?: number; sort?: string } = {}) {
    let params = new HttpParams().set('pageSize', 50);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.sort) params = params.set('sort', filters.sort);
    return this.http.get<PagedResult<ProductDto>>(`${API_BASE}/products`, { params });
  }

  createProduct(request: UpsertProductRequest) {
    return this.http.post<ProductDto>(`${API_BASE}/products`, request);
  }

  updateProduct(id: number, request: UpsertProductRequest) {
    return this.http.put<ProductDto>(`${API_BASE}/products/${id}`, request);
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(`${API_BASE}/products/${id}`);
  }

  orders() {
    return this.http.get<PagedResult<OrderDto>>(`${API_BASE}/orders`, { params: { pageSize: 50 } });
  }

  createOrder(customerId: number, productId: number, quantity: number) {
    return this.http.post<OrderDto>(`${API_BASE}/orders`, {
      customerId,
      status: 1,
      items: [{ productId, quantity }],
    });
  }

  updateOrderStatus(id: number, status: number) {
    return this.http.patch<OrderDto>(`${API_BASE}/orders/${id}/status`, { status });
  }

  transactions() {
    return this.http.get<PagedResult<InventoryTransactionDto>>(`${API_BASE}/inventory/transactions`, {
      params: { pageSize: 50 },
    });
  }

  stockIn(productId: number, quantity: number, note: string) {
    return this.http.post<InventoryTransactionDto>(`${API_BASE}/inventory/stock-in`, {
      productId,
      quantity,
      note,
    });
  }

  customers(search = '') {
    let params = new HttpParams().set('pageSize', 50);
    if (search) params = params.set('search', search);
    return this.http.get<PagedResult<CustomerDto>>(`${API_BASE}/customers`, { params });
  }

  createCustomer(request: Omit<CustomerDto, 'id' | 'createdAt' | 'orderCount'>) {
    return this.http.post<CustomerDto>(`${API_BASE}/customers`, request);
  }

  updateCustomer(id: number, request: Omit<CustomerDto, 'id' | 'createdAt' | 'orderCount'>) {
    return this.http.put<CustomerDto>(`${API_BASE}/customers/${id}`, request);
  }
}
