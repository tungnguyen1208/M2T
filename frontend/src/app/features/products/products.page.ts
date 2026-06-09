import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideFilter, LucidePackage, LucidePencil, LucidePlus, LucideSearch, LucideTrash2 } from '@lucide/angular';
import { ApiService } from '../../core/api.service';
import { CategoryDto, ProductDto, UpsertProductRequest } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { formatVnd } from '../../shared/ui';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective, LucideFilter, LucidePackage, LucidePencil, LucidePlus, LucideSearch, LucideTrash2],
  template: `
    <section appReveal class="grid gap-4 rounded-lg border border-[#e2e9f4] bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span class="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-[#126bff]">
            <svg lucidePackage class="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 class="mt-3 text-2xl font-extrabold">Sản phẩm</h2>
          <p class="font-semibold text-slate-500">Quản lý laptop, PC, linh kiện và phụ kiện.</p>
        </div>
        <form class="flex flex-col gap-2 sm:flex-row" [formGroup]="filters" (ngSubmit)="load()">
          <label class="relative">
            <svg lucideSearch class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" aria-hidden="true" />
            <input class="h-10 rounded-lg border border-[#e2e9f4] pl-10 pr-3 outline-none focus:border-[#126bff]" placeholder="Tìm sản phẩm" formControlName="search" />
          </label>
          <select class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" formControlName="categoryId">
            <option [ngValue]="null">Tất cả danh mục</option>
            @for (category of categories(); track category.id) {
              <option [ngValue]="category.id">{{ category.name }}</option>
            }
          </select>
          <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#126bff] px-4 font-bold text-white">
            <svg lucideFilter class="h-4 w-4" aria-hidden="true" />
            Lọc
          </button>
        </form>
      </div>

      <form class="grid gap-3 rounded-lg bg-slate-50 p-4 lg:grid-cols-4" [formGroup]="form" (ngSubmit)="save()">
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="Tên sản phẩm" formControlName="name" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" placeholder="SKU" formControlName="sku" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" type="number" placeholder="Giá bán" formControlName="price" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" type="number" placeholder="Tồn kho" formControlName="stockQuantity" />
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" type="number" placeholder="Giá vốn" formControlName="costPrice" />
        <select class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" formControlName="categoryId">
          @for (category of categories(); track category.id) {
            <option [ngValue]="category.id">{{ category.name }}</option>
          }
        </select>
        <input class="h-10 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff] lg:col-span-2" placeholder="URL ảnh" formControlName="imageUrl" />
        <textarea class="rounded-lg border border-[#e2e9f4] px-3 py-2 outline-none focus:border-[#126bff] lg:col-span-3" rows="2" placeholder="Mô tả" formControlName="description"></textarea>
        <button class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 font-bold text-white disabled:opacity-60" [disabled]="form.invalid">
          <svg lucidePlus class="h-4 w-4" aria-hidden="true" />
          {{ editingId() ? 'Cập nhật' : 'Thêm sản phẩm' }}
        </button>
      </form>
    </section>

    <section appReveal class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      @for (product of products(); track product.id) {
        <article class="overflow-hidden rounded-lg border border-[#e2e9f4] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <img class="aspect-[1.45] w-full bg-slate-100 object-cover" [src]="product.imageUrl" [alt]="product.name" loading="lazy" />
          <div class="grid gap-3 p-4">
            <div>
              <h3 class="line-clamp-2 font-extrabold">{{ product.name }}</h3>
              <p class="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">{{ product.description }}</p>
            </div>
            <div class="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              <span class="rounded-md bg-slate-50 px-2 py-1">{{ product.sku }}</span>
              <span class="rounded-md bg-blue-50 px-2 py-1 text-[#126bff]">{{ product.categoryName }}</span>
              <span class="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">Tồn: {{ product.stockQuantity }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <strong class="text-[#126bff]">{{ vnd(product.price) }}</strong>
              <div class="flex gap-2">
                <button class="grid h-9 w-9 place-items-center rounded-lg border border-[#e2e9f4] text-slate-600" type="button" (click)="edit(product)" aria-label="Sửa sản phẩm">
                  <svg lucidePencil class="h-4 w-4" aria-hidden="true" />
                </button>
                <button class="grid h-9 w-9 place-items-center rounded-lg bg-rose-500 text-white" type="button" (click)="remove(product.id)" aria-label="Xóa sản phẩm">
                  <svg lucideTrash2 class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </article>
      }
    </section>
  `,
})
export class ProductsPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  readonly vnd = formatVnd;
  readonly products = signal<ProductDto[]>([]);
  readonly categories = signal<CategoryDto[]>([]);
  readonly editingId = signal<number | null>(null);
  readonly filters = this.fb.group({ search: [''], categoryId: [null as number | null] });
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(1)]],
    costPrice: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    categoryId: [1, Validators.required],
    status: [1],
  });

  ngOnInit(): void {
    this.api.categories().subscribe((categories) => this.categories.set(categories));
    this.load();
  }

  load(): void {
    const value = this.filters.value;
    this.api
      .products({
        search: value.search ?? undefined,
        categoryId: value.categoryId ?? undefined,
      })
      .subscribe((result) => this.products.set(result.items));
  }

  edit(product: ProductDto): void {
    this.editingId.set(product.id);
    this.form.patchValue({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      costPrice: product.costPrice,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      status: 1,
    });
  }

  save(): void {
    const request = this.form.getRawValue() as UpsertProductRequest;
    const id = this.editingId();
    const source = id ? this.api.updateProduct(id, request) : this.api.createProduct(request);
    source.subscribe(() => {
      this.form.reset({ name: '', sku: '', description: '', price: 0, costPrice: 0, stockQuantity: 0, imageUrl: '', categoryId: 1, status: 1 });
      this.editingId.set(null);
      this.load();
    });
  }

  remove(id: number): void {
    if (!confirm('Xóa sản phẩm này?')) return;
    this.api.deleteProduct(id).subscribe(() => this.load());
  }
}
