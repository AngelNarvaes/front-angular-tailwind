import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Categoria, CategoriaPayload } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/categorias`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  obtener(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }

  crear(payload: CategoriaPayload): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, payload);
  }

  actualizar(id: number, payload: CategoriaPayload): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/${id}`, payload);
  }

  eliminar(id: number): Observable<{ mensaje: string; categoria: Categoria }> {
    return this.http.delete<{ mensaje: string; categoria: Categoria }>(`${this.url}/${id}`);
  }
}
