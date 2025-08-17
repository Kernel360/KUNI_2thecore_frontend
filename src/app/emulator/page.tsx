import NumberSearchBox from '@/components/search-box/number-search-box';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TopBar from '@/components/ui/topBar';
import { Car, CarSearchParams, CarService } from '@/services/car-service';
import { useEffect, useState } from 'react';
import styles from './emulator.module.css';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function LocalEmulator() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState('');

  useEffect(() => {
    const fetchEmulators = async () => {
      try {
        setLoading(true);
        setError(null);
        const runningCarNumber = await CarService.getAllCars();
        setCars(runningCarNumber.content);
      } catch (error) {
        console.error('에뮬레이터 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmulators();
  }, []);

  const handleNumberSearch = async () => {
    if (!carNumber.trim()) {
      setError('차량 번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const searchParams: CarSearchParams = {
        carNumber: carNumber.trim(),
      };

      const result = await CarService.searchCars(searchParams);
      setCars(result.content);
    } catch (error) {
      console.error('차량 번호 검색 실패:', error);
      setError('차량 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const EmulSearchBox = () => {
    return (
      <NumberSearchBox
        value={carNumber}
        onChange={setCarNumber}
        onSearch={handleNumberSearch}
      />
    );
  };

  return (
    <div>
      <TopBar title="에뮬레이터"></TopBar>
      <EmulSearchBox />
      <Table className={styles.emulatorTable}>
        <TableHeader className={styles.tableHeader}>
          <TableRow>
            <TableHead className={styles.tableCell}>차량번호</TableHead>
            <TableHead className={styles.tableCell}>ON/OFF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car, index) => (
            <TableRow key={`${car.carNumber}-${index}`}>
              <TableCell className={styles.tableCell}>
                {car.carNumber}
              </TableCell>
              <TableCell className={styles.tableCell}>
                {car.powerStatus === 'OFF' ? 'ON' : 'OFF'}
                <div className="flex items-center space-x-2">
                  <Switch id="powerStatus" />
                  <Label htmlFor="powerStatus"></Label>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
