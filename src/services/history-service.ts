import { ApiResponse, mainApi } from '@/lib/api';

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
  // 차량 주행 기록 조회 (GET /logs)
  static async getDriveLogs(params?: DriveLogQueryParams): Promise<DriveLog[]> {
    const response = await mainApi.get<ApiResponse<DriveLog[]>>('/logs', {
      params,
    });
    return response.data.data;
  }
}
