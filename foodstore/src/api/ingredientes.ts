import apiClient from "./apiClient";

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
