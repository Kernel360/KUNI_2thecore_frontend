'use client';

import IconButton from '@/components/icon-button/icon-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { setDetailChangeStore } from '@/store/detail-change';
import { useDetailStore } from '@/store/detail-store';
import { useRouter } from 'next/navigation';
import Status from '../status';
import styles from './list-box.module.css';

interface ListBoxProps {
  carNumber: string;
  brand: string;
  model: string;
  status: string;
}

const allowedStatus = ['운행중', '대기중', '수리중'] as const;
type StatusType = (typeof allowedStatus)[number];

const ListBox: React.FC<ListBoxProps> = ({
  carNumber,
  model,
  brand,
  status,
}) => {
  const setDetail = useDetailStore(state => state.setDetail);
  const router = useRouter();
  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);

  const safeStatus: StatusType = allowedStatus.includes(status as StatusType)
    ? (status as StatusType)
    : '대기중';

  const handleClick = () => {
    setDetail({
      carNumber: carNumber,
      brand,
      model,
      status: safeStatus,
    });
    setDetailChange(false);
    router.push('/detail');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetail({
      carNumber: carNumber,
      brand,
      model,
      status: safeStatus,
    });
    setDetailChange(true);
    router.push('/detail');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`삭제됨: ${carNumber}`);
  };

  function AlertDialogDemo() {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <IconButton iconType="delete" onClick={e => e.stopPropagation()} />
        </AlertDialogTrigger>
        <AlertDialogContent className={styles.alertDialog}>
          <AlertDialogHeader>
            <AlertDialogTitle className={styles.alertTitle}>
              정말 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription className={styles.alertDescription}>
              삭제 후에는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={styles.alertFooter}>
            <AlertDialogCancel
              className={styles.alertButton}
              onClick={e => e.stopPropagation()}
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className={styles.alertButton}
              onClick={handleDelete}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className={`${styles.container} cursor-pointer`} onClick={handleClick}>
      <div className={styles.info}>
        <div className={styles.num}>{carNumber}</div>
        <div className={styles.texts}>
          {brand} {model}
        </div>
      </div>
      <div>
        <IconButton iconType="edit" onClick={handleEdit} />
        <AlertDialogDemo />
        <Status status={safeStatus} />
      </div>
    </div>
  );
};

export default ListBox;
