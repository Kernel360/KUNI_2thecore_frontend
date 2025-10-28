import { TokenBucket } from '@/lib/token-bucket';
import { useCallback, useRef } from 'react';

// React Hook으로 Token Bucket 레이트 리미터 사용
export function useTokenBucketRateLimiter(
  capacity: number,
  refillRate: number
) {
  const bucketRef = useRef<TokenBucket>(new TokenBucket(capacity, refillRate));

  const tryExecute = useCallback(
    (callback: () => void, tokens: number = 1): boolean => {
      if (bucketRef.current.tryConsume(tokens)) {
        callback();
        return true;
      } else {
        // 토큰 부족으로 실행 실패
        if (process.env.NODE_ENV === 'development') {
          const waitTime = bucketRef.current.getWaitTime(tokens);
          console.warn(
            `레이트 리미터: 토큰 부족 (${waitTime}ms 후 재시도 가능)`
          );
        }
        return false;
      }
    },
    []
  );

  const getStatus = useCallback(() => {
    return {
      availableTokens: bucketRef.current.getAvailableTokens(),
      capacity,
      refillRate,
    };
  }, [capacity, refillRate]);

  return { tryExecute, getStatus };
}
