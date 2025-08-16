import styles from '@/components/icon-button/icon-button.module.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DriveLog } from '@/services/history-service';
import { useState } from 'react';
import historyStyles from './history-list-box.module.css';

interface HistoryListBoxProps {
  historyData: DriveLog[];
  loading?: boolean;
  onSort?: (sortBy: string, order: 'ASC' | 'DESC') => void;
}

const allowedStatus = ['운행', '대기', '수리'] as const;
type StatusType = (typeof allowedStatus)[number];

const HistoryListBox = ({
  historyData,
  loading = false,
  onSort,
}: HistoryListBoxProps) => {
  const [currentSortBy, setCurrentSortBy] = useState<string>('startTime');
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const handleSort = (sortBy: string) => {
    let newIsAscending: boolean;
    
    if (currentSortBy === sortBy) {
      newIsAscending = !isAscending;
    } else {
      newIsAscending = true;
    }
    
    setCurrentSortBy(sortBy);
    setIsAscending(newIsAscending);

    if (onSort) {
      onSort(sortBy, newIsAscending ? 'ASC' : 'DESC');
    }
  };

  return (
    <div className="flex align-center justify-between p-4 bg-white rounded-xl shadow-md w-[98%] m-3">
      <Table className={historyStyles.historyTable}>
        <TableHeader>
          <TableRow>
            <TableHead className={historyStyles.tableHeadDefault}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                차량번호
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'carNumber' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('carNumber')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                브랜드
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'brand' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('brand')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                모델
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'model' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('model')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                주행시작일
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'startTime' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('startTime')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                주행종료일
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'endTime' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('endTime')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                출발지
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'startPoint' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('startPoint')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                도착지
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'endPoint' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('endPoint')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                주행거리
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'driveDist' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('driveDist')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadSmall}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                상태
                <div
                  className={`${styles.sortOrder} ${currentSortBy === 'status' ? (isAscending ? styles.descend : styles.ascend) : styles.descend}`}
                  onClick={() => handleSort('status')}
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                데이터를 불러오는 중...
              </TableCell>
            </TableRow>
          ) : historyData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                검색 결과가 없습니다
              </TableCell>
            </TableRow>
          ) : (
            historyData.map((log, index) => (
              <TableRow key={`${log.carNumber}-${log.startTime}-${index}`}>
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
                  {new Date(log.startTime).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell className={historyStyles.tableCell}>
                  {new Date(log.endTime).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell className={historyStyles.tableCell}>
                  {log.startPoint}
                </TableCell>
                <TableCell className={historyStyles.tableCell}>
                  {log.endPoint}
                </TableCell>
                <TableCell className={historyStyles.tableCell}>
                  {log.driveDist
                    ? `${(log.driveDist / 1000).toFixed(1)}km`
                    : '-'}
                </TableCell>
                <TableCell className={historyStyles.tableCell}>
                  {log.status}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryListBox;
