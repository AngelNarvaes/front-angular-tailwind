import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { mensajeDeError } from '../../core/api-error';
import { CategoriaPayload } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Alert } from '../../shared/alert/alert';
import { FormActions } from '../../shared/form-actions/form-actions';
import { FormField } from '../../shared/form-field/form-field';
import { LoadingState } from '../../shared/loading-state/loading-state';
import { PageHeader } from '../../shared/page-header/page-header';

type CampoFormulario = 'nombre' | 'descripcion' | 'estado';

@Component({
  selector: 'app-categoria-form',
  imports: [ReactiveFormsModule, RouterLink, Alert, FormActions, FormField, LoadingState, PageHeader],
  templateUrl: './categoria-form.html',
})
export class CategoriaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificacion = inject(NotificacionService);

  readonly id = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly enviado = signal(false);
  readonly error = signal<string | null>(null);

  readonly esEdicion = computed(() => this.id() !== null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.maxLength(1000)]],
    estado: [true],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.notificacion.mostrar('La categoría indicada no es válida', 'error');
      this.router.navigate(['/categorias']);
      return;
    }

    this.id.set(id);
    this.cargar(id);
  }

  mostrarError(campo: CampoFormulario): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || this.enviado());
  }

  private cargar(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.categoriaService
      .obtener(id)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (categoria) => {
          this.form.patchValue({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion ?? '',
            estado: categoria.estado,
          });
        },
        error: (error: unknown) => {
          this.error.set(mensajeDeError(error, 'No se pudo cargar la categoría'));
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
    const payload: CategoriaPayload = {
      nombre: valor.nombre.trim(),
      descripcion: valor.descripcion.trim() === '' ? null : valor.descripcion.trim(),
      estado: valor.estado,
    };

    const id = this.id();

    this.guardando.set(true);

    const peticion =
      id === null
        ? this.categoriaService.crear(payload)
        : this.categoriaService.actualizar(id, payload);

    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => {
        this.notificacion.mostrar(
          id === null
            ? 'Categoría creada correctamente'
            : 'Categoría actualizada correctamente',
        );
        this.router.navigate(['/categorias']);
      },
      error: (error: unknown) => {
        this.error.set(mensajeDeError(error, 'No se pudo guardar la categoría'));
      },
    });
  }
}


