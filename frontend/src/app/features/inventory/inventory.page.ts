import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideBox, LucidePackagePlus, LucideWarehouse } from '@lucide/angular';
import { ApiService } from '../../core/api.service';
import { InventoryStatusDto, InventoryTransactionDto, ProductDto } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective, LucideBox, LucidePackagePlus, LucideWarehouse],
  template: `
    <section appReveal class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      @for (item of status(); track item.categoryName) {
        <article class="rounded-lg border border-[#e2e9f4] bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-500">
                <svg lucideBox class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 class="font-extrabold">{{ item.categoryName }}</h3>
                <p class="text-sm font-semibold text-slate-500">{{ item.stockQuantity }} sản phẩm</p>
              </div>
            </div>
            <strong>{{ item.percentage }}%</strong>
          </div>
          <div class="mt-4 h-2 rounded-full bg-blue-100"><div class="h-full rounded-full bg-[#126bff]" [style.width.%]="item.percentage"></div></div>
        </article>
      }
    </section>

    <section appReveal class="grid gap-4 rounded-lg border border-[#e2e9f4] bg-white p-5 shadow-sm">
      <div>
        <span class="inline-grid h-11 w-11 place-items-center rounded-lg bg-violet-50 text-violet-600">
          <svg lucideWarehouse class="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 class="mt-3 text-2xl font-extrabold">Nhập hàng</h2>
        <p class="font-semibold text-slate-500">Cập nhật số lượng nhập kho cho từng sản phẩm.</p>
      </div>
      <form class="grid gap-3 rounded-lg bg-slate-50 p-4 md:grid-cols-4" [formGroup]="form" (ngSubmit)="stockIn()">
        <select class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" formControlName="productId">
          @for (product of products(); track product.id) {
            <option [ngValue]="product.id">{{ product.name }}</option>
          }
        </select>
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" type="number" formControlName="quantity" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="Ghi chú" formControlName="note" />
        <button class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-500 font-bold text-white disabled:opacity-60" [disabled]="form.invalid">
          <svg lucidePackagePlus class="h-4 w-4" aria-hidden="true" />
          Nhập kho
        </button>
      </form>
    </section>

    <section appReveal class="overflow-hidden rounded-lg border border-[#e2e9f4] bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] text-left">
          <thead class="bg-slate-50 text-sm text-slate-500">
            <tr><th class="p-3">Sản phẩm</th><th>Loại</th><th>Số lượng</th><th>Ghi chú</th></tr>
          </thead>
          <tbody>
            @for (item of transactions(); track item.id) {
              <tr class="border-t border-[#e2e9f4]"><td class="p-3 font-bold">{{ item.productName }}</td><td>{{ item.type }}</td><td>{{ item.quantity }}</td><td>{{ item.note }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class InventoryPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  readonly status = signal<InventoryStatusDto[]>([]);
  readonly transactions = signal<InventoryTransactionDto[]>([]);
  readonly products = signal<ProductDto[]>([]);
  readonly form = this.fb.nonNullable.group({
    productId: [1, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    note: ['Nhập hàng'],
  });

  ngOnInit(): void {
    this.api.products().subscribe((result) => this.products.set(result.items));
    this.load();
  }

  load(): void {
    this.api.inventoryStatus().subscribe((status) => this.status.set(status));
    this.api.transactions().subscribe((result) => this.transactions.set(result.items));
  }

  stockIn(): void {
    const value = this.form.getRawValue();
    this.api.stockIn(value.productId, value.quantity, value.note).subscribe(() => this.load());
  }
}
