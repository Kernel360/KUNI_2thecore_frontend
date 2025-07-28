'use client';

import Status from '../status';
import styles from './list-box.module.css';
import ButtonStyles from '../search-filter.module.css';
import { useRouter } from 'next/navigation';
import { useDetailStore } from '@/store/detail-store';
import { setDetailChangeStore } from '@/store/detail-change';
import { Button } from '../../ui/button';

interface ListBoxProps {
  num: string;
  brand: string;
  model: string;
  status: string;
}

const ListBox: React.FC<ListBoxProps> = ({
  num,
  model,
  brand,
  status,
}) => {
  const setDetail = useDetailStore(state => state.setDetail);
  const router = useRouter();

  const handleClick = () => {
    setDetail({
      Number: num,
      brand,
      model,
      status: status as '운행중' | '대기중' | '수리중',
    });
    setDetailChange(false);
    router.push('/detail');
  };

  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);

  const handleButtonClick = () => {
    setDetail({
      Number: num,
      brand,
      model,
      status: status as '운행중' | '대기중' | '수리중',
    });
    setDetailChange(true);
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
          {brand} {model}
        </div>
      </div>
      <div>
        <Button
          onClick={e => {
            e.stopPropagation(); // 이벤트 버블링 방지
            handleButtonClick();
          }}
          className={ButtonStyles.searchButton}
          style={{
            height: '35px',
            backgroundColor: '#3981f3',
            marginRight: '30px',
          }}
        >
          정보 수정
        </Button>
        <Status status={status as '운행중' | '대기중' | '수리중'} />
      </div>
    </div>
  );
};

export default ListBox;
