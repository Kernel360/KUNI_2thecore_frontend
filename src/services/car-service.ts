import { mainApi, ApiResponse, PageResponse } from '@/lib/api';

// 차량 기본 정보 타입
export interface Car {
  carNumber: string;
  brand: string;
  model: string;
  status: '운행' | '대기' | '수리';
}

// 차량 상세 정보 타입
export interface CarDetail extends Car {
  gpsLatitude?: number;
  gpsLongitude?: number;
}

// 차량 통계 타입
export interface CarSummary {
  totalCars: number;
  runningCars: number;
  waitingCars: number;
  repairingCars: number;
}

// 차량 검색 필터 요청 타입
export interface CarFilterRequest {
  carNumber?: string;
  brand?: string;
  status?: string[];
}

export class CarService {
  // 모든 차량 조회 (페이징)
  static async getAllCars(
    page: number = 1,
    size: number = 10
  ): Promise<PageResponse<CarDetail>> {
    const response = await mainApi.get<ApiResponse<PageResponse<CarDetail>>>(
      '/cars',
      {
        params: { page, size },
      }
    );
    return response.data.data;
  }

  // 특정 차량 상세 조회
  static async getCar(carNumber: string): Promise<CarDetail> {
    const response = await mainApi.get<ApiResponse<CarDetail>>(
      `/cars/${carNumber}`
    );
    return response.data.data;
  }

  // 차량 통계 조회 (전체/운행/대기/수리)
  static async getCarStatistics(): Promise<CarSummary> {
    const response = await mainApi.get<ApiResponse<CarSummary>>(
      '/cars/statistics'
    );
    return response.data.data;
  }

  // 차량 검색/필터링
  static async searchCars(
    filter: CarFilterRequest,
    page: number = 1,
    size: number = 10
  ): Promise<PageResponse<Car>> {
    const response = await mainApi.get<ApiResponse<PageResponse<Car>>>(
      '/cars/search',
      {
        params: { ...filter, page, offset: size },
      }
    );
    return response.data.data;
  }

  // 특정 상태의 차량들 조회
  static async getCarsByStatus(statuses: string[]): Promise<Car[]> {
    const response = await mainApi.get<ApiResponse<Car[]>>('/cars/status', {
      params: { status: statuses },
    });
    return response.data.data;
  }

  // 차량 등록
  static async createCar(
    carData: Omit<CarDetail, 'gpsLatitude' | 'gpsLongitude'>
  ): Promise<CarDetail> {
    const response = await mainApi.post<ApiResponse<CarDetail>>(
      '/cars',
      carData
    );
    return response.data.data;
  }

  // 차량 정보 수정
  static async updateCar(
    carNumber: string,
    carData: Partial<CarDetail>
  ): Promise<CarDetail> {
    const response = await mainApi.patch<ApiResponse<CarDetail>>(
      `/cars/${carNumber}`,
      carData
    );
    return response.data.data;
  }

  // 차량 삭제
  static async deleteCar(carNumber: string): Promise<{ carNumber: string }> {
    const response = await mainApi.delete<ApiResponse<{ carNumber: string }>>(
      `/cars/${carNumber}`
    );
    return response.data.data;
  }
}
