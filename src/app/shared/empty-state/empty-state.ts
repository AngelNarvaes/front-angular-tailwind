import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="flex flex-col items-center gap-[0.35rem] rounded-[14px] border border-border bg-surface p-[3.25rem_1.5rem] text-center shadow-card-sm">
      @if (icono()) {
        <div class="mb-[0.4rem] text-[2rem]" aria-hidden="true">{{ icono() }}</div>
      }
      <h2 class="m-0 text-[1.1rem] font-bold">{{ titulo() }}</h2>
      <p class="mb-4 mt-0 max-w-[40ch] text-[0.9rem] text-text-muted">{{ mensaje() }}</p>
      <ng-content />
    </div>
  `,
})
export class EmptyState {
  readonly icono = input('');
  readonly titulo = input.required<string>();
  readonly mensaje = input.required<string>();
}

