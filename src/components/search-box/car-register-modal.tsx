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
import { AddressSearch } from '@/components/common/address-search';
import { AddressSearchResult, Coordinates } from '@/types/address';
import { getCoordinatesFromAddress } from '@/services/kakaoAddressService';
import { useState } from 'react';

interface CarRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormData) => void;
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
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

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
    setGeocodingError(null);
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
    setGeocodingError(null);
    onClose();
  };

  // 주소 선택 핸들러
  const handleAddressSelect = async (result: AddressSearchResult) => {
    setIsGeocodingLoading(true);
    setGeocodingError(null);

    try {
      // 표시할 주소는 도로명 주소 우선
      const displayAddress = result.road_address?.address_name || result.address_name;
      
      // 역지오코딩: 선택된 주소 문자열을 좌표로 변환
      const coordinates = await getCoordinatesFromAddress(displayAddress);
      
      if (!coordinates) {
        throw new Error('주소를 좌표로 변환할 수 없습니다.');
      }

      setFormData(prev => ({
        ...prev,
        lastLatitude: coordinates.latitude.toString(),
        lastLongitude: coordinates.longitude.toString(),
        selectedAddress: displayAddress,
      }));
    } catch (error) {
      setGeocodingError(error instanceof Error ? error.message : '주소 변환 중 오류가 발생했습니다.');
      console.error('주소 변환 오류:', error);
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div className="w-full max-w-md transform transition-all duration-300 ease-out scale-100">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-md max-h-[100vh]">
          <CardHeader
            className="text-center py-3 flex items-start justify-center border-b-2"
            style={{ borderImage: 'var(--main-gradient) 1' }}
          >
            <CardTitle className="font-bold tracking-wide flex items-start justify-around">
              <span>🚗차량 등록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="brand"
                    className="font-semibold text-gray-700 flex items-center"
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
                    className="font-semibold text-gray-700 flex items-center"
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
                    className="font-semibold text-gray-700 flex items-center"
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
                    className="font-semibold text-gray-700 flex items-center"
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
                    className="font-semibold text-gray-700 flex items-center"
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
                    className="font-semibold text-gray-700 flex items-center"
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
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    위치
                  </Label>
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    placeholder="주소를 입력하세요 (예: 서울시 강남구 테헤란로)"
                    value={formData.selectedAddress || ''}
                    required
                  />
                  {isGeocodingLoading && (
                    <div className="mt-2 text-sm text-blue-600">
                      좌표 변환 중...
                    </div>
                  )}
                  {geocodingError && (
                    <div className="mt-2 text-sm text-red-600">
                      {geocodingError}
                    </div>
                  )}
                  {formData.selectedAddress && formData.lastLatitude && formData.lastLongitude && (
                    <div className="mt-2 text-xs text-gray-500">
                      위도: {formData.lastLatitude}, 경도: {formData.lastLongitude}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
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
