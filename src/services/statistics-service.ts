import axios from 'axios';
import { CarStatistics } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CAR_BASE_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  result: boolean;
  message: string | null;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0IiwiaWF0IjoxNzU0NTI5OTc5LCJleHAiOjE3NTUxMjk5Nzl9.LXgndqqwz1XEAgG45rmgGJN-r2mUHgnRAtaIZ3FscrM`,
  },
});

export class StatisticsService {
  static async getCarStatistics(): Promise<CarStatistics> {
    try {
      const response = await axiosInstance.get('/cars/statistics');

      if (response.data.result) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '차량 통계 조회 실패');
      }
    } catch (error) {
      console.error('차량 통계 API 호출 오류:', error);
      throw error;
    }
  }
}
