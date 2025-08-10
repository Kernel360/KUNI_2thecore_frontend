import { Car } from '@/lib/api';
import { CarService } from '@/services/car-service';
import BrandFilterBox from './filter-box';
import floatingStyles from './floating.module.css';
import ListBox from './list-box/list-box';
import NumberSearchBox from './number-search-box';

const SearchBox = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'운행' | '대기' | '점검' | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await CarService.getAllCars(1, 7); // 첫 번째 페이지, 50개
        setCars(carData.content);
      } catch (error) {
        console.error('차량 목록 조회 실패:', error);
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
            status: '점검',
          },
        ];
        setCars(fallbackCars);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCarRegister = async (data: CarFormData) => {
    try {
      // CarFormData를 백엔드 API 형식으로 변환
      const carData = {
        brand: data.brand,
        model: data.model,
        carYear: parseInt(data.carYear.replace('년', '')), // "2023년" -> 2023
        carType: data.carType,
        carNumber: data.carNumber,
        sumDist: parseFloat(data.sumDist.replace(/[,\s]/g, '').replace('km', '')) // "45,678 km" -> 45678.0
      };

      const response = await CarService.createCar(carData);
      console.log('차량 등록 성공:', response);

      // 차량 목록 새로고침
      await refreshCarList();

      alert('차량이 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('차량 등록 실패:', error);
      alert('차량 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const refreshCarList = async () => {
    try {
      const carData_refresh = await CarService.getAllCars(1, 50);
      setCars(carData_refresh.content);
    } catch (error) {
      console.error('차량 목록 새로고침 실패:', error);
    }
  };

  const handleFilterResults = (filteredCars: Car[]) => {
    setCars(filteredCars);
  };

  const handleSearchResults = (searchResults: Car[]) => {
    setCars(searchResults);
  };

  const handleStatusChange = (status: '운행' | '대기' | '점검' | null) => {
    setSelectedStatus(status);
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
        <NumberSearchBox onSearchResults={handleSearchResults} />
        <BrandFilterBox 
          onFilterResults={handleFilterResults} 
          onStatusChange={handleStatusChange}
        />
        {cars.map((car, idx) => (
          <ListBox
            key={idx}
            carNumber={car.carNumber}
            brand={car.brand}
            model={car.model}
            status={car.status}
            onDelete={refreshCarList}
          />
        ))}
      </div>
      <div className={floatingStyles.floatingContainer}>
        <button
          className={floatingStyles.floatingButton}
          onClick={handleModalOpen}
        >
          +
        </button>
      </div>
      <CarRegisterModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCarRegister}
      />
    </>
  );
};

export default SearchBox;
