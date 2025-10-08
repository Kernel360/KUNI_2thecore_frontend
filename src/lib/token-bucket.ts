// Token Bucket 알고리즘 기반 레이트 리미터 클래스
export class TokenBucket {
  private capacity: number; // 버킷 용량 (버스트 허용치)
  private tokens: number; // 현재 토큰 수
  private refillRate: number; // 초당 토큰 충전 비율
  private lastRefill: number; // 마지막 충전 시간

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity; // 초기에는 full
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  // 토큰 충전 (시간 경과에 따라)
  private refill(): void {
    const now = Date.now();
    const deltaSeconds = (now - this.lastRefill) / 1000;
    const tokensToAdd = deltaSeconds * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  // 토큰 소비 시도 (성공 시 true, 실패 시 false)
  tryConsume(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  // 다음 토큰이 사용 가능할 때까지의 시간(ms) 계산
  getWaitTime(tokens: number = 1): number {
    this.refill();

    if (this.tokens >= tokens) {
      return 0;
    }

    const tokensNeeded = tokens - this.tokens;
    return Math.ceil((tokensNeeded / this.refillRate) * 1000);
  }

  // 현재 사용 가능한 토큰 수
  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}
