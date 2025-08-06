import axios from 'axios';

const API_BASE_URL = ''; // 프록시 사용으로 빈 문자열

export interface CarStatistics {
  total: number;
  operating: number;
  waiting: number;
  inspecting: number;
}

export interface ApiResponse<T> {
  result: boolean;
  message: string | null;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class StatisticsService {
  static async getCarStatistics(): Promise<CarStatistics> {
    try {
      const response = await axios.get('/api/cars/statistics');

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
