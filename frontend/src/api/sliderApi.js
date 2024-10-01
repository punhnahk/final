import apiClient from "./apiClient";

const sliderApi = {
  getSliders: () => {
    return apiClient.get("/sliders");
  },
  addSlider: (data) => {
    return apiClient.post("/sliders", data);
  },
  getSlider: (id) => {
    return apiClient.get(`/sliders/${id}`);
  },
  updateSlider: ({ id, ...data }) => {
    return apiClient.put(`/sliders/${id}`, data);
  },
  deleteSlider: (id) => {
    return apiClient.delete(`/sliders/${id}`);
  },
};

export default sliderApi;
