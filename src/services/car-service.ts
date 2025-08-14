import { ApiResponse, mainApi, PageResponse } from '@/lib/api';

// 차량 기본 정보 타입
export interface Car {
  carNumber: string;
  brand: string;
  model: string;
  brandModel: string;
  status: '운행' | '대기' | '수리';
}

// 차량 상세 정보 타입
export interface CarDetail extends Car {
  latitude?: number;
  longtitude?: number;
  carYear?: number;
  sumDist?: number;
  carType?: string;
}

// 차량 통계 타입
export interface CarSummary {
  total: number;
  driving: number;
  idle: number;
  maintenance: number;
}

// 차량 검색 필터 요청 타입 (백엔드 API 2.6 명세에 정확히 맞게 수정)
export interface CarSearchParams {
  carNumber?: string; // 차량 번호
  model?: string; // 차량 모델
  brand?: string; // 차량 브랜드
  status?: string; // 차량 상태 ("운행", "대기", "수리")
  twoParam?: boolean; // 브랜드 + 모델명 길이 체크
  page?: number; // 페이지 번호
  offset?: number; // 페이지당 데이터 수
}

export class CarService {
  // 모든 차량 조회 (페이징)
  static async getAllCars(
    page: number = 1,
    size: number = 10
  ): Promise<PageResponse<CarDetail>> {
    const response = await mainApi.get<ApiResponse<PageResponse<CarDetail>>>(
      '/cars/search',
      {
        params: { page, size },
      }
    );
    return response.data.data;
  }

  // 특정 차량 상세 조회
  static async getCar(carNumber: string): Promise<CarDetail> {
    const response = await mainApi.get(`/cars/${carNumber}`);
    return response.data.data;
  }

  // 차량 통계 조회 (전체/운행/대기/수리)
  static async getCarStatistics(): Promise<CarSummary> {
    const response =
      await mainApi.get<ApiResponse<CarSummary>>('/cars/statistics');
    return response.data.data;
  }

  // 차량 검색/필터링 (백엔드 API 2.6 명세에 정확히 맞게 수정)
  static async searchCars(
    params: CarSearchParams,
    page: number = 1,
    offset: number = 10
  ): Promise<PageResponse<Car>> {
    // 백엔드 API 명세에 맞게 파라미터 구성
    const searchParams: CarSearchParams = {
      ...params,
      page,
      offset,
    };

    const response = await mainApi.get<ApiResponse<PageResponse<Car>>>(
      '/cars/search',
      {
        params: searchParams,
      }
    );
    return response.data.data;
  }

  // 특정 상태의 차량들 조회
  static async getCarsByStatus(statuses: string[]): Promise<Car[]> {
    const response = await mainApi.get<ApiResponse<Car[]>>('/cars/search', {
      params: { status: statuses },
    });
    return response.data.data;
  }

  // 차량 등록
  static async createCar(
    carData: Omit<
      CarDetail,
      'latitude' | 'longtitude' | 'status' | 'brandModel'
    >
  ): Promise<CarDetail> {
    const response = await mainApi.post('/cars', {
      ...carData,
      loginId: localStorage.getItem('loginId'),
    });
    return response.data.data;
  }

  // 차량 정보 수정
  static async updateCar(
    carNumber: string,
    carData: Partial<CarDetail>
  ): Promise<CarDetail> {
    const response = await mainApi.patch(`/cars/${carNumber}`, carData);
    return response.data.data;
  }

  // 차량 삭제
  static async deleteCar(carNumber: string): Promise<{ carNumber: string }> {
    const response = await mainApi.delete<ApiResponse<{ carNumber: string }>>(
      `/cars/${carNumber}`
    );
    return response.data.data;
  }

  // 차량 위치 데이터 배치 전송
  static async sendCarLocationsBatch(
    locationData: Array<{
      carNumber: string;
      coordinates: Array<{ latitude: number; longtitude: number }>;
    }>
  ): Promise<void> {
    const requestData = locationData.map(car => ({
      carNumber: car.carNumber,
      coordinates: car.coordinates.map(coord => ({
        latitude: coord.latitude,
        longtitude: coord.longtitude,
      })),
    }));

    await mainApi.post('/cars/locations/batch', requestData);
  }

  // 실시간 차량 위치 데이터 조회
  static async getCarLocations(): Promise<
    Array<{
      carNumber: string;
      latitude: number;
      longtitude: number;
      timestamp?: string;
    }>
  > {
    const response = await mainApi.get<
      ApiResponse<
        Array<{
          carNumber: string;
          latitude: number;
          longtitude: number;
          timestamp?: string;
        }>
      >
    >('/cars/locations');
    return response.data.data;
  }
}
