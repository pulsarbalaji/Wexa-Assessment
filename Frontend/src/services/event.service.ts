import api from "./api/axios";

export const eventService = {

  getEvents:
    async (
      params: {
        page?: number;
        search?: string;
        source?: string;
      }
    ) => {

    const response =
      await api.get(
        "/events/",
        {
          params,
        }
      );

    return response.data;
  },

  createEvent:
    async (
      payload: any
    ) => {

    const response =
      await api.post(
        "/events/create/",
        payload
      );

    return response.data;
  },

  uploadCSV:
    async (
      file: File
    ) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await api.post(
        "/events/upload/",
        formData,
        {
          headers: {
            "Content-Type":
            "multipart/form-data",
          },
        }
      );

    return response.data;
  },
};