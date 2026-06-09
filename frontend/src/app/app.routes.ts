import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { CustomersPage } from './features/customers/customers.page';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { InventoryPage } from './features/inventory/inventory.page';
import { LoginPage } from './features/login/login.page';
import { OrdersPage } from './features/orders/orders.page';
import { PlaceholderPage } from './features/placeholder/placeholder.page';
import { ProductsPage } from './features/products/products.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'sales', component: OrdersPage },
      { path: 'products', component: ProductsPage },
      { path: 'orders', component: OrdersPage },
      { path: 'inventory', component: InventoryPage },
      { path: 'customers', component: CustomersPage },
      { path: 'suppliers', component: PlaceholderPage, data: { title: 'Nhà cung cấp' } },
      { path: 'cashflow', component: PlaceholderPage, data: { title: 'Thu chi' } },
      { path: 'reports', component: PlaceholderPage, data: { title: 'Báo cáo' } },
      { path: 'promotions', component: PlaceholderPage, data: { title: 'Khuyến mãi' } },
      { path: 'staff', component: PlaceholderPage, data: { title: 'Nhân viên' } },
      { path: 'settings', component: PlaceholderPage, data: { title: 'Cài đặt' } },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
