import api from "./api/axios";

export const authService = {
  login: async (
    email: string,
    password: string
  ) => {

    const response =
      await api.post(
        "/auth/login/",
        {
          email,
          password,
        }
      );

    return response.data;
  },

   signup: async (
    payload: {
      company_name: string;
      username: string;
      email: string;
      password: string;
    }
  ) => {

    const response =
      await api.post(
        "/auth/register/",
        payload
      );

    return response.data;
  },

  getProfile: async () => {

    const response =
      await api.get(
        "/auth/profile/"
      );

    return response.data;
  },

  getStoredUser: () => {

    const user =
      localStorage.getItem(
        "user"
      );

    return user
      ? JSON.parse(user)
      : null;
  },

  logout: () => {

  localStorage.clear();

  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  document.cookie =
    "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
},
};