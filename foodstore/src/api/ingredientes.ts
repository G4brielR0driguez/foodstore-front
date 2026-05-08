import apiClient from "./apiClient";
import type { Ingrediente, IngredienteCreate } from "../types";

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const response = await apiClient.get("/ingredientes");
  return response.data;
};

export const createIngrediente = async (data: IngredienteCreate): Promise<Ingrediente> => {
  const response = await apiClient.post("/ingredientes", data);
  return response.data;
};

export const updateIngrediente = async (id: number, data: Partial<IngredienteCreate>): Promise<Ingrediente> => {
  const response = await apiClient.patch(`/ingredientes/${id}`, data);
  return response.data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await apiClient.delete(`/ingredientes/${id}`);
};
