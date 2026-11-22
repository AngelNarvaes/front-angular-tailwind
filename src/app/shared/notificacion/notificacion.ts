import { Component, inject } from '@angular/core';

import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-notificacion',
  template: `
    @if (notificacion.notificacion(); as aviso) {
      <div
        class="fixed right-6 bottom-6 z-[80] flex max-w-[min(420px,calc(100vw-3rem))] items-center gap-[0.7rem] rounded-xl border p-[0.85rem_1rem] shadow-card animate-toast-in"
        [class]="aviso.tipo === 'error' ? 'border-red-200 bg-red-50 text-red-900' : 'border-green-200 bg-green-50 text-green-900'"
        role="status"
        aria-live="polite"
      >
        <span class="h-[0.55rem] w-[0.55rem] shrink-0 rounded-full" [class]="aviso.tipo === 'error' ? 'bg-danger' : 'bg-green-600'" aria-hidden="true"></span>
        <span class="text-[0.9rem] leading-[1.4]">{{ aviso.texto }}</span>
        <button type="button" class="ml-auto cursor-pointer border-0 bg-transparent p-[0_0.15rem] text-[1.25rem] leading-none text-inherit opacity-60 hover:opacity-100" aria-label="Cerrar notificación" (click)="notificacion.cerrar()">×</button>
      </div>
    }
  `,
})
export class NotificacionComponent {
  readonly notificacion = inject(NotificacionService);
}

