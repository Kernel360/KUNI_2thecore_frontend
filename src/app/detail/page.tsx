'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import TopBar from '@/components/ui/topBar';
import { useDetailStore } from '@/store/detail-store';
import { Input } from '@/components/ui/input';
import { setDetailChangeStore } from '@/store/detail-change';
import { Detail } from '@/store/detail-store';
import Map from '@/components/map/map';
import KakaoMapScript from '@/components/map/kakaoMapScript';

const mockDetail = {
  speed: 45,
  year: '2022년',
  drive_dist: '45,678 km',
};

const DetailPage = () => {
  const { Number, brand, model, status, location, setDetail } =
    useDetailStore();
  const detailChange = setDetailChangeStore(state => state.detailChange);
  // status가 undefined이거나 올바르지 않은 값일 때 기본값 처리
  const safeStatus = status ?? '대기중';

  const handleChange = (field: 'brand_model' | keyof Detail, value: string) => {
    if (field === 'brand_model') {
      const [newBrand, ...rest] = value.split(' ');
      const newModel = rest.join(' ');
      setDetail({
        Number,
        brand: newBrand,
        model: newModel,
        status,
        location,
      });
    } else {
      setDetail({
        Number,
        brand,
        model,
        status,
        location,
        [field]: value,
      });
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
      <TopBar title={`차량 상세 정보 - ${Number}`} />
      <div className="flex gap-8 max-w-6xl w-full">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <Card style={{ width: 480, minWidth: 320 }}>
            <CardContent>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
                차량 정보
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  rowGap: 18,
                  columnGap: 12,
                }}
              >
                <label>차량 번호</label>
                <Input
                  value={Number}
                  readOnly={!detailChange}
                  {...(detailChange && {
                    onChange: e => handleChange('Number', e.target.value),
                  })}
                />
                <label>차종</label>
                <Input
                  value={`${brand} ${model}`}
                  readOnly={!detailChange}
                  {...(detailChange && {
                    onChange: e => handleChange('brand_model', e.target.value),
                  })}
                />
                <label>상태</label>
                <Input
                  value={status}
                  readOnly={!detailChange}
                  {...(detailChange && {
                    onChange: e => handleChange('status', e.target.value),
                  })}
                />
                <label>현재 위치</label>
                <Input
                  value={location}
                  readOnly={!detailChange}
                  {...(detailChange && {
                    onChange: e => handleChange('location', e.target.value),
                  })}
                />
                <label>속도</label>
                <Input
                  value={`${mockDetail.speed} km/h`}
                  readOnly={!detailChange}
                />
                <label>차량 연식</label>
                <Input value={mockDetail.year} readOnly={!detailChange} />
                <label>주행거리</label>
                <Input value={mockDetail.drive_dist} readOnly={!detailChange} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full h-80">
          <kakaoMapScript/>
          <Map width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
