import { useState } from 'react';
import CarClustererMap from './car-clusterer-map';
import KakaoMapScript from './kakao-map-script';
import styles from './map-modal.module.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'null' | '운행' | '수리' | '대기'
  >('null');

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>
        <KakaoMapScript />
        <CarClustererMap
          width="100%"
          height="100%"
          carStatusFilter={carStatusFilter}
        />
      </div>
    </div>
  );
}
