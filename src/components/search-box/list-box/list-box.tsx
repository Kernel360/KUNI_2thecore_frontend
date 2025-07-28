'use client';

import Status from '../status';
import styles from './list-box.module.css';
import ButtonStyles from '../search-filter.module.css';
import { useRouter } from 'next/navigation';
import { useDetailStore } from '@/store/detail-store';
import { setDetailChangeStore } from '@/store/detail-change';
import { Button } from '../../ui/button';
import IconButton from '@/components/icon-button/icon-button';

interface ListBoxProps {
  num: string;
  brand: string;
  model: string;
  status: string;
}

const ListBox: React.FC<ListBoxProps> = ({ num, model, brand, status }) => {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setDetail({
      Number: num,
      brand,
      model,
      status: status as '운행중' | '대기중' | '수리중',
    });
    setDetailChange(true);
    router.push('/detail');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    // if (confirm('정말 삭제하시겠습니까?')) {
    //   console.log('삭제:', num);
    // }
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
        <IconButton iconType="edit" onClick={e => handleEdit(e)} />
        <IconButton iconType="delete" onClick={e => handleDelete(e)} />
        <Status status={status as '운행중' | '대기중' | '수리중'} />
      </div>
    </div>
  );
};

export default ListBox;
