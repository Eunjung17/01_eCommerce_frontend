import { api } from "../api";

const orderSlice = api.injectEndpoints({
    endpoints: (builder) => ({

        getPaymentMethod: builder.query({
            query: (token)=> ({
                url: `/paymentMethod/all`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["order"],
        }),

        getOrderHistory: builder.query({
            query: (token)=> ({
                url: `/user/orderHistory`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["order"],
        }),

        registerOrderFromCart: builder.mutation({
            query: ({ token, orderData }) => ({
                url: "/user/registerOrderFromCart",
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: { orderData },
              }),
              invalidatesTags: ["order"],
        }),

      registerSingleOrder: builder.mutation({
        query: ({ token, orderData }) => {

          return {
            url: "/user/register/singleOrder",
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: { orderData },
          };
        },
        invalidatesTags: ["order"], 
      }),


      orderDetails: builder.mutation({
            query: ({token, orderId}) => {

              return {
                url: "/user/orderDetail",
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: { orderId },
              };
            },
            invalidatesTags: ["order"],
        }),

    }),  
  });
  
  export const { useGetPaymentMethodQuery, useGetOrderHistoryQuery , useRegisterOrderFromCartMutation, useRegisterSingleOrderMutation, useOrderDetailsMutation } = orderSlice;
  export default orderSlice;