# Kakao 주소 검색 및 좌표 변환 구현 가이드 (TypeScript + React)

## 1. 준비 단계

### 1.1 Kakao Developers 앱 등록
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 등록
3. `JavaScript 키`와 `REST API 키` 발급
4. 플랫폼 설정에서 사이트 도메인 추가

### 1.2 환경변수 설정
```bash
# .env.local
REACT_APP_KAKAO_JAVASCRIPT_KEY=your_javascript_key_here
REACT_APP_KAKAO_REST_API_KEY=your_rest_api_key_here
```

### 1.3 HTML에 스크립트 추가
```html
<!-- public/index.html의 head 태그 안에 추가 -->
<script 
  type="text/javascript" 
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%REACT_APP_KAKAO_JAVASCRIPT_KEY%&libraries=services&autoload=false"
></script>
```

## 2. 타입 정의

### 2.1 전역 타입 선언
```typescript
// src/types/kakao.d.ts
declare global {
  interface Window {
    kakao: any;
  }
}

// src/types/address.ts
export interface AddressSearchResult {
  address_name: string;
  address_type: 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';
  x: string; // longitude (경도)
  y: string; // latitude (위도)
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    h_code: string;
    b_code: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    x: string;
    y: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
    x: string;
    y: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: AddressSearchResult[];
}
```

## 3. API 서비스 구현

### 3.1 REST API 방식 (권장)
```typescript
// src/services/kakaoAddressService.ts
import axios from 'axios';
import { AddressSearchResponse, Coordinates } from '../types/address';

const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

export const searchAddressByKeyword = async (
  query: string
): Promise<AddressSearchResponse> => {
  try {
    const response = await axios.get(
      'https://dapi.kakao.com/v2/local/search/address.json',
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
        params: {
          query,
          analyze_type: 'similar', // 유사한 주소도 검색
          page: 1,
          size: 10,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('주소 검색 에러:', error);
    throw new Error('주소 검색에 실패했습니다.');
  }
};

export const getCoordinatesFromAddress = async (
  address: string
): Promise<Coordinates | null> => {
  try {
    const result = await searchAddressByKeyword(address);
    
    if (result.documents.length > 0) {
      const firstResult = result.documents[0];
      return {
        latitude: parseFloat(firstResult.y),
        longitude: parseFloat(firstResult.x),
      };
    }
    return null;
  } catch (error) {
    console.error('좌표 변환 에러:', error);
    return null;
  }
};
```

### 3.2 JavaScript SDK 방식 (지도가 있는 경우)
```typescript
// src/services/kakaoGeocodingService.ts
import { Coordinates } from '../types/address';

export const geocodeAddressWithSDK = (
  address: string
): Promise<Coordinates | null> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      reject(new Error('카카오맵 서비스가 로드되지 않았습니다.'));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        resolve({
          latitude: parseFloat(result[0].y),
          longitude: parseFloat(result[0].x),
        });
      } else {
        resolve(null);
      }
    });
  });
};
```

## 4. 커스텀 훅 구현

### 4.1 주소 검색 훅
```typescript
// src/hooks/useAddressSearch.ts
import { useState, useCallback } from 'react';
import { AddressSearchResult } from '../types/address';
import { searchAddressByKeyword } from '../services/kakaoAddressService';

export const useAddressSearch = () => {
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await searchAddressByKeyword(query);
      setResults(response.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주소 검색 실패');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchAddress,
    clearResults,
  };
};
```

### 4.2 지오코딩 훅
```typescript
// src/hooks/useGeocoding.ts
import { useState, useCallback } from 'react';
import { Coordinates } from '../types/address';
import { getCoordinatesFromAddress } from '../services/kakaoAddressService';

export const useGeocoding = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await getCoordinatesFromAddress(address);
      
      if (coords) {
        setCoordinates(coords);
      } else {
        setError('주소를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '좌표 변환 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    coordinates,
    loading,
    error,
    geocodeAddress,
  };
};
```

## 5. React 컴포넌트 구현

### 5.1 주소 검색 컴포넌트
```tsx
// src/components/AddressSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAddressSearch } from '../hooks/useAddressSearch';
import { AddressSearchResult } from '../types/address';

interface AddressSearchProps {
  onAddressSelect: (address: AddressSearchResult) => void;
  placeholder?: string;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  placeholder = '주소를 입력하세요",
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, error, searchAddress, clearResults } = useAddressSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchAddress(query);
        setShowResults(true);
      } else {
        clearResults();
        setShowResults(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAddress, clearResults]);

  const handleAddressSelect = (address: AddressSearchResult) => {
    setQuery(address.address_name);
    setShowResults(false);
    onAddressSelect(address);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // 결과 리스트 클릭을 위한 지연
    setTimeout(() => setShowResults(false), 150);
  };

  return (
    <div className="address-search-container" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
        }}
      />
      
      {loading && (
        <div className="loading" style={{ padding: '8px', textAlign: 'center' }}>
          검색 중...
        </div>
      )}

      {error && (
        <div className="error" style={{ padding: '8px', color: 'red', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {showResults && results.length > 0 && (
        <ul
          className="address-results"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {results.map((result, index) => (
            <li
              key={index}
              onClick={() => handleAddressSelect(result)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'white';
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{result.address_name}</div>
              {result.road_address && (
                <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  도로명: {result.road_address.address_name}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 5.2 메인 컴포넌트
```tsx
// src/components/LocationSelector.tsx
import React, { useState } from 'react';
import { AddressSearch } from './AddressSearch';
import { useGeocoding } from '../hooks/useGeocoding';
import { AddressSearchResult, Coordinates } from '../types/address';

interface LocationData {
  address: string;
  coordinates: Coordinates;
  fullAddressInfo: AddressSearchResult;
}

export const LocationSelector: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const { coordinates, loading, error, geocodeAddress } = useGeocoding();

  const handleAddressSelect = async (addressResult: AddressSearchResult) => {
    const coords: Coordinates = {
      latitude: parseFloat(addressResult.y),
      longitude: parseFloat(addressResult.x),
    };

    const locationData: LocationData = {
      address: addressResult.address_name,
      coordinates: coords,
      fullAddressInfo: addressResult,
    };

    setSelectedLocation(locationData);
    
    // 서버로 전송하는 예시
    await sendLocationToServer(locationData);
  };

  const sendLocationToServer = async (locationData: LocationData) => {
    try {
      // 서버 API 호출 예시
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: locationData.address,
          latitude: locationData.coordinates.latitude,
          longitude: locationData.coordinates.longitude,
          // 필요한 추가 정보들
          roadAddress: locationData.fullAddressInfo.road_address?.address_name,
          region1: locationData.fullAddressInfo.address.region_1depth_name,
          region2: locationData.fullAddressInfo.address.region_2depth_name,
          region3: locationData.fullAddressInfo.address.region_3depth_name,
        }),
      });

      if (response.ok) {
        console.log('위치 정보가 서버에 저장되었습니다.');
      } else {
        console.error('서버 저장 실패');
      }
    } catch (error) {
      console.error('서버 전송 오류:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>위치 선택</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <AddressSearch 
          onAddressSelect={handleAddressSelect}
          placeholder="주소를 입력하세요 (예: 강남역, 서울시 강남구...)"
        />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          좌표 변환 중...
        </div>
      )}

      {error && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {selectedLocation && (
        <div 
          style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            padding: '20px',
            marginTop: '20px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h3>선택된 위치 정보</h3>
          <p><strong>주소:</strong> {selectedLocation.address}</p>
          <p><strong>위도:</strong> {selectedLocation.coordinates.latitude}</p>
          <p><strong>경도:</strong> {selectedLocation.coordinates.longitude}</p>
          
          {selectedLocation.fullAddressInfo.road_address && (
            <p><strong>도로명 주소:</strong> {selectedLocation.fullAddressInfo.road_address.address_name}</p>
          )}
          
          <p><strong>지역 정보:</strong></p>
          <ul style={{ marginLeft: '20px' }}>
            <li>시도: {selectedLocation.fullAddressInfo.address.region_1depth_name}</li>
            <li>구군: {selectedLocation.fullAddressInfo.address.region_2depth_name}</li>
            <li>동면: {selectedLocation.fullAddressInfo.address.region_3depth_name}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
```

### 5.3 App.tsx
```tsx
// src/App.tsx
import React, { useEffect } from 'react';
import { LocationSelector } from './components/LocationSelector';

function App() {
  useEffect(() => {
    // Kakao SDK 로드 확인
    const checkKakaoSDK = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('Kakao Maps SDK loaded successfully');
        });
      } else {
        console.warn('Kakao Maps SDK not loaded');
      }
    };

    // 스크립트 로드 대기
    setTimeout(checkKakaoSDK, 1000);
  }, []);

  return (
    <div className="App">
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Kakao 주소 검색 및 좌표 변환</h1>
      </header>
      <main>
        <LocationSelector />
      </main>
    </div>
  );
}

export default App;
```

## 6. 사용법 정리

1. **자동완성 주소 입력**: 사용자가 주소를 입력하면 실시간으로 검색 결과 표시
2. **정확한 주소 선택**: 드롭다운에서 정확한 주소를 선택하도록 유도
3. **좌표 자동 변환**: 선택된 주소를 자동으로 위도/경도로 변환
4. **서버 전송**: 검증된 주소와 좌표를 서버로 전송

## 7. 주요 특징

- ✅ TypeScript로 타입 안전성 확보
- ✅ REST API 방식으로 안정적인 검색 (지도 없이도 동작)
- ✅ 실시간 자동완성으로 UX 개선
- ✅ 디바운싱으로 불필요한 API 호출 방지
- ✅ 에러 처리 및 로딩 상태 관리
- ✅ 재사용 가능한 컴포넌트 구조

이 구조로 구현하면 사용자가 이상한 주소를 입력하는 것을 효과적으로 방지하고, 정확한 좌표 정보를 서버로 전송할 수 있습니다.