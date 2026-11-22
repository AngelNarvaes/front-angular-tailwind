import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Publicacion, PublicacionPayload } from '../models/publicacion.model';

@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/publicaciones`;

  listar(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.url);
  }

  obtener(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.url}/${id}`);
  }

  crear(payload: PublicacionPayload): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.url, payload);
  }

  actualizar(id: number, payload: PublicacionPayload): Observable<Publicacion> {
    return this.http.put<Publicacion>(`${this.url}/${id}`, payload);
  }

  eliminar(id: number): Observable<{ mensaje: string; publicacion: Publicacion }> {
    return this.http.delete<{ mensaje: string; publicacion: Publicacion }>(`${this.url}/${id}`);
  }
}
