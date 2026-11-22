import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(error: unknown, mensajePorDefecto: string): string {
  if (error instanceof HttpErrorResponse) {
    const mensajeServidor = error.error?.mensaje;

    if (typeof mensajeServidor === 'string' && mensajeServidor.trim() !== '') {
      return mensajeServidor;
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://127.0.0.1:3000';
    }

    return error.message || mensajePorDefecto;
  }

  return error instanceof Error ? error.message : mensajePorDefecto;
}
