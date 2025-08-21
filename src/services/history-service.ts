import { ApiResponse, mainApi, PageResponse } from '@/lib/api';

// API 쿼리 파라미터 타입 (API 스펙 기반)
export interface DriveLogQueryParams {
  carNumber?: string; // 차량 번호
  status?: string; // 차량 상태 (ex: 운행, 대기, 수리)
  brand?: string; // 브랜드명
  model?: string; // 모델명
  startTime?: Date; // 주행 시작 날짜 ("2025-08-15")
  endTime?: Date; // 주행 종료 날짜 ("2025-08-16")
  twoParam?: boolean; // 브랜드 + 모델명 길이가 2가 아닌 경우 false
  // 대신 길이가 0인 경우는 true
  page?: number;
  offset?: number;
  sortBy?: string; // 정렬 기준 (carNumber, startTime, endTime, brand, model, startPoint, endPoint, driveDist, status)
  sortOrder?: 'ASC' | 'DESC'; // 정렬 방향 (기본값: ASC)
}

// 주행 기록 응답 데이터 타입
export interface DriveLog {
  carNumber: string;
  model: string;
  brand: string;
  startTime: string;
  endTime: string;
  startPoint: string;
  endPoint: string;
  driveDist: number;
  status: string;
}

export class HistoryService {
  // 차량 주행 기록 조회 (GET /drivelogs)
  static async getDriveLogs(
    params?: DriveLogQueryParams,
    page: number = 1,
    offset: number = 10
  ): Promise<PageResponse<DriveLog>> {
    // Date 객체를 LocalDate 형식 문자열(YYYY-MM-DD)로 변환하여 쿼리 파라미터에 포함
    const queryParams = new URLSearchParams();
    
    if (params?.carNumber) queryParams.set('carNumber', params.carNumber);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.brand) queryParams.set('brand', params.brand);
    if (params?.model) queryParams.set('model', params.model);
    if (params?.startTime) {
      queryParams.set('startTime', params.startTime.toISOString().split('T')[0]);
    }
    if (params?.endTime) {
      queryParams.set('endTime', params.endTime.toISOString().split('T')[0]);
    }
    queryParams.set('twoParam', String(params?.twoParam !== undefined ? params.twoParam : true));
    
    queryParams.set('page', String(page));
    queryParams.set('offset', String(offset));
    queryParams.set('sortBy', params?.sortBy || 'startTime');
    queryParams.set('sortOrder', params?.sortOrder || 'ASC');

    const response = await mainApi.get<ApiResponse<PageResponse<DriveLog>>>(
      `/drivelogs?${queryParams.toString()}`
    );
    return response.data.data;
  }
}
