import api from "./api/axios";

export const reportService = {

  getReports:
    async () => {

      const response =
        await api.get(
          "/reports/list/"
        );

      return response.data;
    },

  createReport:
    async (
      payload: {
        dashboard: number;
        frequency: string;
        recipient_email: string;
      }
    ) => {

      const response =
        await api.post(
          "/reports/",
          payload
        );

      return response.data;
    },
  runReport:
    async (
      reportId: string | number
    ) => {

      const response =
        await api.post(
          `/reports/${reportId}/run/`
        );

      return response.data;
    },

  deleteReport:
    async (
      reportId: string | number
    ) => {

      const response =
        await api.delete(
          `/reports/${reportId}/delete/`
        );

      return response.data;
    },
  getDownloadHistory:
    async () => {

      const response =
        await api.get(
          "/reports/history/"
        );

      return response.data;
    },
};