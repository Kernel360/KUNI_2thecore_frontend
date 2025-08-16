import { CarDetail } from '@/services/car-service';
import { create } from 'zustand';

type DetailStore = CarDetail & {
  setDetail: (detail: CarDetail) => void;
};

export const useDetailStore = create<DetailStore>(set => ({
  carNumber: '',
  brand: '',
  model: '',
  brandModel: '',
  status: '' as '운행' | '대기' | '수리',
  lastLatitude: '',
  lastLongitude: '',
  carYear: 0,
  sumDist: 0,
  carType: '',
  setDetail: detail => set(detail),
}));
