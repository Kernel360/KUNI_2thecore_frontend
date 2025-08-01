'use client'

import TopBar from '@/components/ui/topBar';
import React, {useState} from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import IconButton from '@/components/icon-button/icon-button';

interface Emulator {
    deviceId: string;
    carNumber: string;
    emulatorStatus: string; //'ON' | 'OFF'
  }

const handleDelete = (e: React.MouseEvent) => {
    alert("에뮬레이터가 삭제되었습니다.");
  };
  
const dummyEmuls = [
    { deviceId: "68fd0215-6a96-11f0-aaf3-0a8c035f5c3b", carNumber: "32가1234", emulatorStatus: "OFF" },
    { deviceId: "68fd01f8-6a96-11f0-aaf3-0a8c035f5c3b", carNumber: "73미1231", emulatorStatus: "ON" },
    { deviceId: "68fd01d7-6a96-11f0-aaf3-0a8c035f5c3b", carNumber: "12가5129", emulatorStatus: "OFF" },
    { deviceId: "68fd01b2-6a96-11f0-aaf3-0a8c035f5c3b", carNumber: "12가5126", emulatorStatus: "ON" },
    { deviceId: "68fd0192-6a96-11f0-aaf3-0a8c035f5c3b", carNumber: "12가5123", emulatorStatus: "OFF" }
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
                <Input type="text" placeholder="차량 번호 (예: 11가 1111)" style={{
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
                <Input type="text" placeholder="새 에뮬레이터를 등록하려면 차량 번호를 이곳에 입력해주세요. (예: 11가 1111)" style={{
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
        </div>
    );
}
