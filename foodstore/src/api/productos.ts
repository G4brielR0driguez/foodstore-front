import apiClient from "./apiClient";
import type { Producto, ProductoCreate } from "../types";

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
