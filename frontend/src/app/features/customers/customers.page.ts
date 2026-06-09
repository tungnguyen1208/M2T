import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideMail, LucideMapPin, LucidePencil, LucidePhone, LucideUserPlus, LucideUsers } from '@lucide/angular';
import { ApiService } from '../../core/api.service';
import { CustomerDto } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective, LucideMail, LucideMapPin, LucidePencil, LucidePhone, LucideUserPlus, LucideUsers],
  template: `
    <section appReveal class="grid gap-4 rounded-lg border border-[#e2e9f4] bg-white p-5 shadow-sm">
      <div>
        <span class="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-[#126bff]">
          <svg lucideUsers class="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 class="mt-3 text-2xl font-extrabold">Khách hàng</h2>
        <p class="font-semibold text-slate-500">Quản lý thông tin khách mua hàng.</p>
      </div>
      <form class="grid gap-3 md:grid-cols-5" [formGroup]="form" (ngSubmit)="save()">
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="Tên" formControlName="name" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="SĐT" formControlName="phone" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="Email" formControlName="email" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="Địa chỉ" formControlName="address" />
        <button class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#126bff] font-bold text-white disabled:opacity-60" [disabled]="form.invalid">
          <svg lucideUserPlus class="h-4 w-4" aria-hidden="true" />
          {{ editingId() ? 'Cập nhật' : 'Thêm khách' }}
        </button>
      </form>
    </section>

    <section appReveal class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      @for (customer of customers(); track customer.id) {
        <article class="rounded-lg border border-[#e2e9f4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="font-extrabold">{{ customer.name }}</h3>
              <p class="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <svg lucidePhone class="h-4 w-4" aria-hidden="true" />
                {{ customer.phone || 'Chưa có SĐT' }}
              </p>
              <p class="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <svg lucideMail class="h-4 w-4" aria-hidden="true" />
                {{ customer.email || 'Chưa có email' }}
              </p>
              <p class="mt-2 flex items-start gap-2 text-sm text-slate-500">
                <svg lucideMapPin class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {{ customer.address || 'Chưa có địa chỉ' }}
              </p>
            </div>
            <span class="shrink-0 rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-[#126bff]">{{ customer.orderCount }} đơn</span>
          </div>
          <button class="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#e2e9f4] px-3 py-2 font-bold text-slate-600" type="button" (click)="edit(customer)">
            <svg lucidePencil class="h-4 w-4" aria-hidden="true" />
            Sửa
          </button>
        </article>
      }
    </section>
  `,
})
export class CustomersPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  readonly customers = signal<CustomerDto[]>([]);
  readonly editingId = signal<number | null>(null);
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: [''],
    email: [''],
    address: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.customers().subscribe((result) => this.customers.set(result.items));
  }

  edit(customer: CustomerDto): void {
    this.editingId.set(customer.id);
    this.form.patchValue(customer);
  }

  save(): void {
    const request = this.form.getRawValue();
    const id = this.editingId();
    const source = id ? this.api.updateCustomer(id, request) : this.api.createCustomer(request);
    source.subscribe(() => {
      this.form.reset({ name: '', phone: '', email: '', address: '' });
      this.editingId.set(null);
      this.load();
    });
  }
}
