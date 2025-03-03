import { api } from "../api";

const userSlice = api.injectEndpoints({
    endpoints: (builder) => ({

        registerUser: builder.mutation({
            query: (userData) => ({
                url:"/user/register",
                method: "POST",
                body: userData,
              }),
              invalidatesTags: ["user"],
        }),
        loginUser: builder.mutation({
            query: (userData) => ({
                url:"/user/login",
                method: "POST",
                body: userData,
                invalidatesTags: ["user"],
            }),
        }),
        getUserRole: builder.query({
            query: (token)=> ({
                url: `/admin/userRole`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["user"],
        }),
        getAllUser: builder.query({
            query: (token)=> ({
                url: `/admin/allUsers`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["user"],
        }),

        getSingleUser: builder.query({
            query: (token)=> ({
                url: `/user/single/profile`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["user"],
        }),

        getUserInfo: builder.query({
            query: (token)=> ({
                url: `/user/UserInfo`,
                method:"GET",
                headers: {
                'Content-Type': 'application/json',  
                'Authorization' : `Bearer ${token}`,
            },
            }),
            providesTags:["user"],
        }),
        accessChangeUser: builder.mutation({
            query: ({token, userId }) => ({
                url:"/admin/user/access/change",
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',  
                    'Authorization' : `Bearer ${token}`,
                },
                body: {
                    userId,
                },
            }),
            invalidatesTags: ["user"],
          }),

          updateUserProfile: builder.mutation({
            query: ({token, profileData }) => ({
                url:"/user/update/profile",
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',  
                    'Authorization' : `Bearer ${token}`,
                },
                body: {
                    profileData,
                },
            }),
            invalidatesTags: ["user"],
          }),
    }),  
  });
  
  export const { useRegisterUserMutation, useLoginUserMutation, useGetUserRoleQuery, useGetAllUserQuery, useAccessChangeUserMutation, useGetUserInfoQuery, useGetSingleUserQuery, useUpdateUserProfileMutation } = userSlice;
  export default userSlice;