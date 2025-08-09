import { mainApi } from '@/lib/api';
import { ApiResponse, PageResponse } from '@/types/api';
import { Car, CarDetail, CarSummary, CarFilterRequest } from '@/types';

export class CarService {
  // 모든 차량 조회 (페이징)
  static async getAllCars(page: number = 1, size: number = 10): Promise<PageResponse<CarDetail>> {
    const response = await mainApi.get<ApiResponse<PageResponse<CarDetail>>>('/api/cars', {
      params: { page, size }
    });
    return response.data.data;
  }

  // 특정 차량 상세 조회
  static async getCar(carNumber: string): Promise<CarDetail> {
    const response = await mainApi.get<ApiResponse<CarDetail>>(`/api/cars/${carNumber}`);
    return response.data.data;
  }

  // 차량 통계 조회 (전체/운행중/대기중/수리중)
  static async getCarStatistics(): Promise<CarSummary> {
    const response = await mainApi.get<ApiResponse<CarSummary>>('/api/cars/statistics');
    return response.data.data;
  }

  // 차량 검색/필터링
  static async searchCars(
    filter: CarFilterRequest, 
    page: number = 1, 
    size: number = 10
  ): Promise<PageResponse<Car>> {
    const response = await mainApi.get<ApiResponse<PageResponse<Car>>>('/api/cars/search', {
      params: { ...filter, page, offset: size }
    });
    return response.data.data;
  }

  // 특정 상태의 차량들 조회
  static async getCarsByStatus(statuses: string[]): Promise<Car[]> {
    const response = await mainApi.get<ApiResponse<Car[]>>('/api/cars/status', {
      params: { status: statuses }
    });
    return response.data.data;
  }

  // 차량 등록
  static async createCar(carData: Omit<CarDetail, 'gpsLatitude' | 'gpsLongitude'>): Promise<CarDetail> {
    const response = await mainApi.post<ApiResponse<CarDetail>>('/api/cars', carData);
    return response.data.data;
  }

  // 차량 정보 수정
  static async updateCar(carNumber: string, carData: Partial<CarDetail>): Promise<CarDetail> {
    const response = await mainApi.patch<ApiResponse<CarDetail>>(`/api/cars/${carNumber}`, carData);
    return response.data.data;
  }

  // 차량 삭제
  static async deleteCar(carNumber: string): Promise<{ carNumber: string }> {
    const response = await mainApi.delete<ApiResponse<{ carNumber: string }>>(`/api/cars/${carNumber}`);
    return response.data.data;
  }
}