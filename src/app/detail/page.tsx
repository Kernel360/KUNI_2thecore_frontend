
import { useEffect, useState } from 'react';
import { CarService } from '@/services/car-service';
import { CarDetail } from '@/types';
import CarLocationMap from '@/components/map/car-location-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TopBar from '@/components/ui/topBar';
import { setDetailChangeStore } from '@/store/detail-change';
import { Detail, useDetailStore } from '@/store/detail-store';
import { useNavigate } from 'react-router-dom';
import styles from './detail.module.css';
const mockDetail = {
  year: '2022년',
  drive_dist: '45,678 km',
};

const DetailPage = () => {
  const navigate = useNavigate();
  const { carNumber, brand, model, status, setDetail } = useDetailStore();
  const detailChange = setDetailChangeStore(state => state.detailChange);
  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);
  // status가 undefined이거나 올바르지 않은 값일 때 기본값 처리
  const safeStatus = status ?? '대기중';

  useEffect(() => {
    const checkMap = () => {};
    checkMap();
  }, [detailChange]);

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

  const handleSave = async () => {
    if (!carNumber) {
      alert('차량 번호가 필요합니다.');
      return;
    }

    try {
      const updateData: Partial<CarDetail> = {
        carNumber,
        brand,
        model,
        status,
      };

      await CarService.updateCar(carNumber, updateData);
      
      // 편집 모드 종료
      setDetailChange(false);

      // 성공 메시지 표시
      alert('차량 정보가 성공적으로 저장되었습니다.');

      // search 페이지로 라우트
      navigate('/search');
    } catch (error) {
      console.error('차량 정보 저장 실패:', error);
      alert('차량 정보 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <TopBar title={`차량 상세 정보 - ${carNumber}`} />
      <KakaoMapScript />
      <div className={styles.contentGrid}>
        {/* 상세 정보 */}
        <Card className={styles.detailCard}>
          <CardContent className={styles.cardContent}>
            <div className={styles.title}>차량 정보</div>
            <div className={styles.formGrid}>
              <label className={styles.label}>차량 번호</label>

              <Input
                className={styles.input}
                value={carNumber}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('carNumber', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>차종</label>
              <Input
                className={styles.input}
                value={`${brand} ${model}`}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('brand_model', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>상태</label>
              <Input
                className={styles.input}
                value={status}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('status', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>차량 연식</label>
              <Input
                className={styles.input}
                value={mockDetail.year}
                readOnly={true}
              />
              <label className={styles.label}>주행거리</label>
              <Input
                className={styles.input}
                value={mockDetail.drive_dist}
                readOnly={true}
              />
            </div>

            {/* 확인 버튼 - detailChange가 true일 때만 표시 */}
            {detailChange && (
              <div className={styles.buttonContainer}>
                <Button className={styles.confirmButton} onClick={handleSave}>
                  확인
                </Button>
                <Button
                  className={styles.cancelButton}
                  onClick={() => {
                    setDetailChange(false);
                    navigate('/search');
                  }}
                >
                  취소
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 지도 */}
        <Card className={styles.mapCard}>
          <CardContent className={styles.mapContent}>
            <CarLocationMap width="100%" height="100%" />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DetailPage;
