import api from "./api/axios";

export const dashboardService = {

  getDashboardStats:
    async () => {

      const response =
        await api.get(
          "/dashboard/stats/"
        );

      return response.data;
    },

  getEventTrends:
    async () => {

      const response =
        await api.get(
          "/dashboard/line-chart/"
        );

      return response.data;
    },

  getEventDistribution:
    async () => {

      const response =
        await api.get(
          "/dashboard/bar-chart/"
        );

      return response.data;
    },

  getSourceAnalytics:
    async () => {

      const response =
        await api.get(
          "/dashboard/pie-chart/"
        );

      return response.data;
    },

  getDashboards:
    async () => {

      const response =
        await api.get(
          "/dashboard/list/"
        );

      return response.data;
    },
  createDashboard:
    async (
      payload: {
        name: string;
        description: string;
      }
    ) => {

      const response =
        await api.post(
          "/dashboard/",
          payload
        );

      return response.data;
    },
  getDashboardById:
    async (
      id: string
    ) => {

      const response =
        await api.get(
          `/dashboard/${id}/`
        );

      return response.data;
    },

  getDashboardAnalytics:
    async (
      id: string
    ) => {

      const response =
        await api.get(
          `/dashboard/${id}/analytics/`
        );

      return response.data;
    },
};