import { useEffect } from 'react';

export default function KakaoMapScript() {
  useEffect(() => {
    // 이미 스크립트가 로드되었는지 확인
    if (document.querySelector('script[src*="dapi.kakao.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    
    // 스크립트 로딩 완료 이벤트 추가
    script.onload = () => {
      console.log('Kakao Maps SDK loaded successfully');
    };
    
    script.onerror = () => {
      console.error('Failed to load Kakao Maps SDK');
    };
    
    document.head.appendChild(script);

    return () => {
      // cleanup: 컴포넌트가 언마운트될 때 스크립트 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}
