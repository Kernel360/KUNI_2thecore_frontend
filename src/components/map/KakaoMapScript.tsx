'use client';

import Script from 'next/script';

export default function KakaoMapScript() {
    return (
        <Script
            type="text/javascript"
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_API_KEY}&libraries=services,clusterer&autoload=false`}
            strategy="beforeInteractive"
        />
    );
} 