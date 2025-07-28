'use client';

import Status from '../status';
import styles from './list-box.module.css';
import ButtonStyles from '../search-filter.module.css';
import { useRouter } from 'next/navigation';
import { useDetailStore } from '@/store/detail-store';
import { setDetailChangeStore } from '@/store/detail-change';
import IconButton from '@/components/icon-button/icon-button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

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
  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);

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
    alert(`삭제됨: ${num}`);
  };

  function AlertDialogDemo() {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <IconButton iconType="delete" onClick={e => e.stopPropagation()} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
            삭제 후에는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

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
        <IconButton iconType="edit" onClick={handleEdit} />
        <AlertDialogDemo />
        <Status status={status as '운행중' | '대기중' | '수리중'} />
      </div>
    </div>
  );
};

export default ListBox;
