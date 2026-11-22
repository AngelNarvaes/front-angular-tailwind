import { Categoria } from './categoria.model';

export const ESTADOS_PUBLICACION = ['activo', 'pausado', 'vendido'] as const;

export type EstadoPublicacion = (typeof ESTADOS_PUBLICACION)[number];

export interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string | null;
  precio: number;
  categoriaId: number;
  estado: EstadoPublicacion;
  fechaCreacion: string;
  fechaActualizacion: string;
  categoria?: Categoria;
}

export interface PublicacionPayload {
  titulo: string;
  descripcion?: string | null;
  precio: number;
  categoriaId: number;
  estado?: EstadoPublicacion;
}

export interface RespuestaEliminacion<T> {
  mensaje: string;
  [clave: string]: T | string;
}
