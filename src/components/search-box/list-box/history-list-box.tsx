'use client';

import styles from '@/components/icon-button/icon-button.module.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import Status from '../status';
import historyStyles from './history-list-box.module.css';

// type HistoryList {
//   carNumber: string;
//   brand: string;
// 	model: string;
//  	rentDate: number; //timestamp
//  	returnDate: number; //timestamp
//  	startLocation : string;
//  	endLocation : string;
//  	totalDist : number;
//  	status: string;
//  	memo : string;
// }

const allowedStatus = ['운행중', '대기중', '수리중'] as const;
type StatusType = (typeof allowedStatus)[number];

const dummyHis = [
  {
    carNumber: '12가 3456',
    brand: '현대',
    model: '소나타',
    rentDate: '2025-01-15',
    returnDate: '2024-01-17',
    startLocation: '서울시 중구',
    endLocation: '서울시 강남구',
    totalDist: '127km',
    status: '대기중',
    memo: '접촉사고 1회',
  },
  {
    carNumber: '34나 5678',
    brand: '기아',
    model: 'K5',
    rentDate: '2025-01-15',
    returnDate: '-',
    startLocation: '서울시 서초구',
    endLocation: '대구광역시',
    totalDist: '45km',
    status: '운행중',
    memo: '사고 없음',
  },
  {
    carNumber: '56다 7890',
    brand: '삼성',
    model: 'SM5',
    rentDate: '2025-01-10',
    returnDate: '2025-01-15',
    startLocation: '대전광역시',
    endLocation: '서울시 마포구',
    totalDist: '87km',
    status: '수리중',
    memo: '주차사고 1회',
  },
];

const HistoryListBox = () => {
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [sortedData, setSortedData] = useState(dummyHis);

  const handleSort = () => {
    const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    setSortOrder(newSortOrder);

    const sorted = [...sortedData].sort((a, b) => {
      if (newSortOrder === 'ascend') {
        return a.carNumber.localeCompare(b.carNumber);
      } else {
        return b.carNumber.localeCompare(a.carNumber);
      }
    });

    setSortedData(sorted);
  };

  return (
    <div className="flex align-center justify-between p-4 bg-white rounded-xl shadow-md w-[98%] m-3">
      <Table className={historyStyles.historyTable}>
        <TableHeader>
          <TableRow>
            <TableHead className={historyStyles.tableHeadWithPadding}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                차량번호
                <div
                  className={`${styles.sortOrder} ${styles[sortOrder === 'ascend' ? 'ascend' : 'descend']}`}
                  onClick={handleSort}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>
              브랜드
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>모델</TableHead>
            <TableHead className={historyStyles.tableHeadWithPadding}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                렌트시작일
                <div
                  className={`${styles.sortOrder} ${styles[sortOrder === 'ascend' ? 'ascend' : 'descend']}`}
                  onClick={handleSort}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadWithPadding}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                렌트종료일
                <div
                  className={`${styles.sortOrder} ${styles[sortOrder === 'ascend' ? 'ascend' : 'descend']}`}
                  onClick={handleSort}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              출발지
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              도착지
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>
              주행거리
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              상태
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              특이사항
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map(log => (
            <TableRow key={log.carNumber}>
              <TableCell className={historyStyles.tableCell}>
                {log.carNumber}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.brand}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.model}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.rentDate}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.returnDate}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.startLocation}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.endLocation}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.totalDist}
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                <div className={historyStyles.statusContainer}>
                  <Status status={log.status as StatusType} />
                </div>
              </TableCell>
              <TableCell className={historyStyles.tableCell}>
                {log.memo}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryListBox;
