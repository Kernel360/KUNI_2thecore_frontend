import iconStyles from '@/components/icon-button/icon-button.module.css';
import CarLocationMap from '@/components/map/car-location-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CarDetail, CarService } from '@/services/car-service';
import { setDetailChangeStore } from '@/store/detail-change';
import { useDetailStore } from '@/store/detail-store';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './detail.module.css';

const DetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlCarNumber = searchParams.get('carNumber');
  const urlMode = searchParams.get('mode'); // 'edit' 모드 확인
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // status가 undefined이거나 올바르지 않은 값일 때 기본값 처리
  const safeStatus = status ?? '대기';

  // 한국어 상태를 영어로 매핑
  const getEnglishStatus = (
    koreanStatus: string
  ): 'driving' | 'maintenance' | 'idle' => {
    switch (koreanStatus) {
      case '운행':
        return 'driving';
      case '수리':
        return 'maintenance';
      case '대기':
      default:
        return 'idle';
    }
  };

  // URL에서 carNumber가 있으면 API 호출해서 데이터 가져오기
  useEffect(() => {
    if (urlCarNumber) {
      const fetchCarDetail = async () => {
        try {
          const carDetail = await CarService.getCar(urlCarNumber);
          // brandModel이 없으면 brand + model로 생성
          if (!carDetail.brandModel) {
            carDetail.brandModel = `${carDetail.brand} ${carDetail.model}`;
          }
          setDetail(carDetail);
        } catch (error) {
          console.error('차량 정보 로드 실패:', error);
          alert('차량 정보를 불러오는데 실패했습니다.');
          navigate('/search');
        }
      };
      fetchCarDetail();
    }
  }, [urlCarNumber, setDetail, navigate]);

  // URL 모드 파라미터에 따라 수정 모드 설정
  useEffect(() => {
    if (urlMode === 'edit') {
      setDetailChange(true);
    } else {
      setDetailChange(false);
    }
  }, [urlMode, setDetailChange]);

  useEffect(() => {
    if (!urlCarNumber) return;

    // 수정 모드일 때는 자동 갱신하지 않음
    if (detailChange) return;

    // 3초 간격으로 API를 호출하는 interval 설정
    const intervalId = setInterval(async () => {
      try {
        const updatedCarDetail = await CarService.getCar(urlCarNumber);
        // brandModel이 없으면 brand + model로 생성
        if (!updatedCarDetail.brandModel) {
          updatedCarDetail.brandModel = `${updatedCarDetail.brand} ${updatedCarDetail.model}`;
        }
        setDetail(updatedCarDetail);
      } catch (error) {
        console.error(`'${urlCarNumber}' 차량 정보 갱신 실패:`, error);
      }
    }, 3000); // 3초

    // 컴포넌트가 언마운트될 때 interval 정리
    return () => clearInterval(intervalId);
  }, [urlCarNumber, setDetail, detailChange]);

  const handleChange = (field: keyof CarDetail, value: string) => {
    // brandModel 수정 시 brand와 model 자동 분리
    if (field === 'brandModel') {
      const [newBrand = '', newModel = ''] = value.split(' ');
      setDetail({
        carNumber,
        brand: newBrand,
        model: newModel,
        brandModel: value, // 전체 문자열 유지
        status,
        carYear,
        sumDist,
        carType,
        lastLatitude,
        lastLongitude,
      });
    } else if (field === 'sumDist' || field === 'carYear') {
      // 숫자 필드는 number로 변환
      const numValue = value === '' ? 0 : Number(value);
      setDetail({
        carNumber,
        brand,
        model,
        brandModel,
        status,
        carYear: field === 'carYear' ? numValue : carYear,
        sumDist: field === 'sumDist' ? numValue : sumDist,
        carType,
        lastLatitude,
        lastLongitude,
      });
    } else {
      // 다른 필드는 단순하게 업데이트
      setDetail({
        carNumber,
        brand,
        model,
        brandModel,
        status,
        carYear,
        sumDist,
        carType,
        lastLatitude,
        lastLongitude,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      // 브랜드와 모델이 이미 분리되어 있음 (handleChange에서 처리)
      // brandModel에서 한번 더 분리 (안전장치)
      let finalBrand = brand;
      let finalModel = model;

      if (brandModel.includes(' ')) {
        const parts = brandModel.split(' ');
        finalBrand = parts[0];
        finalModel = parts.slice(1).join(' '); // 모델명에 공백이 있을 수 있음
      }

      const updateData: Partial<CarDetail> = {
        brand: finalBrand.trim(),
        model: finalModel.trim(),
        status,
        carYear,
        sumDist,
        carType,
      };

      console.log('차량 정보 저장:', updateData);
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
      <KakaoMapScript />
      <div className={styles.contentGrid}>
        {/* 상세 정보 */}
        <Card className={styles.detailCard}>
          <CardContent className={styles.cardContent}>
            <button onClick={goBack} className={iconStyles.goBack}>
              <ArrowLeft size={20} color="#535968" />
            </button>
            <div className={styles.title}>차량 정보</div>
            <div className={styles.formGrid}>
              <label className={styles.label}>차량 번호</label>
              <Input className={styles.input} value={carNumber} />
              <label className={styles.label}>차량 브랜드 이름</label>
              <Input
                className={styles.input}
                value={brandModel}
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
                type="number"
                value={carYear}
                readOnly={!detailChange}
                onChange={
                  detailChange
                    ? e => handleChange('carYear', e.target.value)
                    : undefined
                }
              />
              <label className={styles.label}>주행 거리 (km)</label>
              <Input
                className={styles.input}
                type="number"
                step="0.01"
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
            <CarLocationMap
              width="100%"
              height="100%"
              carNumber={carNumber}
              lastLatitude={lastLatitude}
              lastLongitude={lastLongitude}
              status={getEnglishStatus(safeStatus)}
              useWebSocket={true}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DetailPage;
