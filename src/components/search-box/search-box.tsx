import { Car, CarSearchParams, CarService } from '@/services/car-service';
import { useEffect, useState } from 'react';
import BrandFilterBox from './filter-box';
import floatingStyles from './floating.module.css';
import ListBox from './list-box/list-box';
import NumberSearchBox from './number-search-box';

const SearchBox = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 차량 목록 로드
  useEffect(() => {
    loadInitialCars();
  }, []);

  const loadInitialCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const carData = await CarService.getAllCars(1, 50);
      setCars(carData.content);
    } catch (error) {
      console.error('차량 목록 조회 실패:', error);
      setError('차량 목록을 불러오는데 실패했습니다.');
      // 에러 발생 시 더미 데이터 사용
      const fallbackCars: Car[] = [
        {
          carNumber: '12가 1234',
          brand: '현대',
          model: '소나타',
          status: '운행',
        },
        {
          carNumber: '23나 2345',
          brand: '기아',
          model: 'K5',
          status: '대기',
        },
        {
          carNumber: '34라 3456',
          brand: '삼성',
          model: 'SM5',
          status: '수리',
        },
      ];
      setCars(fallbackCars);
    } finally {
      setLoading(false);
    }
  };

  // 차량 번호로 검색 (백엔드 API 2.6 명세에 맞게 수정)
  const handleNumberSearch = async (carNumber: string) => {
    if (!carNumber.trim()) {
      setError('차량 번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 백엔드 API 2.6 명세에 맞게 파라미터 구성
      const searchParams: CarSearchParams = {
        carNumber: carNumber.trim(),
        page: 1,
        offset: 50,
      };

      const result = await CarService.searchCars(searchParams, 1, 50);
      setCars(result.content);
    } catch (error) {
      console.error('차량 번호 검색 실패:', error);
      setError('차량 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 필터 적용 (브랜드/모델 + 상태) - 백엔드 API 2.6 명세에 맞게 수정
  const handleFilterApply = async (
    brand: string,
    model: string,
    status: string
  ) => {
    // 필수 요소 검증: 차량 번호 또는 상태 중 하나는 필수
    if (!brand && !model && !status) {
      setError('차량 번호, 브랜드/모델, 또는 상태 중 하나를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 백엔드 API 2.6 명세에 맞게 파라미터 구성
      const searchParams: CarSearchParams = {
        page: 1,
        offset: 50,
      };

      // 브랜드와 모델 처리
      if (brand && model) {
        searchParams.brand = brand.trim();
        searchParams.model = model.trim();
        // twoParam 로직: 브랜드 + 모델명 길이가 1인 경우에만 false
        searchParams.twoParam = (brand.trim() + model.trim()).length > 1;
      } else if (brand) {
        // 브랜드만 입력된 경우
        searchParams.brand = brand.trim();
        searchParams.twoParam = true; // 모든 조건이 안들어가있을때도 true
      } else if (model) {
        // 모델만 입력된 경우
        searchParams.model = model.trim();
        searchParams.twoParam = true;
      }

      // 상태 처리
      if (status) {
        searchParams.status = status;
      }

      const result = await CarService.searchCars(searchParams, 1, 50);
      setCars(result.content);
    } catch (error) {
      console.error('필터 검색 실패:', error);
      setError('필터 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
      >
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '95%',
          position: 'relative',
        }}
      >
        <NumberSearchBox onSearch={handleNumberSearch} />
        <BrandFilterBox onFilterApply={handleFilterApply} />

        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
            {error}
          </div>
        )}

        {cars.length === 0 && !error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          cars.map((car, idx) => (
            <ListBox
              key={idx}
              carNumber={car.carNumber}
              brand={car.brand}
              model={car.model}
              status={car.status}
            />
          ))
        )}
      </div>
      <div className={floatingStyles.floatingContainer}>
        <button className={floatingStyles.floatingButton}>+</button>
      </div>
    </>
  );
};

export default SearchBox;
