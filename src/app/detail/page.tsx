'use client';

import CarLocationMap from '@/components/map/car-location-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TopBar from '@/components/ui/topBar';
import { setDetailChangeStore } from '@/store/detail-change';
import { Detail, useDetailStore } from '@/store/detail-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const mockDetail = {
  year: '2022년',
  drive_dist: '45,678 km',
};

const DetailPage = () => {
  const router = useRouter();
  const { carNumber, brand, model, status, setDetail } = useDetailStore();
  const detailChange = setDetailChangeStore(state => state.detailChange);
  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);
  // status가 undefined이거나 올바르지 않은 값일 때 기본값 처리
  const safeStatus = status ?? '대기중';

  useEffect(() => {
    const checkMap = () => {};
    checkMap();
  }, [detailChange]);

  const handleChange = (field: 'brand_model' | keyof Detail, value: string) => {
    if (field === 'brand_model') {
      const [newBrand, ...rest] = value.split(' ');
      const newModel = rest.join(' ');
      setDetail({
        carNumber,
        brand: newBrand,
        model: newModel,
        status,
      });
    } else {
      setDetail({
        carNumber,
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
    console.log('저장된 데이터:', { carNumber, brand, model, status });

    // 편집 모드 종료
    setDetailChange(false);

    // 성공 메시지 표시 (선택사항)
    alert('차량 정보가 성공적으로 저장되었습니다.');

    // search 페이지로 라우트
    router.push('/search');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
      <TopBar title={`차량 상세 정보 - ${carNumber}`} />
      <KakaoMapScript />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '800px 400px',
          justifyContent: 'center',
          marginTop: 40,
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        {/* 상세 정보 */}
        <Card
          style={{
            width: 800,
            minWidth: 320,
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardContent style={{ margin: '35px 0px' }}>
            <div style={{ fontWeight: 700, fontSize: 25, marginBottom: 35 }}>
              차량 정보
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                rowGap: 25,
                columnGap: 400,
              }}
            >
              <label>차량 번호</label>
              <Input
                value={carNumber}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('carNumber', e.target.value)
                    : undefined
                }
              />
              <label>차종</label>
              <Input
                value={`${brand} ${model}`}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('brand_model', e.target.value)
                    : undefined
                }
              />
              <label>상태</label>
              <Input
                value={status}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('status', e.target.value)
                    : undefined
                }
              />
              <label>차량 연식</label>
              <Input value={mockDetail.year} readOnly={true} />
              <label>주행거리</label>
              <Input value={mockDetail.drive_dist} readOnly={true} />
            </div>

            {/* 확인 버튼 - detailChange가 true일 때만 표시 */}
            {detailChange && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 24,
                  gap: 12,
                }}
              >
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
                    fontWeight: '500',
                  }}
                >
                  확인
                </Button>
                <Button
                  onClick={() => {
                    setDetailChange(false);
                    router.push('/search');
                  }}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  취소
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 지도 */}
        <Card
          style={{
            width: 400,
            minWidth: 320,
            height: '100%',
          }}
        >
          <CardContent
            style={{
              boxSizing: 'border-box',
              minHeight: '300px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CarLocationMap width="100%" height="100%" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPage;
//PR 오류 확인
