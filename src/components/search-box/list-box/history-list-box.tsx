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
      <Table style={{ margin: '0 auto', maxWidth: '1000px' }}>
        <TableHeader>
          <TableRow>
            <TableHead
              style={{
                width: '150px',
                borderBottom: '1px solid #e2e2e2',
                padding: '10px',
              }}
            >
              차량번호
            </TableHead>
            <TableHead
              style={{ width: '150px', borderBottom: '1px solid #e2e2e2' }}
            >
              렌트시작일
            </TableHead>
            <TableHead
              style={{ width: '150px', borderBottom: '1px solid #e2e2e2' }}
            >
              렌트종료일
            </TableHead>
            <TableHead
              style={{ width: '150px', borderBottom: '1px solid #e2e2e2' }}
            >
              출발지
            </TableHead>
            <TableHead
              style={{ width: '150px', borderBottom: '1px solid #e2e2e2' }}
            >
              도착지
            </TableHead>
            <TableHead
              style={{ width: '100px', borderBottom: '1px solid #e2e2e2' }}
            >
              주행거리
            </TableHead>
            <TableHead
              style={{ width: '150px', borderBottom: '1px solid #e2e2e2' }}
            >
              상태
            </TableHead>
            <TableHead
              style={{ width: '150px', borderBottom: '1px solid #e2e2e2' }}
            >
              특이사항
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyHis.map(log => (
            <TableRow key={log.carNumber}>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                {log.carNumber}
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                {log.rentDate}
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                {log.returnDate}
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                {log.startLocation}
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                {log.endLocation}
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                {log.totalDist}
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
                <div
                  style={{
                    display: 'inline-flex', // inline-flex로 내부 콘텐츠 크기만큼만 차지
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '5px',
                  }}
                >
                  <Status status={log.status as StatusType} />
                </div>
              </TableCell>
              <TableCell style={{ borderBottom: '1px solid #e2e2e2' }}>
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
