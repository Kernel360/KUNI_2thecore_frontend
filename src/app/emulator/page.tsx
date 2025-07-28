'use client'

import TopBar from '@/components/ui/topBar';
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const dummyEmuls = [
    { carNumber: '12가 3456', emulatorId: 'EMU001', emulatorStatus: 'on' },
    { carNumber: '34나 5678', emulatorId: 'EMU002', emulatorStatus: 'on' },
    { carNumber: '56다 7890', emulatorId: 'EMU003', emulatorStatus: 'off' },
];

const CarEmulNumberSearchBox = () => {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", width: "100%", marginBottom: "21px"
        }}>
            <div style={{
                display: "flex", flexDirection: "row", alignItems: "center",
                justifyContent: "center", width: "100%", marginTop: "21px",
            }}>
                <Input type="text" placeholder="차량 번호" style={{
                    width: "80%", height: "38.5px",
                    backgroundColor: "white",
                }} />
                <Button style={{
                    width: "7%", height: "44px", marginLeft: "14px",
                    backgroundColor: "#0070f3", color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                }}>검색</Button>
            </div>
            <div style={{
                display: "flex", flexDirection: "row", alignItems: "center",
                justifyContent: "center", width: "100%", marginTop: "21px",
            }}>
                <Input type="text" placeholder="새 에뮬레이터를 등록하려면 차량 번호를 이곳에 입력해주세요." style={{
                    width: "80%", height: "38.5px",
                    backgroundColor: "white",
                }} />
                <Button style={{
                    width: "7%", height: "44px", marginLeft: "14px",
                    backgroundColor: "#0070f3", color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                }}>등록</Button>
            </div>
        </div>
    );
};

export default function Emulator() {
    return (
        <div>
            <TopBar title="에뮬레이터"></TopBar>
            <CarEmulNumberSearchBox />
            <Table style={{
                margin: "0 auto", maxWidth: "600px"
            }}>
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
                        <TableRow key={emul.emulatorId}>
                            <TableCell>
                                {/* iconButton */}
                            </TableCell>
                            <TableCell className="font-medium">{emul.carNumber}</TableCell>
                            <TableCell>{emul.emulatorId}</TableCell>
                            <TableCell>{emul.emulatorStatus.toUpperCase()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}