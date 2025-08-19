import iconStyles from '@/components/icon-button/icon-button.module.css';
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
    'total' | 'driving' | 'maintenance' | 'idle'
  >('total');

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={iconStyles.closeScreen} />
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
