import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        @if (eyebrow()) {
          <p class="mb-[0.35rem] mt-0 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-primary">{{ eyebrow() }}</p>
        }
        <h1 class="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.2] tracking-[-0.02em]">{{ titulo() }}</h1>
        @if (subtitulo()) {
          <p class="mt-[0.4rem] mb-0 text-[0.93rem] text-text-muted">{{ subtitulo() }}</p>
        }
      </div>
      <ng-content />
    </header>
  `,
})
export class PageHeader {
  readonly eyebrow = input('');
  readonly titulo = input.required<string>();
  readonly subtitulo = input('');
}
