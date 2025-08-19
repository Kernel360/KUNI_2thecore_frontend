import useObserver from '@/hooks/use-intersection-observer';
import { Car, CarSearchParams, CarService } from '@/services/car-service';
import { useEffect, useState } from 'react';
import CarRegisterModal, { CarFormData } from './car-register-modal';
import BrandFilterBox from './filter-box';
import floatingStyles from './floating.module.css';
import ListBox from './list-box/list-box';
import NumberSearchBox from './number-search-box';

const SearchBox = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 입력창 상태들을 SearchBox에서 관리
  const [carNumber, setCarNumber] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [status, setStatus] = useState('운행');

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 무한 스크롤
  const { page, setPage, isFetching, setIsFetching, setLastIntersecting } =
    useObserver();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentSearchParams, setCurrentSearchParams] =
    useState<CarSearchParams | null>(null);

  // 초기 차량 목록 로드
  useEffect(() => {
    loadInitialCars();
  }, []);

  // 페이지 변경 시 추가 데이터 로드 (무한 스크롤)
  useEffect(() => {
    if (page === 1 || !hasNextPage) return;

    const loadMoreCars = async () => {
      try {
        setIsFetching(true);

        let result;
        if (currentSearchParams) {
          result = await CarService.searchCars(currentSearchParams, page, 10);
        } else {
          result = await CarService.getAllCars(page, 10);
        }

        if (result.content.length > 0) {
          setCars(prevCars => [...prevCars, ...result.content]);
          setHasNextPage(result.content.length === 10);
        } else {
          setHasNextPage(false);
        }
      } catch (error) {
        console.error('추가 데이터 로드 실패:', error);
      } finally {
        setIsFetching(false);
      }
    };

    loadMoreCars();
  }, [page, currentSearchParams, hasNextPage]);

  const loadInitialCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const carData = await CarService.getAllCars(1, 10);
      setCars(carData.content);
      setPage(1);
      setHasNextPage(carData.content.length === 10);
      setCurrentSearchParams(null);
      setIsFetching(false);
    } catch (error) {
      console.error('차량 목록 조회 실패:', error);
      setError('차량 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 차량 번호로 검색 (백엔드 API 2.6 명세에 맞게 수정)
  const handleNumberSearch = async () => {
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
        offset: 10,
      };

      const result = await CarService.searchCars(searchParams, 1, 10);
      setCars(result.content);
      setPage(1);
      setHasNextPage(result.content.length === 10);
      setCurrentSearchParams(searchParams);
      setIsFetching(false);
    } catch (error) {
      console.error('차량 번호 검색 실패:', error);
      setError('차량 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 필터 적용 (브랜드/모델 + 상태) - 백엔드 API 2.6 명세에 맞게 수정
  const handleFilterApply = async () => {
    // 브랜드와 모델을 분리 (공백으로 구분)
    const parts = brandModel.trim().split(/\s+/);
    const brand = parts[0] || '';
    const model = parts.slice(1).join(' ') || '';
    try {
      setLoading(true);
      setError(null);

      // 백엔드 API 2.6 명세에 맞게 파라미터 구성
      const searchParams: CarSearchParams = {
        page: 1,
        offset: 10,
      };

      // 브랜드와 모델 처리
      if (brand && model) {
        searchParams.brand = brand.trim();
        searchParams.model = model.trim();
        searchParams.twoParam = true;
      } else if (brand) {
        // 브랜드만 입력된 경우
        searchParams.brand = brand.trim();
        searchParams.twoParam = false;
      } else if (model) {
        // 모델만 입력된 경우
        searchParams.brand = model.trim();
        searchParams.twoParam = false;
      }

      // 상태 처리
      if (status) {
        searchParams.status = status;
      }

      const result = await CarService.searchCars(searchParams, 1, 10);
      setCars(result.content);
      setPage(1);
      setHasNextPage(result.content.length === 10);
      setCurrentSearchParams(searchParams);
      setIsFetching(false);
    } catch (error) {
      console.error('필터 검색 실패:', error);
      setError('필터 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 차량 등록 핸들러
  const handleCarRegister = async (formData: CarFormData) => {
    try {
      setLoading(true);
      setError(null);

      const carData = {
        brand: formData.brand,
        model: formData.model,
        carYear: parseInt(formData.carYear),
        carType: formData.carType,
        carNumber: formData.carNumber,
        sumDist: parseFloat(formData.sumDist),
        lastLatitude: formData.lastLatitude,
        lastLongitude: formData.lastLongitude,
      };

      await CarService.createCar(carData);
      loadInitialCars(); // 등록 후 목록 새로고침
    } catch (error) {
      console.error('차량 등록 실패:', error);
      setError('차량 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 차량 삭제 핸들러 - List-Box에서 삭제 성공 시 호출됨
  const handleCarDelete = (deletedCarNumber: string) => {
    // 삭제된 차량을 cars 배열에서 제거
    setCars(prevCars =>
      prevCars.filter(car => car.carNumber !== deletedCarNumber)
    );
    console.log(`차량 목록에서 ${deletedCarNumber} 제거 완료`);
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
        <NumberSearchBox
          value={carNumber}
          onChange={setCarNumber}
          onSearch={handleNumberSearch}
        />
        <BrandFilterBox
          brandModel={brandModel}
          setBrandModel={setBrandModel}
          status={status}
          setStatus={setStatus}
          onFilterApply={handleFilterApply}
        />

        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>
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
              key={`${car.carNumber}-${idx}`}
              carNumber={car.carNumber}
              brand={car.brand}
              model={car.model}
              status={car.status}
              onDelete={handleCarDelete}
              ref={
                idx === cars.length - 1 && hasNextPage
                  ? setLastIntersecting
                  : null
              }
            />
          ))
        )}
      </div>
      <div className={floatingStyles.floatingContainer}>
        <button
          className={floatingStyles.floatingButton}
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      <CarRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCarRegister}
      />
    </>
  );
};

export default SearchBox;
