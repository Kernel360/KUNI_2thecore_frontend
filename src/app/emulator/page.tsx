'use client';

import IconButton from '@/components/icon-button/icon-button';
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

interface Emulator {
  deviceId: string;
  carNumber: string;
  emulatorStatus: string; //'ON' | 'OFF'
}

const handleDelete = (e: React.MouseEvent) => {
  alert('에뮬레이터가 삭제되었습니다.');
};

const dummyEmuls = [
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
  {
    deviceId: '68fd01b2-6a96-11f0-aaf3-0a8c035f5c3b',
    carNumber: '12가5126',
    emulatorStatus: 'ON',
  },
  {
    deviceId: '68fd0192-6a96-11f0-aaf3-0a8c035f5c3b',
    carNumber: '12가5123',
    emulatorStatus: 'OFF',
  },
];

const CarEmulNumberSearchBox = () => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchRow}>
        <Input
          type="text"
          placeholder="차량 번호 (예: 11가 1111)"
          className={styles.searchInput}
        />
        <Button className={styles.searchButton}>
          검색
        </Button>
      </div>
      <div className={styles.searchRow}>
        <Input
          type="text"
          placeholder="새 에뮬레이터를 등록하려면 차량 번호를 이곳에 입력해주세요. (예: 11가 1111)"
          className={styles.searchInput}
        />
        <Button className={styles.searchButton}>
          등록
        </Button>
      </div>
    </div>
  );
};

export default function Emulator() {
  return (
    <div>
      <TopBar title="에뮬레이터"></TopBar>
      <CarEmulNumberSearchBox />
      <Table className={styles.emulatorTable}>
        <TableHeader className={styles.tableHeader}>
          <TableRow>
            <TableHead className={styles.tableCellSmall}></TableHead>
            <TableHead className={styles.tableCell}>
              차량번호
            </TableHead>
            <TableHead className={styles.tableCell}>
              에뮬레이터 ID
            </TableHead>
            <TableHead className={styles.tableCell}>
              ON/OFF
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyEmuls.map(emul => (
            <TableRow key={emul.deviceId}>
              <TableCell className={styles.tableCell}>
                <div className={styles.deleteContainer}>
                  <IconButton iconType="delete" onClick={handleDelete} />
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

