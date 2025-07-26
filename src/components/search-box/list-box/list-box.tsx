'use client';

import Status from '../status';
import styles from './list-box.module.css';
import { useRouter } from 'next/navigation';
import { useCarDetailStore } from '@/store/detail-store';

interface ListBoxProps {
  num: string;
  brand: string;
  model: string;
  location: string;
  status: string;
}

const ListBox: React.FC<ListBoxProps> = ({
  num,
  model,
  brand,
  location,
  status,
}) => {
  const setCarDetail = useCarDetailStore(state => state.setCarDetail);
  const router = useRouter();

  const handleClick = () => {
    setCarDetail({
      carNumber: num,
      brand,
      model,
      status: status as '운행중' | '대기중' | '수리중',
      location,
    });
    router.push('/detail');
  };

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.info}>
        <div className={styles.num}>{num}</div>
        <div className={styles.texts}>
          {brand} {model} {location}
        </div>
      </div>
      <Status status={status as '운행중' | '대기중' | '수리중'} />
    </div>
  );
};

export default ListBox;
