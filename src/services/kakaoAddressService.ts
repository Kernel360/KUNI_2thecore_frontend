import axios from 'axios';
import { AddressSearchResponse, Coordinates } from '../types/address';

// 환경변수에서 카카오 API 키 가져오기 (기존 지도 API 키 재사용)
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

/**
 * 카카오 주소 검색 API를 사용해 주소를 검색합니다
 * @param query 검색할 주소 키워드
 * @returns 검색 결과
 */
export const searchAddressByKeyword = async (
  query: string
): Promise<AddressSearchResponse> => {
  try {
    if (!KAKAO_REST_API_KEY) {
      throw new Error('VITE_KAKAO_MAP_API_KEY가 설정되지 않았습니다.');
    }

    // 현재 도메인을 동적으로 감지
    const currentOrigin = window.location.origin;
    
    const response = await axios.get(
      'https://dapi.kakao.com/v2/local/search/address.json',
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          'KA': `sdk/1.0 os/javascript lang/ko-KR device/WebBrowser origin/${currentOrigin}`, // 브라우저 환경을 위한 KA 헤더
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

/**
 * 주소를 위도/경도 좌표로 변환합니다
 * @param address 변환할 주소
 * @returns 좌표 정보 (실패 시 null)
 */
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