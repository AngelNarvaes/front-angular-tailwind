export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriaPayload {
  nombre: string;
  descripcion?: string | null;
  estado?: boolean;
}
