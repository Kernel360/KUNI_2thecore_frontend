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
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Dropdown({ value, onValueChange }: DropdownProps) {
  const handleValueChange = (newValue: string) => {
    // "all" 값을 빈 문자열로 변환하여 부모 컴포넌트에 전달
    const actualValue = newValue === 'all' ? '' : newValue;
    onValueChange?.(actualValue);
  };

  // 부모에서 받은 빈 문자열을 "all"로 변환
  const displayValue = value === '' ? 'all' : value;

  return (
    <Select value={displayValue} onValueChange={handleValueChange}>
      <SelectTrigger className={`w-[15%] ${styles.dropdownTrigger}`}>
        <SelectValue placeholder="전체 상태" />
      </SelectTrigger>
      <SelectContent
        className={styles.dropdownContent}
        position="popper"
        sideOffset={4}
      >
        <SelectGroup>
          <SelectItem className={styles.dropdownItem} value="all">
            전체 상태
          </SelectItem>
          <SelectItem className={styles.dropdownItem} value="운행">
            운행
          </SelectItem>
          <SelectItem className={styles.dropdownItem} value="대기">
            대기
          </SelectItem>
          <SelectItem className={styles.dropdownItem} value="수리">
            수리
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default Dropdown;
