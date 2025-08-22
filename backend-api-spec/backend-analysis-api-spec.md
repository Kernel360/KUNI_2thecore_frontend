1.1 월별/계절별 선호도 분석

- Method: GET
- Path: /api/analysis/preference-by-period
- 상태: 완료
- 설명: 렌트카 브랜드 및 모델의 월별/계절별 선호도를 종합적으로 분석하고 시각화
  이미지를 제공합니다.

Request Parameters

{
"year": string (optional), // 분석할 연도 (예: "2024")
"period_type": string // 분석 기간 타입 ("month" | "season")
}

Request Example

GET /api/analysis/preference-by-period?year=2024&period_type=season

Response

{
"success": boolean, // 분석 성공 여부
"message": string, // 처리 결과 메시지
"visualizations": {
"brand_period_heatmap": string, // Base64 인코딩된 히트맵 이미지
"market_share_pie": string, // Base64 인코딩된 파이차트 이미지
"brand_preference_line": string, // Base64 인코딩된 라인차트 이미지
"seasonality_radar": string, // Base64 인코딩된 레이더차트 이미지 (계절 분석시)  
 "seasonality_strength_bar": string, // Base64 인코딩된 계절성 강도 차트
"statistical_comparison": string // Base64 인코딩된 통계 비교 차트
}
}

Response Example (성공)

{
"success": true,
"message": "계절별 선호도 분석이 성공적으로 완료되었습니다.",
"visualizations": {
"brand_period_heatmap": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC  
 AgIfAhkiAAAAAlwSFlzAAAPYQAAD2EBqD+naQAAACBjSFJNAAB6JgAAgIQAAPoAAACA...",
"market_share_pie": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQICAgIf  
 AhkiAAAAAlwSFlzAAAPYQAAD2EBqD+naQAAACBjSFJNAAB6JgAAgIQAAPoAAACA...",
"brand_preference_line": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQI  
 CAgIfAhkiAAAAAlwSFlzAAAPYQAAD2EBqD+naQAAACBjSFJNAAB6JgAAgIQAAPoAAACA...",
"seasonality_radar": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQICAgI  
 fAhkiAAAAAlwSFlzAAAPYQAAD2EBqD+naQAAACBjSFJNAAB6JgAAgIQAAPoAAACA...",
"seasonality_strength_bar": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCS  
 VQICAgIfAhkiAAAAAlwSFlzAAAPYQAAD2EBqD+naQAAACBjSFJNAAB6JgAAgIQAAPoAAACA...",
"statistical_comparison": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQ  
 ICAgIfAhkiAAAAAlwSFlzAAAPYQAAD2EBqD+naQAAACBjSFJNAAB6JgAAgIQAAPoAAACA..."
}
}

Response Example (실패)

{
"success": false,
"message": "분석할 데이터가 없습니다. 연도나 기간 타입을 확인해주세요.",
"visualizations": {}
}

Response Example (파라미터 오류)

{
"success": false,
"message": "period_type은 'month' 또는 'season' 중 하나여야 합니다.",
"visualizations": {}
}
