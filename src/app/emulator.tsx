'use client'

import TopBar from '@/components/ui/topBar';
import styles from "./carListBox.module.css";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CarSearchBox from '@/components/carSearchBox/carSearchBox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EmulListBoxProps {
    car_number: string;
    emulator_id: string;
    emulator_status: string;
}

const CarEmulNumberSearchBox = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: 'center', }}>
            <div
                style={{
                    width: '97%',
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    margin: '8px 0px'

                }}
            >
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
        </div >
    )
}

export default function Emulator() {
    return (
        <div>
            <TopBar title="에뮬레이터"></TopBar>
            <CarEmulNumberSearchBox />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">차량번호</TableHead>
                        <TableHead>에뮬레이터 ID</TableHead>
                        <TableHead className="text-right">ON/OFF</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">12가 3456</TableCell>
                        <TableCell>EMU001</TableCell>
                        <TableCell className="text-right">ON</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}