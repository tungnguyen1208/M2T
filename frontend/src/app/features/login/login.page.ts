import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideLogIn, LucideShoppingBag } from '@lucide/angular';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, LucideLogIn, LucideShoppingBag],
  template: `
    <main class="grid min-h-screen place-items-center bg-[#f5f8fd] px-4">
      <section class="w-full max-w-md rounded-lg border border-[#e2e9f4] bg-white p-8 shadow-xl">
        <div class="mb-7 flex items-center gap-3">
          <span class="grid h-12 w-12 place-items-center rounded-lg bg-[#126bff] text-white shadow-lg">
            <svg lucideShoppingBag class="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 class="text-2xl font-extrabold">POS365</h1>
            <p class="text-sm font-semibold text-slate-500">Đăng nhập quản trị bán hàng</p>
          </div>
        </div>

        <form class="grid gap-4" [formGroup]="form" (ngSubmit)="submit()">
          <label class="grid gap-2 text-sm font-bold text-slate-600">
            Tên đăng nhập
            <input class="h-11 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" formControlName="userName" />
          </label>
          <label class="grid gap-2 text-sm font-bold text-slate-600">
            Mật khẩu
            <input class="h-11 rounded-lg border border-[#e2e9f4] px-3 outline-none focus:border-[#126bff]" type="password" formControlName="password" />
          </label>

          @if (error()) {
            <p class="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">{{ error() }}</p>
          }

          <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#126bff] font-bold text-white disabled:opacity-60" type="submit" [disabled]="form.invalid || loading()">
            <svg lucideLogIn class="h-5 w-5" aria-hidden="true" />
            {{ loading() ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
          <p class="text-center text-xs font-semibold text-slate-500">Tài khoản seed: admin / Admin&#64;123</p>
        </form>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    userName: ['admin', Validators.required],
    password: ['Admin@123', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.controls.userName.value, this.form.controls.password.value).subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: () => {
        this.error.set('Đăng nhập thất bại. Kiểm tra lại tài khoản.');
        this.loading.set(false);
      },
    });
  }
}
