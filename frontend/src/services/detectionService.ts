import api from './api';

export const detectionService = {
  detect: async (imageFile: File, sessionId: number | string) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('sessionId', sessionId.toString());

    const response = await api.post('/detection/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
