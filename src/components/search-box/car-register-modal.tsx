import KakaoMapScript from '@/components/map/kakao-map-script';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useRef, useState } from 'react';
import styles from './place-search.module.css';

interface CarRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormData) => void;
}

// 주소 검색 결과 타입 정의
interface AddressSearchResult {
  id: string;
  placeName: string;
  roadAddress: string;
  jibunAddress: string;
  phone: string;
  x: string;
  y: string;
}

export interface CarFormData {
  brand: string;
  model: string;
  carYear: string;
  carType: string;
  carNumber: string;
  sumDist: string;
  lastLatitude: string;
  lastLongitude: string;
  selectedAddress?: string;
}

const CarRegisterModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CarRegisterModalProps) => {
  const [formData, setFormData] = useState<CarFormData>({
    brand: '',
    model: '',
    carYear: '',
    carType: '',
    carNumber: '',
    sumDist: '',
    lastLatitude: '',
    lastLongitude: '',
    selectedAddress: '',
  });

  // 주소 검색 관련 state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const psRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      brand: '',
      model: '',
      carYear: '',
      carType: '',
      carNumber: '',
      sumDist: '',
      lastLatitude: '',
      lastLongitude: '',
      selectedAddress: '',
    });
    setSearchKeyword('');
    setSearchResults([]);
    setShowResults(false);
    onClose();
  };

  const handleInputChange = (field: keyof CarFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      brand: '',
      model: '',
      carYear: '',
      carType: '',
      carNumber: '',
      sumDist: '',
      lastLatitude: '',
      lastLongitude: '',
      selectedAddress: '',
    });
    setSearchKeyword('');
    setSearchResults([]);
    setShowResults(false);
    onClose();
  };

  // Kakao Maps 초기화
  useEffect(() => {
    const initKakaoServices = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          psRef.current = new window.kakao.maps.services.Places();
          geocoderRef.current = new window.kakao.maps.services.Geocoder();
        });
      }
    };

    if (window.kakao) {
      initKakaoServices();
    } else {
      const checkKakao = setInterval(() => {
        if (window.kakao) {
          initKakaoServices();
          clearInterval(checkKakao);
        }
      }, 100);
    }
  }, []);

  // 주소 검색 함수
  const searchPlaces = (keyword: string) => {
    if (!keyword.trim() || !psRef.current) return;

    setIsSearching(true);
    psRef.current.keywordSearch(keyword, (data: any[], status: any) => {
      setIsSearching(false);

      if (status === window.kakao.maps.services.Status.OK) {
        const results: AddressSearchResult[] = data.map(place => ({
          id: place.id,
          placeName: place.place_name,
          roadAddress: place.road_address_name || place.address_name,
          jibunAddress: place.address_name,
          phone: place.phone || '',
          x: place.x,
          y: place.y,
        }));
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    });
  };

  // 검색 키워드 변경 핸들러 (debounce 적용)
  const handleSearchKeywordChange = (keyword: string) => {
    setSearchKeyword(keyword);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (keyword.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPlaces(keyword);
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // 주소 선택 핸들러
  const handleAddressSelect = (result: AddressSearchResult) => {
    if (!geocoderRef.current) return;

    // 주소를 좌표로 변환
    geocoderRef.current.addressSearch(
      result.roadAddress,
      (coords: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setFormData(prev => ({
            ...prev,
            lastLatitude: coords[0].y,
            lastLongitude: coords[0].x,
            selectedAddress: result.roadAddress,
          }));
          setSearchKeyword(result.roadAddress);
          setShowResults(false);
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div className="w-full max-w-lg transform transition-all duration-300 ease-out scale-100">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-md">
          <KakaoMapScript />
          <CardHeader
            className="text-center py-3 flex items-start justify-center border-b-2"
            style={{ borderImage: 'var(--main-gradient) 1' }}
          >
            <CardTitle className="text-2xl font-bold tracking-wide flex items-start justify-around gap-1">
              <span>🚗차량 등록</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="brand"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    차량 브랜드
                  </Label>
                  <Input
                    id="brand"
                    type="text"
                    placeholder="예: 현대, 기아, 삼성"
                    value={formData.brand}
                    onChange={e => handleInputChange('brand', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="model"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    모델명
                  </Label>
                  <Input
                    id="model"
                    type="text"
                    placeholder="예: 소나타, K5, 아반떼"
                    value={formData.model}
                    onChange={e => handleInputChange('model', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="carYear"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    차량 연식
                  </Label>
                  <Input
                    id="carYear"
                    type="text"
                    placeholder="예: 2023"
                    value={formData.carYear}
                    onChange={e => handleInputChange('carYear', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="carType"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    차종
                  </Label>
                  <Select
                    value={formData.carType}
                    onValueChange={value => handleInputChange('carType', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white">
                      <SelectValue placeholder="차종을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-xl">
                      <SelectItem
                        value="소형"
                        className="hover:bg-indigo-50 focus:bg-indigo-50"
                      >
                        소형
                      </SelectItem>
                      <SelectItem
                        value="중형"
                        className="hover:bg-indigo-50 focus:bg-indigo-50"
                      >
                        중형
                      </SelectItem>
                      <SelectItem
                        value="대형"
                        className="hover:bg-indigo-50 focus:bg-indigo-50"
                      >
                        대형
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="carNumber"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    차량번호
                  </Label>
                  <Input
                    id="carNumber"
                    type="text"
                    placeholder="예: 12가1234"
                    value={formData.carNumber}
                    onChange={e =>
                      handleInputChange('carNumber', e.target.value)
                    }
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white font-mono tracking-wider"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="sumDist"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    총 주행거리
                  </Label>
                  <Input
                    id="sumDist"
                    type="text"
                    placeholder="예: 45678 km"
                    value={formData.sumDist}
                    onChange={e => handleInputChange('sumDist', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="addressSearch"
                    className="text-base font-semibold text-gray-700 flex items-center gap-2"
                  >
                    위치
                  </Label>
                  <div className="relative">
                    <Input
                      id="addressSearch"
                      type="text"
                      placeholder="도로명 주소나 장소명을 입력하세요"
                      value={searchKeyword}
                      onChange={e => handleSearchKeywordChange(e.target.value)}
                      className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      required
                    />
                    {showResults && (
                      <div className={styles.placeSearchContainer}>
                        <div className={styles.resultsList}>
                          {isSearching ? (
                            <div className={styles.loading}>검색 중...</div>
                          ) : searchResults.length > 0 ? (
                            searchResults.map(result => (
                              <div
                                key={result.id}
                                className={styles.resultItem}
                                onClick={() => handleAddressSelect(result)}
                              >
                                <div className={styles.placeName}>
                                  {result.placeName}
                                </div>
                                <div className={styles.addressInfo}>
                                  <div className={styles.roadAddress}>
                                    {result.roadAddress}
                                  </div>
                                  {result.jibunAddress !==
                                    result.roadAddress && (
                                    <div className={styles.jibunAddress}>
                                      {result.jibunAddress}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={styles.noResults}>
                              검색 결과가 없습니다
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.selectedAddress && (
                    <div className="mt-2 text-sm text-gray-600">
                      {formData.selectedAddress}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                    style={{
                      background: 'var(--main-gradient)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        'var(--main-gradient-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--main-gradient)';
                    }}
                  >
                    등록
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarRegisterModal;
