import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Status from '@/components/carSearchBox/status';
import TopBar from '@/components/ui/topBar';

type CarDetail = {
  car_number: string;
  brand: string;
  model: string;
  status: '운행중' | '대기중' | '수리중';
  location: string;
  speed: number;
  year: string;
  drive_dist: string;
};

const mockDetail: CarDetail = {
  car_number: '12가 3456',
  brand: '현대',
  model: '아반떼',
  status: '운행중',
  location: '서울시 강남구 역삼동',
  speed: 45,
  year: '2022년',
  drive_dist: '45,678 km',
};

const DetailPage = () => {
  const status = mockDetail.status;
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
      <TopBar title={`차량 상세 정보 - ${mockDetail.car_number}`} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Card style={{ width: 480, minWidth: 320 }}>
          <CardContent>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>차량 정보</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: 18, columnGap: 12 }}>
              <Label>차량 번호</Label>
              <div>{mockDetail.car_number}</div>
              <Label>차종</Label>
              <div>{`${mockDetail.brand} ${mockDetail.model}`}</div>
              <Label>상태</Label>
              <Status status={mockDetail.status} />
              <Label>현재 위치</Label>
              <div>{mockDetail.location}</div>
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
