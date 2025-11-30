import { axiosInstance } from './client';
import { FileUploadResponse } from './dtos';

export const fileService = {
  async uploadFile(file: File, category: 'driver' | 'order' | 'other' = 'other'): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await axiosInstance.post<{ success: boolean; data: FileUploadResponse }>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  async uploadMultipleFiles(files: File[], category: 'driver' | 'order' | 'other' = 'other'): Promise<FileUploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('category', category);

    const response = await axiosInstance.post<{ success: boolean; data: FileUploadResponse[] }>('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },
};
