import { rtkQueryApi } from "../rtkQueryApi"
import { LoginRequest, RegisterRequest, MaybeTokenResponse, ValidateTokenRequest } from "../types/authorization"

export const authApi = rtkQueryApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<MaybeTokenResponse, LoginRequest>({
      query: (body) => ({
        url: "/Authorization/LoginUser",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data && typeof (data as any).token === "string" && (data as any).token.length) {
            localStorage.setItem("token", (data as any).token)
          } else {
            console.warn("loginUser: сервер не вернул токен в теле ответа")
          }
        } catch (err) {
          console.warn("loginUser failed:", err)
        }
      },
      invalidatesTags: ["User"],
    }),

    registerUser: build.mutation<void, RegisterRequest>({
      query: (body) => ({
        url: "/Authorization/RegisterUser",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getCurrentUserToken: build.query<MaybeTokenResponse, void>({
      query: () => "/Authorization/GetCurrentUserToken",
      providesTags: ["User"],
    }),

    validateToken: build.mutation<void, ValidateTokenRequest>({
      query: (body) => ({
        url: "/Authorization/ValidateToken",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          console.warn("validateToken failed — clearing token", err)
          localStorage.removeItem("token")
        }
      },
    }),

    logoutUser: build.mutation<void, void>({
      query: () => ({
        url: "/Authorization/LogoutUser",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          localStorage.removeItem("token")
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetCurrentUserTokenQuery,
  useValidateTokenMutation,
  useLogoutUserMutation,
} = authApi