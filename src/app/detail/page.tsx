import CarLocationMap from '@/components/map/car-location-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import MapModal from '@/components/map/map-modal';
import MenuBox from '@/components/menu-box/menu-box';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TopBar from '@/components/ui/topBar';
import { CarDetail, CarService } from '@/services/car-service';
import { setDetailChangeStore } from '@/store/detail-change';
import { useDetailStore } from '@/store/detail-store';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './detail.module.css';

const DetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const urlCarNumber = searchParams.get('carNumber');
  const {
    carNumber,
    brand,
    model,
    status,
    carYear,
    sumDist,
    carType,
    setDetail,
    brandModel,
    lastLatitude,
    lastLongitude,
  } = useDetailStore();
  const detailChange = setDetailChangeStore(state => state.detailChange);
  const setDetailChange = setDetailChangeStore(state => state.setDetailChange);
  // status가 undefined이거나 올바르지 않은 값일 때 기본값 처리
  const safeStatus = status ?? '대기';
  // URL에서 carNumber가 있으면 API 호출해서 데이터 가져오기
  useEffect(() => {
    if (urlCarNumber) {
      const fetchCarDetail = async () => {
        try {
          const carDetail = await CarService.getCar(urlCarNumber);
          setDetail(carDetail);
        } catch (error) {
          console.error('차량 정보 로드 실패:', error);
          alert('차량 정보를 불러오는데 실패했습니다.');
          navigate('/search');
        }
      };
      fetchCarDetail();
    }
  }, [urlCarNumber, carNumber, setDetail, navigate]);

  // URL에서 carNumber가 있으면 API 호출해서 데이터 가져오기
  useEffect(() => {
    if (urlCarNumber) {
      const fetchCarDetail = async () => {
        try {
          const carDetail = await CarService.getCar(urlCarNumber);
          setDetail(carDetail);
        } catch (error) {
          console.error('차량 정보 로드 실패:', error);
          alert('차량 정보를 불러오는데 실패했습니다.');
          navigate('/search');
        }
      };
      fetchCarDetail();
    }
  }, [urlCarNumber, carNumber, setDetail, navigate]);

  useEffect(() => {
    const checkMap = () => {};
    checkMap();
  }, [detailChange]);

  const handleChange = (
    field: 'brandModel' | keyof CarDetail,
    value: string
  ) => {
    if (field === 'brandModel') {
      setDetail({
        carNumber,
        brand,
        brandModel: value,
        model,
        status,
        carYear,
        sumDist,
        carType,
      });
    } else {
      setDetail({
        carNumber,
        brand,
        brandModel,
        model,
        status,
        carYear,
        sumDist,
        carType,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      // 브랜드와 모델을 분리하는 로직
      let finalBrand = brand;
      let finalModel = model;
      [finalBrand, finalModel] = brandModel.split(' ');
      console.log('분리된 브랜드,모델명');
      console.log(finalBrand, finalModel);

      const updateData: Partial<CarDetail> = {
        brand: finalBrand,
        model: finalModel,
        status,
        carYear,
        sumDist,
        carType,
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
      <MenuBox />
      <KakaoMapScript />
      <div className={styles.contentGrid}>
        {/* 상세 정보 */}
        <Card className={styles.detailCard}>
          <CardContent className={styles.cardContent}>
            <div className={styles.title}>차량 정보</div>
            <div className={styles.formGrid}>
              <label className={styles.label}>차량 번호</label>

              <Input className={styles.input} value={carNumber} readOnly />
              <label className={styles.label}>차량 브랜드 이름</label>
              <Input
                className={styles.input}
                value={`${brandModel}`}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('brandModel', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>상태</label>
              <Input
                className={styles.input}
                value={status}
                onChange={
                  detailChange
                    ? e => handleChange('status', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>차량 연식</label>
              <Input
                className={styles.input}
                value={carYear}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('carYear', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>주행 거리</label>
              <Input
                className={styles.input}
                value={sumDist}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('sumDist', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>차급</label>
              <Input
                className={styles.input}
                value={carType}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('carType', e.target.value)
                    : undefined
                }
              />
            </div>

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
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </>
  );
};

export default DetailPage;
