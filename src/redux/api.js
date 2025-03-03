import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
     //baseUrl: "http://localhost:3000/",
    baseUrl: "https://zero1-ecommerce-site.onrender.com",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ["user", "category", "product", "cart", "order"],
  endpoints: () => ({}),
});