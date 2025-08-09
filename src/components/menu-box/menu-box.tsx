import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import styles from './menu-box.module.css';

interface MenuBoxProps {
  onOpenMapModal: () => void;
}

const MenuBox = ({ onOpenMapModal }: MenuBoxProps) => {
  return (
    <div className={'flex justify-start flex-col gap-2 h-full'}>
      <Button className={styles.Button} onClick={onOpenMapModal}>
        🗺️ 지도 전체 화면
      </Button>
      <Link to="/search">
        <Button className={styles.Button}>🚗 차량 검색</Button>
      </Link>
      <Link to="/history">
        <Button className={styles.Button}>📊 주행 기록</Button>
      </Link>
    </div>
  );
};

export default MenuBox;
