import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from './dropdown.module.css';

interface DropdownProps {
  onValueChange?: (value: string) => void;
}

export function Dropdown({ onValueChange }: DropdownProps) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className={`w-[15%] ${styles.dropdownTrigger}`}>
        <SelectValue placeholder="전체 상태" />
      </SelectTrigger>
      <SelectContent className={styles.dropdownContent} position="popper" sideOffset={4}>
        <SelectGroup>
          <SelectItem className={styles.dropdownItem} value="null">전체 상태</SelectItem>
          <SelectItem className={styles.dropdownItem} value="운행">운행</SelectItem>
          <SelectItem className={styles.dropdownItem} value="대기">대기</SelectItem>
          <SelectItem className={styles.dropdownItem} value="점검">점검</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default Dropdown;
