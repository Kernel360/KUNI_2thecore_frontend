import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAddressFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  const NEXT_PUBLIC_KAKAO_MAP_API_KEY = '카카오RESTAPI키';
  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${NEXT_PUBLIC_KAKAO_MAP_API_KEY}` },
  });
  const data = await res.json();
  return data.documents?.[0]?.address?.address_name || '';
}
