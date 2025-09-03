1.1 월별/계절별 선호도 분석

- Method: GET
- Path: /analysis/period
- 상태: 완료
- 설명: 렌트카 브랜드 및 모델의 월별/계절별 선호도를 종합적으로 분석하고 시각화
  이미지를 제공합니다.

Request Parameters(쿼리파라미터)

{
"year": string (optional), // 분석할 연도 (예: "2024")
"period_type": string // 분석 기간 타입 ("month" | "season")
}

Request Example

GET /analysis/period?year=2024&period_type=season

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

1.2 연도별 차량 선호 트렌드 분석

- Method: GET
- Path: /analysis/trend

Request Parameters(쿼리파라미터){
"start_year"?: integer //분석 시작 연도 (예: 2020) 디폴트: 2020
"end_year"?: integer //분석 종료 연도 (예: 2025) 디폴트: 2025
"top_n"?: integer //분석할 상위 모델 개수 (1~20) 디폴트: 5}

Request example
GET /analysis/trend?start_year=2022&end_year=2024&top_n=3

response
{
"success": boolean, // 분석 성공 여부
"message": string, // 처리 결과 메시지
"visualizations": {
"brand_trend_lines": string, // Base64 인코딩된 브랜드별 시장 점유율 트렌드 라인 차트
"model_ranking_change": string, // Base64 인코딩된 상위 모델 트렌드 변화 차트
"car_age_preference": string, // Base64 인코딩된 차량 연식별 선호도 트렌드 차트
"market_share_evolution": string, // Base64 인코딩된 브랜드별 변동성 및 성장률 차트
"trend_summary": string // Base64 인코딩된 브랜드별 트렌드 요약 차트
}
}

response example
{
"success": true,
"message": "2022-2024 연도별 트렌드 분석이 완료되었습니다.",
"visualizations": {
"brand_trend_lines": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC ...",
"model_ranking_change": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC ...",
"car_age_preference": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC ...",
"market_share_evolution": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC ...",
"trend_summary": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC ..."
}
}

or

{
"success": false,
"message": "분석할 데이터가 없습니다.",
"visualizations": {}
}

or

{
"success": false,
"message": "시작 연도는 종료 연도보다 작아야 합니다.",
"visualizations": {}
}

1.3 일별 운행차량 수 예측

설명: 특정 기간 동안의 일별 운행 차량 대수를 분석하고, 다항 회귀 모델을 사용하여 미래의 운행 대수를 예측합니다. 분석 결과와 예측을 포함한 시각화 이미지를 제공합니다.

- Method: GET
- Path: /forecast/daily

Request Parameters(쿼리파라미터){
"start_date"?: string //분석 시작일 (예: "2024-01-01")
"end_date"?: string //분석 종료일 (예: "2024-03-31")
"forecast_days"?: integer //예측할 기간(일). 1~30일 사이. 기본값: 7}

Request example
GET /api/forecast/daily?start_date=2024-01-01&end_date=2024-01-31&forecast_days=14

response
{
"success": boolean,
"message": string,
"visualizations": {
"usage_trend_with_prediction": string,
"weekday_pattern": string
},
"historical_data": [
{
"date": string,
"unique_cars": integer,
"total_trips": integer,
"total_distance": float
}
],
"predictions": [
{
"date": string,
"predicted_unique_cars": float
}
],
"weekday_patterns": {
"0": float,
"1": float,
"2": float,
"3": float,
"4": float,
"5": float,
"6": float
},
"model_accuracy": {
"r2": float,
"mae": float
}
}
response example
{
"success": true,
"message": "일별 운행량 예측이 완료되었습니다.",
"visualizations": {
"usage_trend_with_prediction": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC...",
"weekday_pattern": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC..."
},
"historical_data": [
{"date": "2024-01-30", "unique_cars": 180, "total_trips": 300, "total_distance": 6200.0},
{"date": "2024-01-31", "unique_cars": 185, "total_trips": 310, "total_distance": 6300.0}
],
"predictions": [
{"date": "2024-02-01", "predicted_unique_cars": 188.71},
{"date": "2024-02-02", "predicted_unique_cars": 190.15}
],
"weekday_patterns": {
"0": 170.5,
"1": 175.2,
"2": 172.1,
"3": 178.9,
"4": 200.5,
"5": 210.0,
"6": 195.8
},
"model_accuracy": {
"r2": 0.875,
"mae": 12.54
}
}

or

{
"success": false,
"message": "분석할 데이터가 없습니다.",
"visualizations": {}
}

or

{
"success": false,
"message": "forecast_days는 1~30 사이여야 합니다.",
"visualizations": {}
}

1.4 지역별 수요 클러스터링 분석

설명: 운행 기록의 위치 데이터를 클러스터링하여 수요가 집중되는 지역을 식별합니다. 분석 결과를 바탕으로 서비스 부족 지역을 찾아내고, 신규 렌터카 영업소 위치를 추천합니다.

- Method: GET
- Path: /clustering/regions

Request Parameters(쿼리파라미터){
"start_date"?: string // 분석 시작일 (예: "2024-01-01")
"end_date"?: string // 분석 종료일 (예: "2024-12-31")
"k"?: integer // K-Means 클러스터링의 군집 수(k). 1~50 사이. 기본값: 5
"method"?: string // 사용할 클러스터링 알고리즘. "kmeans" 또는 "dbscan". 기본값: "kmeans"
"use_end_points"?: boolean // true이면 도착지를, false이면 출발지를 기준으로 분석. 기본값: true
"threshold_km"?: float // 수요 중심점으로부터 이 거리(km) 내에 차량이 없으면 서비스 부족 지역으로 판단. 기본값: 5.0
"min_trips"?: integer // 클러스터로 인정하기 위한 최소 운행 횟수. 기본값: 5
"eps_km"?: float // DBSCAN 알고리즘의 탐색 반경(km). 기본값: 1.0}

response
{
"success": true,
"message": "지역 클러스터링이 완료되었습니다.",
"visualizations": {
"cluster_map": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC...",
"recommendation_map": "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABHNCSVQIC..."
},
"cluster_summary": [
{
"cluster_id": 0,
"trip_count": 120,
"unique_cars": 30,
"avg_distance": 15.5,
"total_distance": 1860.0,
"center_lat": 37.5665,
"center_lng": 126.9780,
"importance_score": 68.4
}
],
"importance_ranking": [
{
"cluster_id": 0,
"trip_count": 120,
"unique_cars": 30,
"avg_distance": 15.5,
"total_distance": 1860.0,
"center_lat": 37.5665,
"center_lng": 126.9780,
"importance_score": 68.4
}
],
"underserved_areas": [
{
"lat": 37.5124,
"lon": 127.1023,
"min_distance_km": 6.2
}
],
"current_coverage": {
"covered_ratio": 0.75,
"centers": [
{
"lat": 37.5665,
"lon": 126.9780,
"nearest_km": 1.2,
"covered": true
}
]
}
}

or

{
"success": false,
"message": "클러스터링할 위치 데이터가 없습니다.",
"visualizations": {}
}

or

{
"success": false,
"message": "k는 1~50 사이여야 합니다.",
"visualizations": {}
}
