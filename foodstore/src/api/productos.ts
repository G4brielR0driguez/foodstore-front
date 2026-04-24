import apiClient from "./apiClient";
import { type Categoria } from "./categorias";
import { type Ingrediente } from "./ingredientes";

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

export const getProductos = async (): Promise<Producto[]> => {
  const response = await apiClient.get("/productos");
  return response.data;
};

export const getProducto = async (id: number): Promise<Producto> => {
  const response = await apiClient.get(`/productos/${id}`);
  return response.data;
};

export const createProducto = async (data: ProductoCreate): Promise<Producto> => {
  const response = await apiClient.post("/productos", data);
  return response.data;
};

export const updateProducto = async (id: number, data: Partial<ProductoCreate>): Promise<Producto> => {
  const response = await apiClient.patch(`/productos/${id}`, data);
  return response.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await apiClient.delete(`/productos/${id}`);
};
