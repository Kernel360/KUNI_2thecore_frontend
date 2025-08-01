'use client';

import IconButton from '@/components/icon-button/icon-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Status from '../status';
import styles from './list-box.module.css';
import searchFilterStyles from './search-filter.module.css';

interface HistoryListBoxProps {
  carNumber: string;
  brand: string;
  model: string;
  status: string;
}

const allowedStatus = ['운행중', '대기중', '수리중'] as const;
type StatusType = (typeof allowedStatus)[number];

const HistoryListBox: <HistoryListBoxProps> = ({
  carNumber,
  model,
  brand,
  status,
});

  return (
    <Table style={{ margin: "0 auto", maxWidth: "600px" }}>
      <TableHeader>
                    <TableRow>
                        <TableHead style={{ width: "50px" }}></TableHead>
                        <TableHead>차량번호</TableHead>
                        <TableHead>에뮬레이터 ID</TableHead>
                        <TableHead>ON/OFF</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dummyEmuls.map((emul) => (
                        <TableRow key={emul.deviceId}>
                            <TableCell>
                                <IconButton iconType="delete" onClick={handleDelete} />
                            </TableCell>
                            <TableCell className="font-medium">{emul.carNumber}</TableCell>
                            <TableCell>{emul.deviceId}</TableCell>
                            <TableCell>{emul.emulatorStatus.toUpperCase()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
  );
};

export default HistoryListBox;
