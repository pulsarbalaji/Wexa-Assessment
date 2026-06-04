import api from "./api/axios";

export const settingsService = {

  // ==========================
  // PROFILE
  // ==========================

  getProfile:
    async () => {

      const response =
        await api.get(
          "/auth/profile/"
        );

      return response.data;
    },

  updateProfile:
    async (
      payload: {
        full_name?: string;
        username?: string;
        email?: string;
      }
    ) => {

      const response =
        await api.patch(
          "/auth/profile/",
          payload
        );

      return response.data;
    },

  // ==========================
  // ORGANIZATION
  // ==========================

  getOrganization:
    async () => {

      const response =
        await api.get(
          "/organization/"
        );

      return response.data;
    },

  updateOrganization:
    async (
      payload: {
        name?: string;
      }
    ) => {

      const response =
        await api.patch(
          "/organization/",
          payload
        );

      return response.data;
    },

  // ==========================
  // API KEYS
  // ==========================

  getApiKeys:
    async () => {

      const response =
        await api.get(
          "/events/apikey/"
        );

      return response.data;
    },

  createApiKey:
    async (
      payload: {
        name: string;
      }
    ) => {

      const response =
        await api.post(
          "/events/apikey/generate/",
          payload
        );

      return response.data;
    },

  revokeApiKey:
    async (
      keyId: number
    ) => {

      const response =
        await api.delete(
          `/events/apikey/revoke/${keyId}/`
        );

      return response.data;
    },

  rotateApiKey:
    async (
      keyId: number
    ) => {

      const response =
        await api.post(
          `/events/apikey/rotate/${keyId}/`
        );

      return response.data;
    },

  // ==========================
  // SECURITY
  // ==========================

  changePassword:
    async (
      payload: {
        current_password: string;
        new_password: string;
      }
    ) => {

      const response =
        await api.post(
          "/auth/change-password/",
          payload
        );

      return response.data;
    },

  // ==========================
  // SESSIONS (OPTIONAL)
  // ==========================

  getSessions:
    async () => {

      const response =
        await api.get(
          "/auth/sessions/"
        );

      return response.data;
    },

  revokeSession:
    async (
      sessionId: number
    ) => {

      const response =
        await api.delete(
          `/auth/sessions/${sessionId}/`
        );

      return response.data;
    },
};