import { create } from 'zustand';

export type Detail = {
  Number: string;
  brand: string;
  model: string;
  status: '운행중' | '대기중' | '수리중';
};

type DetailStore = Detail & {
  setDetail: (detail: Detail) => void;
};

export const useDetailStore = create<DetailStore>(set => ({
  Number: '',
  brand: '',
  model: '',
  status: '' as '운행중' | '대기중' | '수리중',
  setDetail: detail => set(detail),
}));
