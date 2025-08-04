'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Status from '../status';
import styles from './list-box.module.css';
import historyStyles from './history-list-box.module.css';

// type HistoryList {
//   carNumber: string;
// 	rentDate: number; //timestamp
// 	returnDate: number; //timestamp
// 	startLocation : string;
// 	endLocation : string;
// 	totalDist : number;
// 	status: string;
// 	memo : string;
// }

const allowedStatus = ['운행중', '대기중', '수리중'] as const;
type StatusType = (typeof allowedStatus)[number];

const dummyHis = [
  {
    carNumber: '12가 3456',
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
  return (
    <div className={styles.container}>
      <Table className={historyStyles.historyTable}>
        <TableHeader>
          <TableRow>
            <TableHead className={historyStyles.tableHeadWithPadding}>
              차량번호
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              렌트시작일
            </TableHead>
            <TableHead className={historyStyles.tableHeadDefault}>
              렌트종료일
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
          {dummyHis.map(log => (
            <TableRow key={log.carNumber}>
              <TableCell className={historyStyles.tableCell}>
                {log.carNumber}
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
