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
  onSort?: (sortBy: string, order: 'asc' | 'desc') => void;
}

const allowedStatus = ['운행', '대기', '수리'] as const;
type StatusType = (typeof allowedStatus)[number];

const HistoryListBox = ({
  historyData,
  loading = false,
  onSort,
}: HistoryListBoxProps) => {
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  const handleSort = (sortBy: string) => {
    const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    setSortOrder(newSortOrder);

    if (onSort) {
      onSort(sortBy, newSortOrder === 'ascend' ? 'asc' : 'desc');
    }
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
                  onClick={() => handleSort('carNumber')}
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
                주행시작일
                <div
                  className={`${styles.sortOrder} ${styles[sortOrder === 'ascend' ? 'ascend' : 'descend']}`}
                  onClick={() => handleSort('startTime')}
                />
              </div>
            </TableHead>
            <TableHead className={historyStyles.tableHeadWithPadding}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                주행종료일
                <div
                  className={`${styles.sortOrder} ${styles[sortOrder === 'ascend' ? 'ascend' : 'descend']}`}
                  onClick={() => handleSort('endTime')}
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
                  {new Date(log.endTime).toLocaleString('ko-KR') || '-'}
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
