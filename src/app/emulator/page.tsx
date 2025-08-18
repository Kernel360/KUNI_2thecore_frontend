import NumberSearchBox from '@/components/search-box/number-search-box';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Car, CarSearchParams, CarService } from '@/services/car-service';
import { EmulService } from '@/services/emul-service';
import { useEffect, useState } from 'react';
import styles from './emulator.module.css';

export default function LocalEmulator() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState('');
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [carStatuses, setCarStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEmulators = async () => {
      try {
        setLoading(true);
        setError(null);
        const runningCarNumber = await CarService.getAllCars();
        setCars(runningCarNumber.content);

        // 초기 스위치 상태 설정 (차량 상태 기반)
        const initialStates: Record<string, boolean> = {};
        runningCarNumber.content.forEach(car => {
          initialStates[car.carNumber] = car.status === '운행';
        });
        setSwitchStates(initialStates);
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

      // 검색 결과에 대한 스위치 상태 설정 (차량 상태 기반)
      const searchStates: Record<string, boolean> = {};
      result.content.forEach(car => {
        searchStates[car.carNumber] = car.status === '운행';
      });
      setSwitchStates(searchStates);
    } catch (error) {
      console.error('차량 번호 검색 실패:', error);
      setError('에뮬레이터 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = async (carNumber: string, checked: boolean) => {
    // 스위치 상태 먼저 업데이트
    setSwitchStates(prev => ({
      ...prev,
      [carNumber]: checked,
    }));

    // 스위치 ON시 '운행', OFF시 '대기'로 설정
    const newStatus = checked ? '운행' : '대기';

    // API 호출하여 차량 상태 업데이트
    try {
      await EmulService.powerCar({
        carNumber: carNumber,
        powerStatus: checked ? 'ON' : 'OFF',
        loginId: localStorage.getItem('loginId') || '',
      });

      // 성공시 cars 배열도 업데이트
      setCars(prev =>
        prev.map(car =>
          car.carNumber === carNumber
            ? { ...car, status: newStatus, powerStatus: checked ? 'ON' : 'OFF' }
            : car
        )
      );
    } catch (error) {
      console.error('차량 상태 업데이트 실패:', error);
      // 에러 발생 시 스위치 상태 롤백
      setSwitchStates(prev => ({
        ...prev,
        [carNumber]: !checked,
      }));
    }
  };

  const handleToggleAll = async () => {
    const allOn = Object.values(switchStates).every(state => state);
    const newState = !allOn;

    const newStates: Record<string, boolean> = {};
    const newStatuses: Record<string, string> = {};

    cars.forEach(car => {
      newStates[car.carNumber] = newState;
      newStatuses[car.carNumber] = newState ? '운행' : '대기';
    });

    setSwitchStates(newStates);
    setCarStatuses(newStatuses);

    // 모든 차량에 대해 API 호출
    try {
      const updatePromises = cars.map(car =>
        CarService.updateCar(car.carNumber, {
          status: newState ? '운행' : '대기',
          powerStatus: newState ? 'ON' : 'OFF',
        })
      );
      await Promise.all(updatePromises);

      // 성공시 cars 배열도 업데이트
      setCars(prev =>
        prev.map(car => ({
          ...car,
          status: newState ? '운행' : '대기',
          powerStatus: newState ? 'ON' : 'OFF',
        }))
      );
    } catch (error) {
      console.error('전체 차량 상태 업데이트 실패:', error);
      // 에러 발생 시 상태 롤백
      const rollbackStates: Record<string, boolean> = {};
      const rollbackStatuses: Record<string, string> = {};
      cars.forEach(car => {
        rollbackStates[car.carNumber] = !newState;
        rollbackStatuses[car.carNumber] = car.status;
      });
      setSwitchStates(rollbackStates);
      setCarStatuses(rollbackStatuses);
    }
  };

  return (
    <div>
      <div className="gap-6 p-4 w-[98%] mx-auto">
        <NumberSearchBox
          value={carNumber}
          onChange={setCarNumber}
          onSearch={handleNumberSearch}
        />
      </div>
      {cars.length > 0 && (
        <div className="flex justify-center items-center mt-4 space-x-3">
          <Label htmlFor="toggleAll" className="text-lg font-medium">
            전체 제어
          </Label>
          <Switch
            id="toggleAll"
            checked={Object.values(switchStates).every(state => state)}
            onCheckedChange={handleToggleAll}
          />
          <Label htmlFor="toggleAll" className="text-sm text-gray-600">
            {Object.values(switchStates).every(state => state)
              ? '전체 ON'
              : '전체 OFF'}
          </Label>
        </div>
      )}
      <Table className={styles.emulatorTable}>
        <TableHeader className={styles.tableHeader}>
          <TableRow>
            <TableHead className={styles.tableCell}>차량번호</TableHead>
            <TableHead className={styles.tableCell}>상태</TableHead>
            <TableHead className={styles.tableCell}>ON/OFF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car, index) => (
            <TableRow key={`${car.carNumber}-${index}`}>
              <TableCell className={styles.tableCell}>
                {car.carNumber}
              </TableCell>
              <TableCell className={styles.tableCell}>{car.status}</TableCell>
              <TableCell className={styles.tableCell}>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`powerStatus-${car.carNumber}`}
                    checked={switchStates[car.carNumber] || false}
                    onCheckedChange={checked =>
                      handleSwitchChange(car.carNumber, checked)
                    }
                  />
                  <Label htmlFor={`powerStatus-${car.carNumber}`}>
                    {switchStates[car.carNumber] ? 'ON' : 'OFF'}
                  </Label>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
