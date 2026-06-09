import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideBadgePercent,
  LucideBarChart3,
  LucideBell,
  LucideBox,
  LucideCircleDollarSign,
  LucideClipboardList,
  LucideHeadphones,
  LucideHelpCircle,
  LucideHome,
  LucideLogOut,
  LucideMenu,
  LucideSettings,
  LucideShoppingBag,
  LucideShoppingCart,
  LucideTruck,
  LucideUser,
  LucideUsers,
  LucideWarehouse,
} from '@lucide/angular';
import { filter } from 'rxjs';
import { AuthService } from './core/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideBadgePercent,
    LucideBarChart3,
    LucideBell,
    LucideBox,
    LucideCircleDollarSign,
    LucideClipboardList,
    LucideHeadphones,
    LucideHelpCircle,
    LucideHome,
    LucideLogOut,
    LucideMenu,
    LucideSettings,
    LucideShoppingBag,
    LucideShoppingCart,
    LucideTruck,
    LucideUser,
    LucideUsers,
    LucideWarehouse,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly navOpen = signal(false);
  readonly pageTitle = signal('Tổng quan');

  readonly navItems: NavItem[] = [
    { label: 'Tổng quan', path: '/dashboard', icon: 'dashboard' },
    { label: 'Bán hàng', path: '/sales', icon: 'cart' },
    { label: 'Đơn hàng', path: '/orders', icon: 'receipt' },
    { label: 'Sản phẩm', path: '/products', icon: 'box' },
    { label: 'Khách hàng', path: '/customers', icon: 'users' },
    { label: 'Nhà cung cấp', path: '/suppliers', icon: 'truck' },
    { label: 'Kho hàng', path: '/inventory', icon: 'warehouse' },
    { label: 'Thu chi', path: '/cashflow', icon: 'cash' },
    { label: 'Báo cáo', path: '/reports', icon: 'chart' },
    { label: 'Khuyến mãi', path: '/promotions', icon: 'percent' },
    { label: 'Nhân viên', path: '/staff', icon: 'staff' },
    { label: 'Cài đặt', path: '/settings', icon: 'settings' },
  ];

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.navOpen.set(false);
      const item = this.navItems.find((nav) => this.router.url.startsWith(nav.path));
      this.pageTitle.set(item?.label ?? 'Tổng quan');
    });
  }

  isLogin(): boolean {
    return this.router.url.startsWith('/login');
  }

  logout(): void {
    this.auth.logout();
  }
}
