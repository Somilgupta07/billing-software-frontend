import client from "./client";

export const getProducts = async () => {
  const { data } = await client.get("/products");
  return data.data;
};

export const getProduct = async (id) => {
  const { data } = await client.get(`/products/${id}`);
  return data.data;
};

export const createProduct = async (payload) => {
  const { data } = await client.post("/products", payload);
  return data.data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await client.put(`/products/${id}`, payload);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await client.delete(`/products/${id}`);
  return data;
};
