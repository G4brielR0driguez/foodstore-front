// ─────────────────────────────────────────────────────────────────────────────
// Interfaces centralizadas del dominio
// ─────────────────────────────────────────────────────────────────────────────

export interface Categoria {
  id: number;
  parent_id?: number | null;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  parent_id?: number | null;
  descripcion?: string | null;
  imagen_url?: string | null;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string | null;
  es_alergeno: boolean;
}

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string | null;
  es_alergeno: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagenes_url?: string[] | null;
  stock_cantidad: number;
  disponible: boolean;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagenes_url?: string[] | null;
  stock_cantidad: number;
  disponible: boolean;
  categoria_ids: number[];
  ingrediente_ids: number[];
}
