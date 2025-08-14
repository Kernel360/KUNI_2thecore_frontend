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

export default function LocalEmulator() {
  const [loading, setLoading] = useState(true);
  const [carNumber, setCarNumber] = useState('');
  const [newCarNumber, setNewCarNumber] = useState('');

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

  const handleNumberSearch = async () => {
    if (!carNumber.trim()) {
      alert('차량 번호를 입력해주세요.');
      return;
    }
    
    console.log('에뮬레이터 검색:', carNumber);
    // TODO: 실제 검색 로직 구현
  };

  const handleRegisterEmulator = async () => {
    if (!newCarNumber.trim()) {
      alert('차량 번호를 입력해주세요.');
      return;
    }
    
    console.log('에뮬레이터 등록:', newCarNumber);
    // TODO: 실제 등록 로직 구현
  };

  const EmulSearchBox = () => {
    return (
      <div className={styles.emulSearch}>
        <NumberSearchBox
          value={carNumber}
          onChange={setCarNumber}
          onSearch={handleNumberSearch}
        />
        <div className={styles.filterContainer}>
          <Input
            type="text"
            placeholder="새 에뮬레이터를 등록하려면 차량 번호를 이곳에 입력해주세요. (예: 11가 1111)"
            className={styles.searchContainer}
            value={newCarNumber}
            onChange={(e) => setNewCarNumber(e.target.value)}
          />
          <Button className={styles.searchButton} onClick={handleRegisterEmulator}>
            등록
          </Button>
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
