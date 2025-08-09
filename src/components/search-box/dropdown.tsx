import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from './dropdown.module.css';

export function Dropdown() {
  return (
    <Select>
      <SelectTrigger className={`w-[15%] ${styles.dropdownTrigger}`}>
        <SelectValue placeholder="전체 상태" />
      </SelectTrigger>
      <SelectContent className={styles.dropdownContent} position="popper" sideOffset={4}>
        <SelectGroup>
          <SelectItem className={styles.dropdownItem} value="null">전체 상태</SelectItem>
          <SelectItem className={styles.dropdownItem} value="DRIVING">운행중</SelectItem>
          <SelectItem className={styles.dropdownItem} value="IDLE">대기중</SelectItem>
          <SelectItem className={styles.dropdownItem} value="MAINTENANCE">점검중</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default Dropdown;
