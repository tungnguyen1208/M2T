import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideConstruction } from '@lucide/angular';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [RouterLink, RevealDirective, LucideArrowLeft, LucideConstruction],
  template: `
    <section appReveal class="rounded-lg border border-[#e2e9f4] bg-white p-8 shadow-sm">
      <span class="inline-grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-[#126bff]">
        <svg lucideConstruction class="h-7 w-7" aria-hidden="true" />
      </span>
      <p class="mt-5 text-sm font-extrabold uppercase tracking-wide text-[#126bff]">Phase sau</p>
      <h2 class="mt-2 text-3xl font-extrabold">{{ title }}</h2>
      <p class="mt-3 max-w-2xl font-semibold text-slate-500">
        Route này đã được tạo để sidebar không bị gãy. Chức năng nghiệp vụ sẽ được triển khai sau core v1.
      </p>
      <a routerLink="/dashboard" class="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#126bff] px-4 py-2 font-bold text-white">
        <svg lucideArrowLeft class="h-4 w-4" aria-hidden="true" />
        Về tổng quan
      </a>
    </section>
  `,
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] ?? 'Chức năng';
}
