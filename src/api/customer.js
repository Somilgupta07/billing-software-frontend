import client from "./client";

export const getCustomers = async () => {
  const { data } = await client.get("/customers");
  return data.data;
};

export const getCustomer = async (id) => {
  const { data } = await client.get(`/customers/${id}`);
  return data.data;
};

export const createCustomer = async (payload) => {
  const { data } = await client.post("/customers", payload);
  return data.data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await client.put(`/customers/${id}`, payload);
  return data.data;
};

export const deleteCustomer = async (id) => {
  const { data } = await client.delete(`/customers/${id}`);
  return data.data;
};
