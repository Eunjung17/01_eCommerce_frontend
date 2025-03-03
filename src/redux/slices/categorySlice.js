import { api } from "../api";

const categorySlice = api.injectEndpoints({
    endpoints: (builder) => ({

        getCategoryAll: builder.query({
            query: ()=> ({
                url: `/category/all`,
                method:"GET",
            //     headers: {
            //     'Content-Type': 'application/json',  
            //     'Authorization' : `Bearer ${token}`,
            // },
            }),
            providesTags:["category"],
        }),

    }),  
  });
  
  export const { useGetCategoryAllQuery } = categorySlice;
  export default categorySlice;