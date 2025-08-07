import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/'; // main-server 포트
const EMULATOR_API_BASE_URL = 'http://localhost:8081/'; // emulator-server 포트

// Main API 인스턴스
export const mainApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Emulator API 인스턴스
export const emulatorApi = axios.create({
  baseURL: EMULATOR_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Response 타입
export interface ApiResponse<T> {
  result: string;
  message: string | null;
  data: T;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Car 타입들
export interface Car {
  carNumber: string;
  brand: string;
  model: string;
  status: '운행중' | '대기중' | '수리중';
  gpsLatitude?: number;
  gpsLongitude?: number;
  year?: string;
  mileage?: string;
}

export interface CarDetail extends Car {
  year?: string;
  mileage?: string;
}

export interface CarSummary {
  totalCount: number;
  operatingCount: number;
  waitingCount: number;
  repairCount: number;
}

// Emulator 타입들
export interface Emulator {
  deviceId: string;
  carNumber: string;
  emulatorStatus: 'ON' | 'OFF';
}

// 필터 요청 타입
export interface CarFilterRequest {
  carNumber?: string;
  brand?: string;
  status?: string;
}
