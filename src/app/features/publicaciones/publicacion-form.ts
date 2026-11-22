import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { mensajeDeError } from '../../core/api-error';
import { Categoria } from '../../core/models/categoria.model';
import {
  ESTADOS_PUBLICACION,
  EstadoPublicacion,
  PublicacionPayload,
} from '../../core/models/publicacion.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { PublicacionService } from '../../core/services/publicacion.service';
import { Alert } from '../../shared/alert/alert';
import { FormActions } from '../../shared/form-actions/form-actions';
import { FormField } from '../../shared/form-field/form-field';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { PageHeader } from '../../shared/page-header/page-header';

type CampoFormulario = 'titulo' | 'descripcion' | 'precio' | 'categoriaId';

@Component({
  selector: 'app-publicacion-form',
  imports: [ReactiveFormsModule, RouterLink, TitleCasePipe, Alert, FormActions, FormField, LoadingState, PageHeader],
  templateUrl: './publicacion-form.html',
})
export class PublicacionForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly publicacionService = inject(PublicacionService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificacion = inject(NotificacionService);

  readonly estados = ESTADOS_PUBLICACION;

  readonly id = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly cargandoCategorias = signal(true);
  readonly guardando = signal(false);
  readonly enviado = signal(false);
  readonly error = signal<string | null>(null);
  readonly categorias = signal<Categoria[]>([]);

  readonly esEdicion = computed(() => this.id() !== null);

  readonly form = this.fb.group({
    titulo: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(150),
    ]),
    descripcion: this.fb.nonNullable.control('', [Validators.maxLength(2000)]),
    precio: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    categoriaId: this.fb.control<number | null>(null, Validators.required),
    estado: this.fb.nonNullable.control<EstadoPublicacion>('activo'),
  });

  ngOnInit(): void {
    this.cargarCategorias();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.notificacion.mostrar('La publicación indicada no es válida', 'error');
      this.router.navigate(['/publicaciones']);
      return;
    }

    this.id.set(id);
    this.cargarPublicacion(id);
  }

  mostrarError(campo: CampoFormulario): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || this.enviado());
  }

  private cargarCategorias(): void {
    this.cargandoCategorias.set(true);

    this.categoriaService
      .listar()
      .pipe(finalize(() => this.cargandoCategorias.set(false)))
      .subscribe({
        next: (categorias) => this.categorias.set(categorias),
        error: (error: unknown) => {
          this.error.set(
            mensajeDeError(error, 'No se pudieron cargar las categorías'),
          );
        },
      });
  }

  private cargarPublicacion(id: number): void {
    this.cargando.set(true);

    this.publicacionService
      .obtener(id)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (publicacion) => {
          this.form.patchValue({
            titulo: publicacion.titulo,
            descripcion: publicacion.descripcion ?? '',
            precio: publicacion.precio,
            categoriaId: publicacion.categoriaId,
            estado: publicacion.estado,
          });
        },
        error: (error: unknown) => {
          this.error.set(
            mensajeDeError(error, 'No se pudo cargar la publicación'),
          );
        },
      });
  }

  guardar(): void {
    this.enviado.set(true);
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const valor = this.form.getRawValue();
    const payload: PublicacionPayload = {
      titulo: valor.titulo.trim(),
      descripcion: valor.descripcion.trim() === '' ? null : valor.descripcion.trim(),
      precio: Number(valor.precio),
      categoriaId: Number(valor.categoriaId),
      estado: valor.estado,
    };

    const id = this.id();

    this.guardando.set(true);

    const peticion =
      id === null
        ? this.publicacionService.crear(payload)
        : this.publicacionService.actualizar(id, payload);

    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => {
        this.notificacion.mostrar(
          id === null
            ? 'Publicación creada correctamente'
            : 'Publicación actualizada correctamente',
        );
        this.router.navigate(['/publicaciones']);
      },
      error: (error: unknown) => {
        this.error.set(mensajeDeError(error, 'No se pudo guardar la publicación'));
      },
    });
  }
}


