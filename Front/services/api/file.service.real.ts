/**
 * File Service - اتصال واقعی به Backend
 */

import { axiosInstance } from './client';
import type {
  FileUploadResponseDto,
  ApiResponse,
} from '../../types/backend.types';

class FileService {
  /**
   * آپلود فایل
   */
  async uploadFile(file: File, type: string = 'general'): Promise<FileUploadResponseDto> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post<ApiResponse<FileUploadResponseDto>>(
        `/files/upload?type=${type}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Upload File Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در آپلود فایل');
    }
  }

  /**
   * آپلود چند فایل
   */
  async uploadMultipleFiles(files: File[], type: string = 'general'): Promise<FileUploadResponseDto[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axiosInstance.post<ApiResponse<FileUploadResponseDto[]>>(
        `/files/upload-multiple?type=${type}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Upload Multiple Files Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در آپلود فایل‌ها');
    }
  }

  /**
   * حذف فایل (Admin)
   */
  async deleteFile(fileName: string, type: string = 'general'): Promise<void> {
    try {
      await axiosInstance.delete(`/files/${fileName}?type=${type}`);
    } catch (error: any) {
      console.error('❌ Delete File Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در حذف فایل');
    }
  }
}

export const fileService = new FileService();
