import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-6 backdrop-blur-[2px] animate-fade-in" (click)="cerrar()">
      <div
        class="w-[min(440px,100%)] rounded-[18px] bg-surface p-7 shadow-[0_24px_60px_rgba(15,23,42,0.25)] animate-pop-in"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-label]="titulo()"
        (click)="$event.stopPropagation()"
      >
        <div class="mb-4 grid h-11 w-11 place-items-center rounded-full bg-danger-soft text-[1.4rem] font-bold text-danger" aria-hidden="true">!</div>
        <h2 class="mb-2 mt-0 text-[1.2rem] font-bold">{{ titulo() }}</h2>
        <p class="mb-6 mt-0 leading-[1.55] text-text-muted">{{ mensaje() }}</p>
        <div class="flex justify-end gap-3">
          <button type="button" class="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-border bg-surface px-[1.05rem] py-[0.62rem] text-[0.9rem] font-semibold leading-[1.2] text-text transition duration-150 hover:border-slate-300 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60" [disabled]="cargando()" (click)="cerrar()">Cancelar</button>
          <button type="button" class="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-transparent bg-danger px-[1.05rem] py-[0.62rem] text-[0.9rem] font-semibold leading-[1.2] text-white transition duration-150 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60" [disabled]="cargando()" (click)="confirmar.emit()">
            @if (cargando()) { <span class="h-[0.85rem] w-[0.85rem] animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span> }
            {{ textoConfirmar() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  readonly titulo = input('Confirmar acción');
  readonly mensaje = input.required<string>();
  readonly textoConfirmar = input('Eliminar');
  readonly cargando = input(false);
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void { this.cerrar(); }

  cerrar(): void { if (!this.cargando()) this.cancelar.emit(); }
}

