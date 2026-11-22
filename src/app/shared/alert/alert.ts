import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <div [class]="clases()">
      <ng-content />
    </div>
  `,
})
export class Alert {
  readonly tipo = input<'error' | 'warning'>('error');
  readonly sinMargen = input(false);

  readonly clases = computed(() => {
    const base = 'flex flex-wrap items-center justify-between gap-3 rounded-[10px] border p-[0.85rem_1rem] text-[0.88rem]';
    const margen = this.sinMargen() ? '' : ' mb-[1.1rem]';
    const variante = this.tipo() === 'warning'
      ? ' border-amber-200 bg-amber-50 text-amber-900'
      : ' border-red-200 bg-red-50 text-red-900';
    return base + margen + variante;
  });
}
