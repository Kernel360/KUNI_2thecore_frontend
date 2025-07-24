"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import TopBar from '@/components/ui/topBar';
import { useCarDetailStore } from '@/store/carDetailStore';

const mockDetail = {
  speed: 45,
  year: '2022년',
  drive_dist: '45,678 km',
};

const DetailPage = () => {
  const { car_number, brand, model, status, location } = useCarDetailStore();
  // status가 undefined이거나 올바르지 않은 값일 때 기본값 처리
  const safeStatus = status ?? '대기중';
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
      <TopBar title={`차량 상세 정보 - ${car_number}`} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Card style={{ width: 480, minWidth: 320 }}>
          <CardContent>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>차량 정보</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: 18, columnGap: 12 }}>
              <Label>차량 번호</Label>
              <div>{car_number}</div>
              <Label>차종</Label>
              <div>{`${brand} ${model}`}</div>
              <Label>상태</Label>
              <div>{`${status}`}</div>
              <Label>현재 위치</Label>
              <div>{location}</div>
              <Label>속도</Label>
              <div>{mockDetail.speed} km/h</div>
              <Label>차량 연식</Label>
              <div>{mockDetail.year}</div>
              <Label>주행거리</Label>
              <div>{mockDetail.drive_dist}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPage;
