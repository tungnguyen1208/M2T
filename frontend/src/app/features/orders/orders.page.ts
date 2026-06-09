import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCheckCircle2, LucideReceiptText, LucideShoppingCart } from '@lucide/angular';
import { ApiService } from '../../core/api.service';
import { ApiError, CustomerDto, OrderDto, ProductDto } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { formatVnd, statusClass, statusLabel } from '../../shared/ui';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective, LucideCheckCircle2, LucideReceiptText, LucideShoppingCart],
  template: `
    <section appReveal class="grid gap-4 rounded-lg border border-[#e2e9f4] bg-white p-5 shadow-sm">
      <div>
        <span class="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-[#126bff]">
          <svg lucideShoppingCart class="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 class="mt-3 text-2xl font-extrabold">Đơn hàng</h2>
        <p class="font-semibold text-slate-500">Tạo đơn bán hàng và cập nhật trạng thái thanh toán.</p>
      </div>

      @if (error()) {
        <p class="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600" role="alert">{{ error() }}</p>
      }

      <form class="grid gap-3 rounded-lg bg-slate-50 p-4 md:grid-cols-4" [formGroup]="form" (ngSubmit)="create()">
        <select class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" formControlName="customerId">
          @for (customer of customers(); track customer.id) {
            <option [ngValue]="customer.id">{{ customer.name }}</option>
          }
        </select>
        <select class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" formControlName="productId">
          @for (product of products(); track product.id) {
            <option [ngValue]="product.id">{{ product.name }}</option>
          }
        </select>
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" type="number" min="1" formControlName="quantity" />
        <button class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#126bff] font-bold text-white disabled:opacity-60" [disabled]="form.invalid">
          <svg lucideReceiptText class="h-4 w-4" aria-hidden="true" />
          Tạo đơn hàng
        </button>
      </form>
    </section>

    <section appReveal class="overflow-hidden rounded-lg border border-[#e2e9f4] bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] text-left">
          <thead class="bg-slate-50 text-sm text-slate-500">
            <tr><th class="p-3">Mã đơn hàng</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thời gian</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            @for (order of orders(); track order.id) {
              <tr class="border-t border-[#e2e9f4]">
                <td class="p-3 font-extrabold text-[#126bff]">{{ order.code }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ vnd(order.totalAmount) }}</td>
                <td><span class="rounded-md px-2 py-1 text-xs font-extrabold" [class]="statusClass(order.status)">{{ statusLabel(order.status) }}</span></td>
                <td>{{ order.orderedAt.slice(0, 16).replace('T', ' ') }}</td>
                <td>
                  <button class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-white" type="button" (click)="markPaid(order)">
                    <svg lucideCheckCircle2 class="h-4 w-4" aria-hidden="true" />
                    Thanh toán
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class OrdersPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  readonly vnd = formatVnd;
  readonly statusLabel = statusLabel;
  readonly statusClass = statusClass;
  readonly orders = signal<OrderDto[]>([]);
  readonly products = signal<ProductDto[]>([]);
  readonly customers = signal<CustomerDto[]>([]);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    customerId: [1, Validators.required],
    productId: [1, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadProducts();
    this.api.customers().subscribe((result) => this.customers.set(result.items));
    this.load();
  }

  load(): void {
    this.api.orders().subscribe((result) => this.orders.set(result.items));
  }

  loadProducts(): void {
    this.api.products().subscribe((result) => this.products.set(result.items));
  }

  create(): void {
    const value = this.form.getRawValue();
    const selectedProduct = this.products().find((product) => product.id === value.productId);

    this.error.set('');
    if (selectedProduct?.stockQuantity === 0) {
      this.error.set('Sản phẩm hết hàng !');
      return;
    }

    this.api.createOrder(value.customerId, value.productId, value.quantity).subscribe({
      next: () => {
        this.load();
        this.loadProducts();
      },
      error: (error: unknown) => this.error.set(this.getApiErrorMessage(error)),
    });
  }

  markPaid(order: OrderDto): void {
    this.api.updateOrderStatus(order.id, 1).subscribe(() => this.load());
  }

  private getApiErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiError = error.error as Partial<ApiError> | null;
      if (typeof apiError?.message === 'string' && apiError.message.length > 0) {
        return apiError.message;
      }
    }

    return 'Tạo đơn hàng thất bại.';
  }
}
