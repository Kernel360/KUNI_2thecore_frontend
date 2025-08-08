import { 
  mainApi, 
  ApiResponse, 
  PageResponse, 
  Car, 
  CarDetail, 
  CarSummary, 
  CarFilterRequest,
  CarApiResponse,
  CarCreateRequest,
  CarUpdateRequest
} from '@/lib/api';

export class CarService {
  // 백엔드 응답을 프론트엔드 형식으로 변환
  private static mapApiResponseToCar(apiResponse: CarApiResponse): CarDetail {
    return {
      carNumber: apiResponse.car_number,
      brand: apiResponse.brand,
      model: apiResponse.model,
      status: apiResponse.status as '운행' | '대기' | '점검',
      carYear: apiResponse.car_year,
      carType: apiResponse.car_type,
      sumDist: apiResponse.sum_dist,
      lastLatitude: apiResponse.last_latitude,
      lastLongitude: apiResponse.last_longitude,
    };
  }

  // 모든 차량 조회 (페이징) - 2.4
  static async getAllCars(page: number = 1, size: number = 10): Promise<PageResponse<CarDetail>> {
    const response = await mainApi.get<ApiResponse<PageResponse<CarApiResponse>>>('/api/cars', {
      params: { page, size }
    });
    
    const mappedContent = response.data.data.content.map(this.mapApiResponseToCar);
    return {
      ...response.data.data,
      content: mappedContent
    };
  }

  // 특정 차량 상세 조회 - 2.5
  static async getCar(carNumber: string): Promise<CarDetail> {
    const response = await mainApi.get<ApiResponse<CarApiResponse>>(`/api/cars/${carNumber}`);
    return this.mapApiResponseToCar(response.data.data);
  }

  // 차량 통계 조회 - 2.8
  static async getCarStatistics(): Promise<CarSummary> {
    const response = await mainApi.get<ApiResponse<CarSummary>>('/api/cars/statistics');
    return response.data.data;
  }

  // 차량 검색/필터링 - 2.6
  static async searchCars(
    filter: CarFilterRequest, 
    page: number = 1, 
    offset: number = 10
  ): Promise<PageResponse<Car>> {
    const searchParams = {
      ...filter,
      page,
      offset,
      twoParam: false // API 명세에 따른 기본값
    };
    
    const response = await mainApi.get<ApiResponse<PageResponse<CarApiResponse>>>('/api/cars/search', {
      params: searchParams
    });
    
    const mappedContent = response.data.data.content.map(this.mapApiResponseToCar);
    return {
      ...response.data.data,
      content: mappedContent
    };
  }

  // 특정 상태의 차량들 조회 - 2.7
  static async getCarsByStatus(status: '운행' | '점검' | '대기'): Promise<Car[]> {
    const response = await mainApi.get<ApiResponse<CarApiResponse[]>>('/api/cars/status', {
      params: { status }
    });
    return response.data.data.map(this.mapApiResponseToCar);
  }

  // 차량 등록 - 2.1
  static async createCar(carData: CarCreateRequest): Promise<CarDetail> {
    const response = await mainApi.post<ApiResponse<CarApiResponse>>('/api/cars', carData);
    return this.mapApiResponseToCar(response.data.data);
  }

  // 차량 정보 수정 - 2.2
  static async updateCar(carNumber: string, carData: CarUpdateRequest): Promise<CarDetail> {
    const response = await mainApi.patch<ApiResponse<CarApiResponse>>(`/api/cars/${carNumber}`, carData);
    return this.mapApiResponseToCar(response.data.data);
  }

  // 차량 삭제 - 2.3 (Request body 불필요)
  static async deleteCar(carNumber: string): Promise<{ brand: string; model: string; car_number: string }> {
    const response = await mainApi.delete<ApiResponse<{ brand: string; model: string; car_number: string }>>(`/api/cars/${carNumber}`);
    return response.data.data;
  }
}