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
  });

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
    });
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
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>차량 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="brand">차량 브랜드</Label>
                  <Input
                    id="brand"
                    type="text"
                    placeholder="예: 현대, 기아, 삼성"
                    value={formData.brand}
                    onChange={e => handleInputChange('brand', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="model">모델명</Label>
                  <Input
                    id="model"
                    type="text"
                    value={formData.model}
                    onChange={e => handleInputChange('model', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="carYear">차량 연식</Label>
                  <Input
                    id="carYear"
                    type="text"
                    placeholder="예: 2023"
                    value={formData.carYear}
                    onChange={e => handleInputChange('carYear', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="carType">차종</Label>
                  <Select
                    value={formData.carType}
                    onValueChange={value => handleInputChange('carType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="차종을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="소형">소형</SelectItem>
                      <SelectItem value="중형">중형</SelectItem>
                      <SelectItem value="대형">대형</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="carNumber">차량번호</Label>
                  <Input
                    id="carNumber"
                    type="text"
                    placeholder="예: 12가 1234"
                    value={formData.carNumber}
                    onChange={e =>
                      handleInputChange('carNumber', e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sumDist">총 주행거리</Label>
                  <Input
                    id="sumDist"
                    type="text"
                    placeholder="예: 45678 km"
                    value={formData.sumDist}
                    onChange={e => handleInputChange('sumDist', e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 text-white"
                    style={{
                      background: 'var(--main-gradient)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--main-gradient-hover)';
                    }}
                    onMouseLeave={(e) => {
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
