import { emulatorApi } from '@/lib/api';

export interface Car {
  carNumber: string;
  brand: string;
  model: string;
  brandModel: string;
  status: '운행' | '대기' | '수리';
  powerStatus?: string; // "ON" or "OFF"
}

// 차량 상세 정보 타입
export interface CarDetail extends Car {
  carYear?: number;
  sumDist?: number;
  carType?: string;
  lastLatitude?: string;
  lastLongitude?: string;
  loginId?: string;
}

export class EmulService {
  // 에뮬레이터에서 차량 시동 on/off
  static async powerCar(carData?: Partial<CarDetail>): Promise<CarDetail> {
    const response = await emulatorApi.post('/logs/power', carData);
    return response.data.data;
  }
}
