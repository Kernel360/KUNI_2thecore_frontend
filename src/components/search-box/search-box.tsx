import { useEffect, useState } from 'react';
import { CarService } from '@/services/car-service';
import { Car } from '@/lib/api';
import BrandFilterBox from './filter-box';
import floatingStyles from './floating.module.css';
import ListBox from './list-box/list-box';
import NumberSearchBox from './number-search-box';

const SearchBox = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await CarService.getAllCars(1, 50); // 첫 번째 페이지, 50개
        setCars(carData.content);
      } catch (error) {
        console.error('차량 목록 조회 실패:', error);
        // 에러 발생 시 더미 데이터 사용
        const fallbackCars: Car[] = [
          { carNumber: '12가 1234', brand: '현대', model: '소나타', status: '운행중' },
          { carNumber: '23나 2345', brand: '기아', model: 'K5', status: '대기중' },
          { carNumber: '34라 3456', brand: '삼성', model: 'SM5', status: '수리중' },
        ];
        setCars(fallbackCars);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
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
        <NumberSearchBox />
        <BrandFilterBox />
        {cars.map((car, idx) => (
          <ListBox
            key={idx}
            carNumber={car.carNumber}
            brand={car.brand}
            model={car.model}
            status={car.status}
          />
        ))}
      </div>
      <div className={floatingStyles.floatingContainer}>
        <button className={floatingStyles.floatingButton}>+</button>
      </div>
    </>
  );
};

export default SearchBox;
