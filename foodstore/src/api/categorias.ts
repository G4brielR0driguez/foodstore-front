import apiClient from "./apiClient";

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

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await apiClient.get("/categorias");
  return response.data;
};

export const createCategoria = async (data: CategoriaCreate): Promise<Categoria> => {
  const response = await apiClient.post("/categorias", data);
  return response.data;
};

export const updateCategoria = async (id: number, data: Partial<CategoriaCreate>): Promise<Categoria> => {
  const response = await apiClient.patch(`/categorias/${id}`, data);
  return response.data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await apiClient.delete(`/categorias/${id}`);
};
