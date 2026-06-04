import axios from "axios";

const api = axios.create({
  baseURL:
    process.env
      .NEXT_PUBLIC_API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
});

let isRefreshing =
  false;

let isRedirecting =
  false;

let failedQueue:
  {
    resolve: (
      value?: any
    ) => void;
    reject: (
      reason?: any
    ) => void;
  }[] = [];

const processQueue = (
  error: any,
  token:
    | string
    | null = null
) => {

  failedQueue.forEach(
    (promise) => {

      if (error) {

        promise.reject(
          error
        );

      } else {

        promise.resolve(
          token
        );
      }
    }
  );

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (
      token
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(

  (response) =>
    response,

  async (error) => {

    const originalRequest =
      error.config;

    // Token expired
    if (
      error.response?.status ===
        401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry =
        true;

      const refreshToken =
        localStorage.getItem(
          "refresh_token"
        );

      // No refresh token
      if (
        !refreshToken
      ) {

        localStorage.clear();

        if (
          !isRedirecting
        ) {

          isRedirecting =
            true;

          window.location.replace(
            "/login"
          );
        }

        return Promise.reject(
          error
        );
      }

      // Already refreshing
      if (
        isRefreshing
      ) {

        return new Promise(
          (
            resolve,
            reject
          ) => {

            failedQueue.push({
              resolve,
              reject,
            });
          }
        ).then(
          (
            token
          ) => {

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return api(
              originalRequest
            );
          }
        );
      }

      isRefreshing =
        true;

      try {

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`,
            {
              refresh:
                refreshToken,
            }
          );

        const newAccessToken =
          response.data
            .access;

        localStorage.setItem(
          "access_token",
          newAccessToken
        );

        processQueue(
          null,
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(
          originalRequest
        );

      } catch (
        refreshError
      ) {

        processQueue(
          refreshError,
          null
        );

        localStorage.clear();

        if (
          !isRedirecting
        ) {

          isRedirecting =
            true;

          window.location.replace(
            "/login"
          );
        }

        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing =
          false;
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;