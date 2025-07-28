import { create } from 'zustand';

type DetailChangeType = false | true;

interface DetailChange {
  detailChange: DetailChangeType;
  setDetailChange: (type: DetailChangeType) => void;
}

export const setDetailChangeStore = create<DetailChange>(set => ({
  detailChange: false, // 기본값을 false로 설정
  setDetailChange: type => set({ detailChange: type }),
}));
