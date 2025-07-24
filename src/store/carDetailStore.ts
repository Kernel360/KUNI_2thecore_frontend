import { create } from 'zustand';

export type CarDetail = {
  car_number: string;
  brand: string;
  model: string;
  status: '운행중' | '대기중' | '수리중';
  location: string;
};

type CarDetailStore = CarDetail & {
  setCarDetail: (detail: CarDetail) => void;
};

export const useCarDetailStore = create<CarDetailStore>((set) => ({
  car_number: '',
  brand: '',
  model: '',
  status: '' as '운행중' | '대기중' | '수리중',
  location: '',
  setCarDetail: (detail) => set(detail),
})); 