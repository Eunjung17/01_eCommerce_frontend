import { api } from "../api";

const productSlice = api.injectEndpoints({
    endpoints: (builder) => ({

        getAllProduct: builder.query({
            query: (token)=> ({
                url: `/business/allProducts`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["product"],
        }),

        getAllDeletedProduct: builder.query({
          query: (token)=> ({
              url: `/business/allDeletedProducts`,
              method:"GET",
              headers: {
              'Content-Type': 'application/json',  
              'Authorization' : `Bearer ${token}`,
          },
          }),
          providesTags:["product"],
      }),


        getTop4Product: builder.query({
            query: ()=> ({
                url: `/top4Products`,
                method:"GET",
            //     headers: {
            //     'Content-Type': 'application/json',  
            //     'Authorization' : `Bearer ${token}`,
            // },
            }),
            providesTags:["product"],
        }),

        productFromCategory: builder.mutation({
            query: ({categoryDetailId }) => ({
                url:"/category/product",
                method: "POST",
                body: {
                    categoryDetailId,
                },
            }),
            invalidatesTags: ["product"],
          }),

          
        deleteProduct: builder.mutation({
          query: ({token, productId }) => ({
              url:"/business/delete/product",
              method: "PUT",
              headers: {
              'Content-Type': 'application/json',  
              'Authorization' : `Bearer ${token}`,
              },
              body: {
                productId,
              }, 
          }),
          invalidatesTags: ["product"],
        }),

        recoveryProduct: builder.mutation({
          query: ({token, id }) => ({
              url:"/business/recovery/product",
              method: "PUT",
              headers: {
              'Content-Type': 'application/json',  
              'Authorization' : `Bearer ${token}`,
              },
              body: {
                id,
              }, 
          }),
          invalidatesTags: ["product"],
        }),


          productFromKeyword: builder.mutation({
            query: ({searchKeyword}) => {

                return {
                  url:"/keyword/product",
                  method: "POST",
                  body: { searchKeyword},
                };

            },
            invalidatesTags: ["product"],
          }),



          singleProduct: builder.mutation({
            query: ({ token, productId }) => {

              return {
                url: "/user/singleProduct",
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: { productId },
              };
            },
            invalidatesTags: ["product"],
          }),

          registerProduct: builder.mutation({
            query: ({ token, productData }) => {
              return {
                url: "/business/register/product",
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: { productData },
              };
            },
            invalidatesTags: ["product"],
          }),

    }),  
  });

  
  export const { useGetAllProductQuery, useGetTop4ProductQuery, useProductFromCategoryMutation, useSingleProductMutation, useProductFromKeywordMutation, useDeleteProductMutation, useGetAllDeletedProductQuery, useRecoveryProductMutation, useRegisterProductMutation } = productSlice;
  export default productSlice;