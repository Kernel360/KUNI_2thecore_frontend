import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignUpData) => void;
}

export interface SignUpData {
  loginId: string;
  password: string;
  name: string;
  email: string;
  birthdate: string;
  phoneNumber: string;
  brn: string; // 사업자 등록 번호(Business Registration Number)
  companyName: string;
}

const SignUpModal = ({ isOpen, onClose, onSubmit }: SignUpProps) => {
  const [formData, setFormData] = useState<SignUpData>({
    loginId: '',
    password: '',
    name: '',
    email: '',
    birthdate: '',
    phoneNumber: '',
    brn: '',
    companyName: '',
  });

  const [duplicateCheck, setDuplicateCheck] = useState({
    checked: false,
    available: false,
    loading: false,
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      loginId: '',
      password: '',
      name: '',
      email: '',
      birthdate: '',
      phoneNumber: '',
      brn: '',
      companyName: '',
    });
    onClose();
  };

  const handleInputChange = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 아이디 입력이 변경되면 중복확인 상태 초기화
    if (field === 'loginId') {
      setDuplicateCheck({
        checked: false,
        available: false,
        loading: false,
        message: ''
      });
    }
  };

  const handleDuplicateCheck = async () => {
    if (!formData.loginId.trim()) {
      setDuplicateCheck(prev => ({
        ...prev,
        message: '아이디를 입력해주세요.'
      }));
      return;
    }

    setDuplicateCheck(prev => ({ ...prev, loading: true, message: '' }));

    // UI 시연용 시뮬레이션
    setTimeout(() => {
      const isAvailable = !['admin', 'test', 'user'].includes(formData.loginId.toLowerCase());
      
      setDuplicateCheck({
        checked: true,
        available: isAvailable,
        loading: false,
        message: isAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'
      });
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      loginId: '',
      password: '',
      name: '',
      email: '',
      birthdate: '',
      phoneNumber: '',
      brn: '',
      companyName: '',
    });
    onClose();
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
              <span>회원 가입 신청서</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="model"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    아이디 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="model"
                      type="text"
                      placeholder="아이디를 입력해주세요"
                      value={formData.loginId}
                      onChange={e => handleInputChange('loginId', e.target.value)}
                      className="flex-1 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDuplicateCheck}
                      disabled={duplicateCheck.loading || !formData.loginId.trim()}
                      className="whitespace-nowrap h-10 px-3 text-sm"
                    >
                      {duplicateCheck.loading ? '확인 중...' : '중복확인'}
                    </Button>
                  </div>
                  {duplicateCheck.message && (
                    <div className={`text-sm ${
                      duplicateCheck.available ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {duplicateCheck.message}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="carYear"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    비밀번호 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="carYear"
                    type="text"
                    placeholder="비밀번호를 입력해주세요"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="name"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    관리자 이름
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="성함을 입력해주세요"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="carNumber"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    이메일
                  </Label>
                  <Input
                    id="carNumber"
                    type="text"
                    placeholder="예: ooo@oooo.com"
                    value={formData.email}
                    onChange={e =>
                      handleInputChange('email', e.target.value)
                    }
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white tracking-wider"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="sumDist"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    생년월일
                  </Label>
                  <Input
                    id="sumDist"
                    type="text"
                    placeholder="예: 1000-10-10"
                    value={formData.birthdate}
                    onChange={e => handleInputChange('birthdate', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="sumDist"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    휴대폰 번호
                  </Label>
                  <Input
                    id="sumDist"
                    type="text"
                    placeholder="예: 010-0000-0000"
                    value={formData.phoneNumber}
                    onChange={e => handleInputChange('phoneNumber', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="sumDist"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    사업자 등록 번호
                  </Label>
                  <Input
                    id="sumDist"
                    type="text"
                    placeholder="예: 000-00-00000"
                    value={formData.brn}
                    onChange={e => handleInputChange('brn', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="sumDist"
                    className="font-semibold text-gray-700 flex items-center"
                  >
                    렌트카 업체명
                  </Label>
                  <Input
                    id="sumDist"
                    type="text"
                    placeholder="예: 2theCore"
                    value={formData.companyName}
                    onChange={e => handleInputChange('companyName', e.target.value)}
                    className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
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

export default SignUpModal;
