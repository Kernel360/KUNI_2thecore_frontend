import { create } from 'zustand';

export type Detail = {
  carNumber: string;
  brand: string;
  model: string;
  status: '운행' | '대기' | '수리';
};

type DetailStore = Detail & {
  setDetail: (detail: Detail) => void;
};

export const useDetailStore = create<DetailStore>(set => ({
  carNumber: '',
  brand: '',
  model: '',
  status: '' as '운행' | '대기' | '수리',
  setDetail: detail => set(detail),
}));
