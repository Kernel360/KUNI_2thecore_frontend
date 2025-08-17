import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import styles from './menu-box.module.css';

const MenuBox = () => {
  return (
    <div className={'flex justify-start flex-col gap-2 h-full'}>
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
