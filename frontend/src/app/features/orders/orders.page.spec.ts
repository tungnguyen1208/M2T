import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { CustomerDto, OrderDto, ProductDto } from '../../core/models';
import { OrdersPage } from './orders.page';

describe('OrdersPage', () => {
  let fixture: ComponentFixture<OrdersPage>;
  let api: jasmine.SpyObj<ApiService>;

  const customer: CustomerDto = {
    id: 1,
    name: 'Khách lẻ',
    phone: '0900000000',
    email: 'guest@example.com',
    address: 'Hà Nội',
    createdAt: '2026-06-10T00:00:00',
    orderCount: 0,
  };

  const product: ProductDto = {
    id: 1,
    name: 'Laptop test',
    sku: 'LAP-TEST',
    description: 'Laptop test',
    price: 1000000,
    costPrice: 800000,
    stockQuantity: 0,
    imageUrl: '',
    status: 'Active',
    categoryId: 1,
    categoryName: 'Laptop',
  };

  const order: OrderDto = {
    id: 1,
    code: 'DH10046',
    customerId: 1,
    customerName: customer.name,
    totalAmount: 1000000,
    status: 'Paid',
    orderedAt: '2026-06-10T00:00:00',
    items: [],
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', [
      'products',
      'customers',
      'orders',
      'createOrder',
      'updateOrderStatus',
    ]);
    api.products.and.returnValue(of({ items: [product], page: 1, pageSize: 50, totalItems: 1, totalPages: 1 }));
    api.customers.and.returnValue(of({ items: [customer], page: 1, pageSize: 50, totalItems: 1, totalPages: 1 }));
    api.orders.and.returnValue(of({ items: [], page: 1, pageSize: 50, totalItems: 0, totalPages: 0 }));

    await TestBed.configureTestingModule({
      imports: [OrdersPage],
      providers: [{ provide: ApiService, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPage);
    fixture.detectChanges();
  });

  it('does not call the API and shows the exact out-of-stock message', () => {
    fixture.componentInstance.create();
    fixture.detectChanges();

    expect(api.createOrder).not.toHaveBeenCalled();
    expect(fixture.componentInstance.error()).toBe('Sản phẩm hết hàng !');
    expect(fixture.nativeElement.textContent).toContain('Sản phẩm hết hàng !');
  });

  it('shows backend API error messages when create fails', () => {
    api.products.and.returnValue(
      of({
        items: [{ ...product, stockQuantity: 2 }],
        page: 1,
        pageSize: 50,
        totalItems: 1,
        totalPages: 1,
      }),
    );
    api.createOrder.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { message: 'Sản phẩm hết hàng !' },
          }),
      ),
    );

    fixture = TestBed.createComponent(OrdersPage);
    fixture.detectChanges();
    fixture.componentInstance.create();
    fixture.detectChanges();

    expect(api.createOrder).toHaveBeenCalledOnceWith(1, 1, 1);
    expect(fixture.componentInstance.error()).toBe('Sản phẩm hết hàng !');
  });

  it('reloads products after a successful order create', () => {
    api.products.and.returnValue(
      of({
        items: [{ ...product, stockQuantity: 2 }],
        page: 1,
        pageSize: 50,
        totalItems: 1,
        totalPages: 1,
      }),
    );
    api.createOrder.and.returnValue(of(order));

    fixture = TestBed.createComponent(OrdersPage);
    fixture.detectChanges();
    fixture.componentInstance.create();

    expect(api.createOrder).toHaveBeenCalledOnceWith(1, 1, 1);
    expect(api.products).toHaveBeenCalledTimes(3);
  });
});
