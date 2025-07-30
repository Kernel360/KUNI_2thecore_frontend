import { create } from 'zustand';

export type Detail = {
  carNumber: string;
  brand: string;
  model: string;
  status: '운행중' | '대기중' | '수리중';
  location: string;
};

type DetailStore = Detail & {
  setDetail: (detail: Detail) => void;
};

export const useDetailStore = create<DetailStore>(set => ({
  carNumber: '',
  brand: '',
  model: '',
  status: '' as '운행중' | '대기중' | '수리중',
  location: '',
  setDetail: detail => set(detail),
}));
