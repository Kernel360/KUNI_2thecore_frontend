import { emulatorApi, ApiResponse, PageResponse, Emulator } from '@/lib/api';

// 에뮬레이터 요청 타입
export interface EmulatorRequest {
  carNumber: string;
  emulatorStatus: 'ON' | 'OFF';
}

// 커스텀 페이지 응답 타입
export interface CustomPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export class EmulatorService {
  // 에뮬레이터 등록
  static async registerEmulator(emulatorData: EmulatorRequest): Promise<Emulator> {
    const response = await emulatorApi.post<ApiResponse<Emulator>>('/api/emulators', emulatorData);
    return response.data.data;
  }

  // 모든 에뮬레이터 조회 (페이징)
  static async getAllEmulators(page: number = 0, size: number = 10): Promise<CustomPageResponse<Emulator>> {
    const response = await emulatorApi.get<ApiResponse<CustomPageResponse<Emulator>>>('/api/emulators', {
      params: { page, size, sort: 'id,desc' }
    });
    return response.data.data;
  }

  // 특정 에뮬레이터 조회
  static async getEmulator(deviceId: string): Promise<Emulator> {
    const response = await emulatorApi.get<ApiResponse<Emulator>>(`/api/emulators/${deviceId}`);
    return response.data.data;
  }

  // 에뮬레이터 수정
  static async updateEmulator(deviceId: string, emulatorData: EmulatorRequest): Promise<Emulator> {
    const response = await emulatorApi.patch<ApiResponse<Emulator>>(`/api/emulators/${deviceId}`, emulatorData);
    return response.data.data;
  }

  // 에뮬레이터 삭제
  static async deleteEmulator(deviceId: string): Promise<{ deviceId: string }> {
    const response = await emulatorApi.delete<ApiResponse<{ deviceId: string }>>(`/api/emulators/${deviceId}`);
    return response.data.data;
  }
}