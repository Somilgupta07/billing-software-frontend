import client from "./client";

export const getBills = async () => {
  const { data } = await client.get("/bills");
  return data.data;
};

export const getBill = async (id) => {
  const { data } = await client.get(`/bills/${id}`);
  return data.data;
};

export const createBill = async (payload) => {
  const { data } = await client.post("/bills", payload);
  return data.data;
};
