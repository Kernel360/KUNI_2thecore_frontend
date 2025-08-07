'use client';

import { useEffect, useState } from 'react';
import { EmulatorService } from '@/services/emulator-service';
import { Emulator } from '@/lib/api';
import IconButton from '@/components/icon-button/icon-button';
import NumberSearchBox from '@/components/search-box/number-search-box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TopBar from '@/components/ui/topBar';
import React from 'react';
import styles from './emulator.module.css';

const handleDelete = async (deviceId: string) => {
  if (!confirm('정말로 이 에뮬레이터를 삭제하시겠습니까?')) {
    return;
  }

  try {
    await EmulatorService.deleteEmulator(deviceId);
    alert('에뮬레이터가 삭제되었습니다.');
    // 페이지 리로드 또는 상태 업데이트
    window.location.reload();
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
  const [emulators, setEmulators] = useState<Emulator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmulators = async () => {
      try {
        const emulatorData = await EmulatorService.getAllEmulators(0, 100);
        setEmulators(emulatorData.content);
      } catch (error) {
        console.error('에뮬레이터 목록 조회 실패:', error);
        // 에러 발생 시 더미 데이터 사용
        const fallbackEmulators: Emulator[] = [
          {
            deviceId: '68fd0215-6a96-11f0-aaf3-0a8c035f5c3b',
            carNumber: '32가1234',
            emulatorStatus: 'OFF',
          },
          {
            deviceId: '68fd01f8-6a96-11f0-aaf3-0a8c035f5c3b',
            carNumber: '73미1231',
            emulatorStatus: 'ON',
          },
          {
            deviceId: '68fd01d7-6a96-11f0-aaf3-0a8c035f5c3b',
            carNumber: '12가5129',
            emulatorStatus: 'OFF',
          },
        ];
        setEmulators(fallbackEmulators);
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
        <TableBody>
          {emulators.map(emul => (
            <TableRow key={emul.deviceId}>
              <TableCell className={styles.tableCell}>
                <div className={styles.deleteContainer}>
                  <IconButton 
                    iconType="delete" 
                    onClick={() => handleDelete(emul.deviceId)} 
                  />
                </div>
              </TableCell>
              <TableCell className={styles.tableCell}>
                {emul.carNumber}
              </TableCell>
              <TableCell className={styles.tableCell}>
                {emul.deviceId}
              </TableCell>
              <TableCell className={styles.tableCell}>
                {emul.emulatorStatus.toUpperCase()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}