import apiClient from "./apiClient";
import type { Categoria, CategoriaCreate } from "../types";

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
