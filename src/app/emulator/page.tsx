import NumberSearchBox from '@/components/search-box/number-search-box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TopBar from '@/components/ui/topBar';
import { useEffect, useState } from 'react';
import styles from './emulator.module.css';

const handleDelete = async (deviceId: string) => {
  if (!confirm('정말로 이 에뮬레이터를 삭제하시겠습니까?')) {
    return;
  }

  try {
    // await EmulatorService.deleteEmulator(deviceId);
    // alert('에뮬레이터가 삭제되었습니다.');
    // // 페이지 리로드 또는 상태 업데이트
    // window.location.reload();
  } catch (error) {
    console.error('에뮬레이터 삭제 실패:', error);
    alert('에뮬레이터 삭제 중 오류가 발생했습니다.');
  }
};

const EmulSearchBox = () => {
  return (
    <div className={styles.emulSearch}>
      <NumberSearchBox />
      <div className={styles.filterContainer}>
        <Input
          type="text"
          placeholder="새 에뮬레이터를 등록하려면 차량 번호를 이곳에 입력해주세요. (예: 11가 1111)"
          className={styles.searchContainer}
        />
        <Button className={styles.searchButton}>등록</Button>
      </div>
    </div>
  );
};

export default function LocalEmulator() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmulators = async () => {
      try {
        // const emulatorData = await EmulatorService.getAllEmulators(0, 100);
        // setEmulators(emulatorData.content);
      } catch (error) {
        console.error('에뮬레이터 목록 조회 실패:', error);
        // 에러 발생 시 더미 데이터 사용
      } finally {
        setLoading(false);
      }
    };

    fetchEmulators();
  }, []);

  const CarEmulNumberSearchBox = () => {
    return (
      <div className={styles.emulSearch}>
        <NumberSearchBox />
        <div className={styles.filterContainer}>
          <Input
            type="text"
            placeholder="새 에뮬레이터를 등록하려면 차량 번호를 이곳에 입력해주세요. (예: 11가 1111)"
            className={styles.searchContainer}
          />
          <Button className={styles.searchButton}>등록</Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <TopBar title="에뮬레이터"></TopBar>
      <EmulSearchBox />
      <Table className={styles.emulatorTable}>
        <TableHeader className={styles.tableHeader}>
          <TableRow>
            <TableHead className={styles.tableCellSmall}></TableHead>
            <TableHead className={styles.tableCell}>차량번호</TableHead>
            <TableHead className={styles.tableCell}>에뮬레이터 ID</TableHead>
            <TableHead className={styles.tableCell}>ON/OFF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
      </Table>
    </div>
  );
}
