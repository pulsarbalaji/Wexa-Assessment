import api from "./api/axios";

export const alertService = {

  getAlerts: async () => {

    const response =
      await api.get(
        "/alerts/list/"
      );

    return response.data;
  },

  createAlert: async (
    payload: {
      name: string;
      event_name: string;
      threshold: number;
      time_window: number;
      email: string;
    }
  ) => {

    const response =
      await api.post(
        "/alerts/",
        payload
      );

    return response.data;
  },
};