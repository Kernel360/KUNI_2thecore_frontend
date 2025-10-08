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
import { CarService } from '@/services/car-service';
import { setDetailChangeStore } from '@/store/detail-change';
import { useDetailStore } from '@/store/detail-store';
import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Status from '../status';
import styles from './list-box.module.css';

interface ListBoxProps {
  carNumber: string;
  brand: string;
  model: string;
  status: string;
  onDelete?: (carNumber: string) => void; // 삭제 성공 시 부모 컴포넌트에 알림
}

const allowedStatus = ['운행', '대기', '수리'] as const;
type StatusType = (typeof allowedStatus)[number];

const ListBox = forwardRef<HTMLDivElement, ListBoxProps>(
  ({ carNumber, model, brand, status, onDelete }, ref) => {
    const setDetail = useDetailStore(state => state.setDetail);
    const navigate = useNavigate();
    const setDetailChange = setDetailChangeStore(
      state => state.setDetailChange
    );

    // 삭제 관련 상태
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const safeStatus: StatusType = allowedStatus.includes(status as StatusType)
      ? (status as StatusType)
      : '대기';

    const handleClick = () => {
      setDetail({
        carNumber: carNumber,
        brand,
        model,
        brandModel: `${brand} ${model}`,
        status: safeStatus,
      });
      setDetailChange(false);
      navigate(`/detail?carNumber=${encodeURIComponent(carNumber)}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setDetail({
        carNumber: carNumber,
        brand,
        model,
        brandModel: `${brand} ${model}`,
        status: safeStatus,
      });
      setDetailChange(true);
      navigate(`/detail?carNumber=${encodeURIComponent(carNumber)}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        setIsDeleting(true);
        setDeleteError(null);

        // 백엔드 API 호출 - CarService의 deleteCar 메서드 사용
        await CarService.deleteCar(carNumber);

        // 삭제 성공 시 부모 컴포넌트에 알림
        if (onDelete) {
          onDelete(carNumber);
        }
      } catch (error) {
        console.error('차량 삭제 실패:', error);
        setDeleteError('차량 삭제에 실패했습니다.');
      } finally {
        setIsDeleting(false);
      }
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
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return (
      <div
        ref={ref}
        className={`${styles.container} cursor-pointer`}
        onClick={handleClick}
      >
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
  }
);

ListBox.displayName = 'ListBox';

export default ListBox;
