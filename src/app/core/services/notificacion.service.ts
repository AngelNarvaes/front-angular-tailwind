import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error';

export interface Notificacion {
  id: number;
  texto: string;
  tipo: TipoNotificacion;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly _notificacion = signal<Notificacion | null>(null);
  private temporizador?: ReturnType<typeof setTimeout>;

  readonly notificacion = this._notificacion.asReadonly();

  mostrar(texto: string, tipo: TipoNotificacion = 'exito'): void {
    clearTimeout(this.temporizador);

    this._notificacion.set({ id: Date.now(), texto, tipo });

    this.temporizador = setTimeout(() => this._notificacion.set(null), 4500);
  }

  cerrar(): void {
    clearTimeout(this.temporizador);
    this._notificacion.set(null);
  }
}
