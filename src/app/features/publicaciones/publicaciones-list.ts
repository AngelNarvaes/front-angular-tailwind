import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { mensajeDeError } from '../../core/api-error';
import { Categoria } from '../../core/models/categoria.model';
import {
  ESTADOS_PUBLICACION,
  EstadoPublicacion,
  Publicacion,
} from '../../core/models/publicacion.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { PublicacionService } from '../../core/services/publicacion.service';
import { Alert } from '../../shared/alert/alert';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { PageHeader } from '../../shared/page-header/page-header';
import { SearchField } from '../../shared/search-field/search-field';
import { Toolbar } from '../../shared/toolbar/toolbar';

@Component({
  selector: 'app-publicaciones-list',
  imports: [RouterLink, DatePipe, DecimalPipe, TitleCasePipe, Alert, ConfirmDialog, EmptyState, LoadingState, PageHeader, SearchField, Toolbar],
  templateUrl: './publicaciones-list.html',
})
export class PublicacionesList implements OnInit {
  private readonly publicacionService = inject(PublicacionService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificacion = inject(NotificacionService);

  readonly estados = ESTADOS_PUBLICACION;

  readonly publicaciones = signal<Publicacion[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  readonly busqueda = signal('');
  readonly categoriaFiltro = signal<number | null>(null);
  readonly estadoFiltro = signal<EstadoPublicacion | ''>('');

  readonly aEliminar = signal<Publicacion | null>(null);
  readonly eliminando = signal(false);

  readonly hayFiltros = computed(
    () =>
      this.busqueda().trim() !== '' ||
      this.categoriaFiltro() !== null ||
      this.estadoFiltro() !== '',
  );

  readonly filtradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const categoriaId = this.categoriaFiltro();
    const estado = this.estadoFiltro();

    return this.publicaciones().filter((publicacion) => {
      const coincideTexto =
        texto === '' ||
        publicacion.titulo.toLowerCase().includes(texto) ||
        (publicacion.descripcion ?? '').toLowerCase().includes(texto);

      const coincideCategoria =
        categoriaId === null || publicacion.categoriaId === categoriaId;

      const coincideEstado = estado === '' || publicacion.estado === estado;

      return coincideTexto && coincideCategoria && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      publicaciones: this.publicacionService.listar(),
      categorias: this.categoriaService.listar(),
    })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: ({ publicaciones, categorias }) => {
          this.publicaciones.set(publicaciones);
          this.categorias.set(categorias);
        },
        error: (error: unknown) => {
          this.error.set(
            mensajeDeError(error, 'No se pudieron cargar las publicaciones'),
          );
        },
      });
  }

  onCategoriaFiltro(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.categoriaFiltro.set(valor === '' ? null : Number(valor));
  }

  onEstadoFiltro(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as EstadoPublicacion | '';
    this.estadoFiltro.set(valor);
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoriaFiltro.set(null);
    this.estadoFiltro.set('');
  }

  solicitarEliminacion(publicacion: Publicacion): void {
    this.aEliminar.set(publicacion);
  }

  cerrarConfirmacion(): void {
    this.aEliminar.set(null);
  }

  eliminar(): void {
    const publicacion = this.aEliminar();

    if (!publicacion) {
      return;
    }

    this.eliminando.set(true);

    this.publicacionService
      .eliminar(publicacion.id)
      .pipe(finalize(() => this.eliminando.set(false)))
      .subscribe({
        next: (respuesta) => {
          this.publicaciones.update((lista) =>
            lista.filter((item) => item.id !== publicacion.id),
          );
          this.notificacion.mostrar(respuesta.mensaje);
          this.cerrarConfirmacion();
        },
        error: (error: unknown) => {
          this.notificacion.mostrar(
            mensajeDeError(error, 'No se pudo eliminar la publicación'),
            'error',
          );
        },
      });
  }
}


