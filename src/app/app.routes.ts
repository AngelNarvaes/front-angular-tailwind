import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'publicaciones',
  },
  {
    path: 'publicaciones',
    title: 'Publicaciones | Anuncios',
    loadComponent: () =>
      import('./features/publicaciones/publicaciones-list').then(
        (modulo) => modulo.PublicacionesList,
      ),
  },
  {
    path: 'publicaciones/nueva',
    title: 'Nueva publicación | Anuncios',
    loadComponent: () =>
      import('./features/publicaciones/publicacion-form').then(
        (modulo) => modulo.PublicacionForm,
      ),
  },
  {
    path: 'publicaciones/:id/editar',
    title: 'Editar publicación | Anuncios',
    loadComponent: () =>
      import('./features/publicaciones/publicacion-form').then(
        (modulo) => modulo.PublicacionForm,
      ),
  },
  {
    path: 'categorias',
    title: 'Categorías | Anuncios',
    loadComponent: () =>
      import('./features/categorias/categorias-list').then(
        (modulo) => modulo.CategoriasList,
      ),
  },
  {
    path: 'categorias/nueva',
    title: 'Nueva categoría | Anuncios',
    loadComponent: () =>
      import('./features/categorias/categoria-form').then(
        (modulo) => modulo.CategoriaForm,
      ),
  },
  {
    path: 'categorias/:id/editar',
    title: 'Editar categoría | Anuncios',
    loadComponent: () =>
      import('./features/categorias/categoria-form').then(
        (modulo) => modulo.CategoriaForm,
      ),
  },
  {
    path: '**',
    redirectTo: 'publicaciones',
  },
];
