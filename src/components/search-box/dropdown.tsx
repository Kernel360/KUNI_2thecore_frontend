import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Dropdown() {
  return (
    <Select>
      <SelectTrigger
        className="w-[15%]"
        style={{
          height: '44px',
          backgroundColor: 'white',
          marginRight: '2%',
          borderRadius: '6px',
          padding: '0 16px',
          outline: '1.5px solid #bcbcbc',
        }}
      >
        <SelectValue placeholder="전체 상태" className="bg-white" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="z-[100] !absolute !top-auto !left-auto !transform-none !mt-1"
        sideOffset={0}
        style={{
          position: 'absolute',
          zIndex: 9999,
        }}
      >
        <SelectGroup>
          <SelectItem value="null">전체 상태</SelectItem>{' '}
          {/*백엔드로 보낼 때 "null"이 아니라 ""으로 보내야함 */}
          <SelectItem value="IN_USE">운행중</SelectItem>
          <SelectItem value="IDLE">대기중</SelectItem>
          <SelectItem value="MAINTENANCE">점검중</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default Dropdown;
