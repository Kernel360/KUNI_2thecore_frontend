'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TopBar from '@/components/ui/topBar';
import { useDetailStore } from '@/store/detail-store';
import { Input } from '@/components/ui/input';
import { setDetailChangeStore } from '@/store/detail-change';
import { Detail } from '@/store/detail-store';
import { Button } from '@/components/ui/button';

const mockDetail = {
  speed: 45,
  year: '2022년',
  drive_dist: '45,678 km',
};

const DetailPage = () => {
  const { Number, brand, model, status,  setDetail } =
    useDetailStore();
  const detailChange = setDetailChangeStore(state => state.detailChange);
  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);
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
      });
    } else {
      setDetail({
        Number,
        brand,
        model,
        status,
        [field]: value,
      });
    }
  };

  const handleSave = () => {
    // 여기에 실제 저장 로직을 추가할 수 있습니다
    // 예: API 호출, 데이터베이스 업데이트 등
    console.log('저장된 데이터:', { Number, brand, model, status, location });
    
    // 편집 모드 종료
    setDetailChange(false);
    
    // 성공 메시지 표시 (선택사항)
    alert('차량 정보가 성공적으로 저장되었습니다.');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
      <TopBar title={`차량 상세 정보 - ${Number}`} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, }}>
        <Card style={{ width: 800, minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <CardContent style={{margin: '35px 0px'}}>
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
                onChange={detailChange ? (e => handleChange('Number', e.target.value)) : undefined}
              />
              <label>차종</label>
              <Input
                value={`${brand} ${model}`}
                readOnly={!detailChange}
                onChange={detailChange ? (e => handleChange('brand_model', e.target.value)) : undefined}
              />
              <label>상태</label>
              <Input
                value={status}
                readOnly={!detailChange}
                onChange={detailChange ? (e => handleChange('status', e.target.value)) : undefined}
              />
              <label>속도</label>
              <Input
                value={`${mockDetail.speed} km/h`}
                readOnly={true}
              />
              <label>차량 연식</label>
              <Input value={mockDetail.year} readOnly={true} />
              <label>주행거리</label>
              <Input value={mockDetail.drive_dist} readOnly={true} />
            </div>
            
            {/* 확인 버튼 - detailChange가 true일 때만 표시 */}
            {detailChange && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: 24,
                gap: 12
              }}>
                <Button 
                  onClick={handleSave}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  확인
                </Button>
                <Button 
                  onClick={() => setDetailChange(false)}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  취소
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPage;
