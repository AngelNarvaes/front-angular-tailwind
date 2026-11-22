import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <div class="flex items-center justify-center gap-3 rounded-[14px] border border-border bg-surface p-[3rem_1.5rem] text-[0.9rem] text-text-muted shadow-card-sm">
      <span class="h-[1.1rem] w-[1.1rem] animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true"></span>
      {{ mensaje() }}
    </div>
  `,
})
export class LoadingState {
  readonly mensaje = input('Cargando…');
}

