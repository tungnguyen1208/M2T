import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBadgeDollarSign,
  LucideBarChart3,
  LucideBox,
  LucideCalendar,
  LucideChevronDown,
  LucideCircleDollarSign,
  LucideCirclePlus,
  LucidePackageOpen,
  LucideShoppingCart,
  LucideTrendingUp,
  LucideUsers,
  LucideWarehouse,
} from '@lucide/angular';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DashboardSummaryDto, InventoryStatusDto, OrderDto, RevenuePointDto, TopProductDto } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { formatVnd, statusClass, statusLabel } from '../../shared/ui';

interface MetricCard {
  label: string;
  value: string;
  trend: string;
  icon: 'money' | 'cart' | 'box' | 'users' | 'profit';
  iconClass: string;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    RevealDirective,
    RouterLink,
    LucideBadgeDollarSign,
    LucideBarChart3,
    LucideBox,
    LucideCalendar,
    LucideChevronDown,
    LucideCircleDollarSign,
    LucideCirclePlus,
    LucidePackageOpen,
    LucideShoppingCart,
    LucideTrendingUp,
    LucideUsers,
    LucideWarehouse,
  ],
  template: `
    <section appReveal class="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
      <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-[#e2e9f4] bg-white px-4 font-bold shadow-sm">
        <svg lucideCalendar class="h-4 w-4 text-[#06275d]" aria-hidden="true" />
        Hôm nay
      </button>
      <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-[#e2e9f4] bg-white px-4 font-bold shadow-sm">
        <svg lucideCalendar class="h-4 w-4 text-[#06275d]" aria-hidden="true" />
        23/05/2024 - 23/05/2024
        <svg lucideChevronDown class="h-4 w-4 text-slate-500" aria-hidden="true" />
      </button>
    </section>

    <section appReveal class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      @for (metric of metrics(); track metric.label) {
        <article class="flex min-h-[112px] items-center gap-3 rounded-lg border border-[#e2e9f4] bg-white p-4 shadow-sm">
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-lg" [class]="metric.iconClass">
            @switch (metric.icon) {
              @case ('money') { <svg lucideBadgeDollarSign class="h-8 w-8" aria-hidden="true" /> }
              @case ('cart') { <svg lucideShoppingCart class="h-8 w-8" aria-hidden="true" /> }
              @case ('box') { <svg lucidePackageOpen class="h-8 w-8" aria-hidden="true" /> }
              @case ('users') { <svg lucideUsers class="h-8 w-8" aria-hidden="true" /> }
              @case ('profit') { <svg lucideCircleDollarSign class="h-8 w-8" aria-hidden="true" /> }
            }
          </span>
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-600">{{ metric.label }}</p>
            <p class="mt-1 whitespace-nowrap text-[25px] font-extrabold leading-tight">{{ metric.value }}</p>
            <span class="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600">
              <svg lucideTrendingUp class="h-3.5 w-3.5" aria-hidden="true" />
              {{ metric.trend }} so với hôm qua
            </span>
          </div>
        </article>
      }
    </section>

    <section appReveal class="grid gap-3 xl:grid-cols-[1.45fr_.9fr]">
      <article class="overflow-hidden rounded-lg border border-[#e2e9f4] bg-white shadow-sm">
        <div class="flex min-h-14 flex-col gap-3 border-b border-[#e2e9f4] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-extrabold">Doanh thu</h2>
          <div class="grid grid-cols-3 overflow-hidden rounded-lg border border-[#e2e9f4] text-sm font-bold">
            <button class="bg-[#126bff] px-4 py-2 text-white">Theo giờ</button>
            <button class="bg-white px-4 py-2 text-slate-600">Theo ngày</button>
            <button class="bg-white px-4 py-2 text-slate-600">Theo tháng</button>
          </div>
        </div>
        <div class="relative h-[280px] bg-gradient-to-b from-white to-blue-50/50 px-5 py-4">
          <svg class="h-full w-full overflow-visible" viewBox="0 0 720 235" aria-label="Biểu đồ doanh thu">
            <defs>
              <linearGradient id="chartFillAngular" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#126bff" stop-opacity=".22" />
                <stop offset="100%" stop-color="#126bff" stop-opacity="0" />
              </linearGradient>
            </defs>
            @for (line of [38, 86, 134, 182]; track line) {
              <line x1="0" [attr.y1]="line" x2="720" [attr.y2]="line" stroke="#dce6f5" stroke-width="1" />
            }
            <path d="M0 212 L62 190 L126 166 L188 151 L252 122 L315 100 L375 86 L438 75 L500 54 L560 32 L622 26 L684 24 L720 23 L720 235 L0 235 Z" fill="url(#chartFillAngular)" />
            <path d="M0 212 L62 190 L126 166 L188 151 L252 122 L315 100 L375 86 L438 75 L500 54 L560 32 L622 26 L684 24 L720 23" fill="none" stroke="#126bff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            @for (point of chartPoints; track point.x) {
              <circle [attr.cx]="point.x" [attr.cy]="point.y" r="4" fill="white" stroke="#126bff" stroke-width="2" />
            }
          </svg>
          <div class="absolute left-[46%] top-[36%] rounded-lg border border-[#e2e9f4] bg-white px-3 py-2 text-xs font-bold shadow-lg">
            12:00 <span class="block pt-1 text-slate-500">Doanh thu: 7.450.000 đ</span>
          </div>
        </div>
      </article>

      <article class="overflow-hidden rounded-lg border border-[#e2e9f4] bg-white shadow-sm">
        <div class="flex min-h-14 items-center justify-between border-b border-[#e2e9f4] px-5">
          <h2 class="text-xl font-extrabold">Sản phẩm bán chạy</h2>
          <a routerLink="/products" class="text-sm font-extrabold text-[#126bff]">Xem tất cả</a>
        </div>
        <div class="grid px-5 py-2">
          @for (item of topProducts(); track item.productId) {
            <div class="grid grid-cols-[28px_48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#e2e9f4] py-2 last:border-0">
              <span class="grid h-6 w-6 place-items-center rounded-md bg-blue-50 text-xs font-extrabold text-[#126bff]">{{ item.rank }}</span>
              <img class="h-10 w-12 rounded-md border border-[#e2e9f4] object-cover" [src]="item.imageUrl" [alt]="item.name" loading="lazy" />
              <div class="min-w-0">
                <p class="truncate font-extrabold">{{ item.name }}</p>
                <p class="text-xs font-semibold text-slate-500">Đã bán: {{ item.soldQuantity }}</p>
              </div>
              <span class="font-extrabold text-[#126bff]">{{ vnd(item.revenue) }}</span>
            </div>
          }
        </div>
      </article>
    </section>

    <section appReveal class="grid gap-3 xl:grid-cols-[1.35fr_.85fr]">
      <article class="overflow-hidden rounded-lg border border-[#e2e9f4] bg-white shadow-sm">
        <div class="flex min-h-14 items-center justify-between border-b border-[#e2e9f4] px-5">
          <h2 class="text-xl font-extrabold">Đơn hàng mới nhất</h2>
          <a routerLink="/orders" class="text-sm font-extrabold text-[#126bff]">Xem tất cả</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[660px] text-left">
            <thead class="bg-slate-50 text-sm text-slate-500">
              <tr><th class="p-3">Mã đơn hàng</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thời gian</th></tr>
            </thead>
            <tbody>
              @for (order of recentOrders(); track order.id) {
                <tr class="border-t border-[#e2e9f4]">
                  <td class="p-3 font-extrabold text-[#126bff]">{{ order.code }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ vnd(order.totalAmount) }}</td>
                  <td><span class="rounded-md px-2 py-1 text-xs font-extrabold" [class]="statusClass(order.status)">{{ statusLabel(order.status) }}</span></td>
                  <td>{{ order.orderedAt.slice(0, 16).replace('T', ' ') }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>

      <article class="rounded-lg border border-[#e2e9f4] bg-white shadow-sm">
        <div class="flex min-h-14 items-center justify-between border-b border-[#e2e9f4] px-5">
          <h2 class="text-xl font-extrabold">Tình trạng kho</h2>
          <a routerLink="/inventory" class="text-sm font-extrabold text-[#126bff]">Xem tất cả</a>
        </div>
        <div class="grid gap-1 p-5">
          @for (item of inventory(); track item.categoryName) {
            <div class="grid grid-cols-[40px_minmax(0,1fr)_44px] items-center gap-3 border-b border-[#e2e9f4] py-2 last:border-0">
              <span class="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-500">
                <svg lucideBox class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p class="font-extrabold">{{ item.categoryName }}</p>
                <p class="text-xs font-semibold text-slate-500">{{ item.stockQuantity }} sản phẩm</p>
                <div class="mt-1 h-1.5 rounded-full bg-blue-100"><div class="h-full rounded-full bg-[#126bff]" [style.width.%]="item.percentage"></div></div>
              </div>
              <strong>{{ item.percentage }}%</strong>
            </div>
          }
        </div>
      </article>
    </section>

    <section appReveal class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      @for (action of quickActions; track action.title) {
        <a [routerLink]="action.path" class="flex min-h-[68px] items-center gap-4 rounded-lg p-4 text-white shadow-sm transition hover:-translate-y-0.5" [class]="action.bg">
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white/20">
            @switch (action.icon) {
              @case ('cart') { <svg lucideShoppingCart class="h-7 w-7" aria-hidden="true" /> }
              @case ('plus') { <svg lucideCirclePlus class="h-7 w-7" aria-hidden="true" /> }
              @case ('warehouse') { <svg lucideWarehouse class="h-7 w-7" aria-hidden="true" /> }
              @case ('chart') { <svg lucideBarChart3 class="h-7 w-7" aria-hidden="true" /> }
              @case ('cash') { <svg lucideCircleDollarSign class="h-7 w-7" aria-hidden="true" /> }
            }
          </span>
          <span><strong class="block">{{ action.title }}</strong><span class="text-sm font-semibold text-white/85">{{ action.sub }}</span></span>
        </a>
      }
    </section>
  `,
})
export class DashboardPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly summary = signal<DashboardSummaryDto | null>(null);
  readonly topProducts = signal<TopProductDto[]>([]);
  readonly recentOrders = signal<OrderDto[]>([]);
  readonly inventory = signal<InventoryStatusDto[]>([]);
  readonly revenue = signal<RevenuePointDto[]>([]);
  readonly vnd = formatVnd;
  readonly statusLabel = statusLabel;
  readonly statusClass = statusClass;
  readonly chartPoints = [
    { x: 0, y: 212 },
    { x: 62, y: 190 },
    { x: 126, y: 166 },
    { x: 188, y: 151 },
    { x: 252, y: 122 },
    { x: 315, y: 100 },
    { x: 375, y: 86 },
    { x: 438, y: 75 },
    { x: 500, y: 54 },
    { x: 560, y: 32 },
    { x: 622, y: 26 },
    { x: 684, y: 24 },
    { x: 720, y: 23 },
  ];

  readonly quickActions = [
    { title: 'Bán hàng', sub: 'Tạo đơn hàng mới', path: '/sales', icon: 'cart', bg: 'bg-[#126bff]' },
    { title: 'Thêm sản phẩm', sub: 'Thêm sản phẩm mới', path: '/products', icon: 'plus', bg: 'bg-emerald-500' },
    { title: 'Nhập hàng', sub: 'Nhập hàng vào kho', path: '/inventory', icon: 'warehouse', bg: 'bg-violet-500' },
    { title: 'Báo cáo', sub: 'Xem báo cáo chi tiết', path: '/reports', icon: 'chart', bg: 'bg-orange-400' },
    { title: 'Thu chi', sub: 'Quản lý thu chi', path: '/cashflow', icon: 'cash', bg: 'bg-cyan-500' },
  ];

  readonly metrics = signal<MetricCard[]>([
    { label: 'Doanh thu hôm nay', value: '0 đ', trend: '18.5%', icon: 'money', iconClass: 'bg-blue-50 text-[#126bff]' },
    { label: 'Đơn hàng hôm nay', value: '0', trend: '12.2%', icon: 'cart', iconClass: 'bg-emerald-50 text-emerald-600' },
    { label: 'Sản phẩm bán chạy', value: '0', trend: '8.7%', icon: 'box', iconClass: 'bg-orange-50 text-orange-500' },
    { label: 'Khách hàng mới', value: '0', trend: '21.1%', icon: 'users', iconClass: 'bg-violet-50 text-violet-500' },
    { label: 'Lợi nhuận hôm nay', value: '0 đ', trend: '16.3%', icon: 'profit', iconClass: 'bg-rose-50 text-rose-500' },
  ]);

  ngOnInit(): void {
    forkJoin({
      summary: this.api.dashboardSummary(),
      revenue: this.api.revenue(),
      topProducts: this.api.topProducts(),
      recentOrders: this.api.recentOrders(),
      inventory: this.api.inventoryStatus(),
    }).subscribe((data) => {
      this.summary.set(data.summary);
      this.revenue.set(data.revenue);
      this.topProducts.set(data.topProducts);
      this.recentOrders.set(data.recentOrders);
      this.inventory.set(data.inventory);
      this.metrics.set([
        { label: 'Doanh thu hôm nay', value: this.vnd(data.summary.revenueToday), trend: '18.5%', icon: 'money', iconClass: 'bg-blue-50 text-[#126bff]' },
        { label: 'Đơn hàng hôm nay', value: String(data.summary.ordersToday), trend: '12.2%', icon: 'cart', iconClass: 'bg-emerald-50 text-emerald-600' },
        { label: 'Sản phẩm bán chạy', value: String(data.summary.topProductsSold), trend: '8.7%', icon: 'box', iconClass: 'bg-orange-50 text-orange-500' },
        { label: 'Khách hàng mới', value: String(data.summary.newCustomers), trend: '21.1%', icon: 'users', iconClass: 'bg-violet-50 text-violet-500' },
        { label: 'Lợi nhuận hôm nay', value: this.vnd(data.summary.profitToday), trend: '16.3%', icon: 'profit', iconClass: 'bg-rose-50 text-rose-500' },
      ]);
    });
  }
}
