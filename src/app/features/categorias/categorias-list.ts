import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { mensajeDeError } from '../../core/api-error';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Alert } from '../../shared/alert/alert';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { PageHeader } from '../../shared/page-header/page-header';
import { SearchField } from '../../shared/search-field/search-field';
import { Toolbar } from '../../shared/toolbar/toolbar';

type FiltroEstado = 'todas' | 'activas' | 'inactivas';

@Component({
  selector: 'app-categorias-list',
  imports: [RouterLink, DatePipe, Alert, ConfirmDialog, EmptyState, LoadingState, PageHeader, SearchField, Toolbar],
  templateUrl: './categorias-list.html',
})
export class CategoriasList implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificacion = inject(NotificacionService);

  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  readonly busqueda = signal('');
  readonly filtroEstado = signal<FiltroEstado>('todas');

  readonly aEliminar = signal<Categoria | null>(null);
  readonly eliminando = signal(false);

  readonly hayFiltros = computed(
    () => this.busqueda().trim() !== '' || this.filtroEstado() !== 'todas',
  );

  readonly filtradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.categorias().filter((categoria) => {
      const coincideTexto =
        texto === '' ||
        categoria.nombre.toLowerCase().includes(texto) ||
        (categoria.descripcion ?? '').toLowerCase().includes(texto);

      const coincideEstado =
        estado === 'todas' ||
        (estado === 'activas' ? categoria.estado : !categoria.estado);

      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.categoriaService
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (categorias) => this.categorias.set(categorias),
        error: (error: unknown) => {
          this.error.set(mensajeDeError(error, 'No se pudieron cargar las categorías'));
        },
      });
  }

  onFiltroEstado(evento: Event): void {
    this.filtroEstado.set((evento.target as HTMLSelectElement).value as FiltroEstado);
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroEstado.set('todas');
  }

  solicitarEliminacion(categoria: Categoria): void {
    this.aEliminar.set(categoria);
  }

  cerrarConfirmacion(): void {
    this.aEliminar.set(null);
  }

  eliminar(): void {
    const categoria = this.aEliminar();

    if (!categoria) {
      return;
    }

    this.eliminando.set(true);

    this.categoriaService
      .eliminar(categoria.id)
      .pipe(finalize(() => this.eliminando.set(false)))
      .subscribe({
        next: (respuesta) => {
          this.categorias.update((lista) =>
            lista.filter((item) => item.id !== categoria.id),
          );
          this.notificacion.mostrar(respuesta.mensaje);
          this.cerrarConfirmacion();
        },
        error: (error: unknown) => {
          this.notificacion.mostrar(
            mensajeDeError(error, 'No se pudo eliminar la categoría'),
            'error',
          );
        },
      });
  }
}


