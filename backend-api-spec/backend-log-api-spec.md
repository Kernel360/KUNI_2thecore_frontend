# 백엔드 API 명세서 - 로그 관련 API

## 서버 정보

- **차량 전체**: Port 8080

## 공통 Request Header

```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pblVzZXIxIiwicm9sZXMiOlsiQURNSU4iLCJVU0VSIl0sImlhdCI6MTY3ODkwNTYwMCwiZXhwIjoxNjc4OTA5MjAwfQ.some_very_long_jwt_string
```

## 공통 응답 포맷

### 성공 응답

- **200 OK**: 요청 성공 (가장 일반적)
- **201 Created**: 리소스가 성공적으로 생성됨 (POST 요청 시)
- **204 No Content**: 요청은 성공했지만 응답 본문에 보낼 내용이 없음 (DELETE 요청 시)

### 오류 응답

```json
{
  "result": false,
  "message": "에러에 대한 설명 메세지",
  "data": null
}
```

#### 오류 상태 코드

- **400 Bad Request**: 클라이언트 요청이 잘못됨 (유효성 검사 실패 등)
- **401 Unauthorized**: 인증되지 않은 요청 (유효한 인증 자격 증명이 없음)
- **403 Forbidden**: 인증되었지만 해당 리소스에 접근할 권한이 없음
- **404 Not Found**: 요청한 리소스를 찾을 수 없음
- **409 Conflict**: 리소스 상태가 요청과 충돌함 (예: 중복된 ID로 회원가입 시도)
- **500 Internal Server Error**: 서버 내부 오류
- **503 Service Unavailable**: 서버가 일시적으로 요청을 처리할 수 없음

## 3. 로그 관련 API

### 3.1 차량 주행 기록 조회

- **Method**: GET
- **Path**: `/api/drivelogs`
- **상태**: 완료
- **request**: {
  carNumber?: string; // 차량 번호
  status?: string; // 차량 상태 (ex: 운행, 대기, 수리)
  brand?: string; // 브랜드명
  model?: string; // 모델명
  startTime?: LocalDate; // 주행 시작 날짜 ("2025-08-15")
  endTime?: LocalDate; // 주행 종료 날짜 ("2025-08-16")
  twoParam?: boolean // 브랜드 + 모델명 길이가 2가 아닌 경우 false
  // 대신 길이가 0인 경우는 true
  page?: Integer // 몇번째 페이지를 불러올것인지
  offset?: Integer // 한 페이지에 데이터를 몇개를 불러올 것인지
  sortBy?: String // 어떤 조건을 기준으로 정렬 할 것인지
  // 조건의 종류는 : carNumber, startTime, endTime
  // brand, model, startPoint, endPoint, driveDist, status
  // status는 대기, 수리, 운행 순으로 오름차순 내림차순을 진행한다.
  // default는 startTime이다.
  sortOrder?: String // 오름차순 혹은 내림차순
  // 정렬 방식은 ASC, DESC 이며 default는 ASC이다.
  }
- **request example**: X
- **response**:{"result": true,
  "message": "메세지"
  "data": {
  "totalElements": "쿼리의 결과로 나온 튜플 수",
  "totalPages": "전체 페이지",
  "first": "첫번째 페이지인지",
  "last": "마지막 페이지인지",
  "size": ",
  "content": [
  {
  "carNumber": "차량번호",
  "brand": "차량브랜드",
  "model": "차량모델명",
  "startTime": "주행시작시간",
  "endTime": "주행종료시간",
  "startPoint": "주행시작위치",
  "endPoint": "주행종료위치",
  "driveDist": "주행거리",
  "status": "차량상태",
  "memo": "주행기록 간의 메모"
  }
  ],
  "pageable": "페이지네이션객체"{
  "pageNumber": "서버상의 현재 페이지넘버",
  "pageSize": "페이지 크기"
  "sort": { "정렬여부"
  "empty": "페이지가 비어있는지"
  "sorted": "정렬여부",
  "unsorted": "비정렬여부"
  },
  "offset": "전체 페이지 내에서 현재 페이지 시작 인덱스"
  "paged": "페이지 적용 여부"
  "unpaged": "페이지 비적용 여부"

      },
      "last": "마지막 페이지인지",
      "totalPages": "전체 페이지수"
      "totalElements": "전체 데이터수"
      "first": "첫번째 페이지인지",
      "size": "한페이지 내의 데이터수",
      "number": "서버상의 현재 페이지수"
      "sort": { //위와 동일
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "numberOfElements": 5,
      "empty": false

  }
  }

- **response example**:{
  "result": true,
  "message": null,
  "data": {
  "content": [
  {
  "carNumber": "12가1233",
  "brand": "기아",
  "model": "소나타",
  "startTime": "2025-08-08",
  "endTime": "2025-08-08",
  "startPoint": "서울역",
  "endPoint": "강남역",
  "driveDist": 15000,
  "status": "대기"
  },
  {
  "carNumber": "12가1234",
  "brand": "현대",
  "model": "아이오닉",
  "startTime": "2025-08-08",
  "endTime": "2025-08-08",
  "startPoint": "서울역",
  "endPoint": "강남역",
  "driveDist": 15000,
  "status": "대기"
  },
  {
  "carNumber": "12가1234",
  "brand": "현대",
  "model": "아이오닉",
  "startTime": "2025-08-08",
  "endTime": "2025-08-08",
  "startPoint": "서울역",
  "endPoint": "강남역",
  "driveDist": 15000,
  "status": "대기"
  },
  {
  "carNumber": "12가1234",
  "brand": "현대",
  "model": "아이오닉",
  "startTime": "2025-08-08",
  "endTime": "2025-08-08",
  "startPoint": "서울역",
  "endPoint": "강남역",
  "driveDist": 15000,
  "status": "대기"
  },
  {
  "carNumber": "12가1234",
  "brand": "현대",
  "model": "아이오닉",
  "startTime": "2025-08-08",
  "endTime": "2025-08-08",
  "startPoint": "서울역",
  "endPoint": "강남역",
  "driveDist": 15000,
  "status": "대기"
  }
  ],
  "pageable": {
  "pageNumber": 0,
  "pageSize": 10,
  "sort": {
  "empty": true,
  "sorted": false,
  "unsorted": true
  },
  "offset": 0,
  "paged": true,
  "unpaged": false
  },
  "last": true,
  "totalElements": 5,
  "totalPages": 1,
  "first": true,
  "size": 10,
  "number": 0,
  "sort": {
  "empty": true,
  "sorted": false,
  "unsorted": true
  },
  "numberOfElements": 5,
  "empty": false
  }
  }


### 3.3 시동 로그

- **Method**: POST
- **Path**: `/api/logs/power`
- **설명**: 애뮬레이터 전원 ON/OFF 로그 및 GPS 정보를 서버로 전송하는 API
- **상태**: 진행 중
- **request**:// 모두 필수!!
  {
  "carNumber": string,
  "loginId": string,
  "powerStatus": string
  }
- **request example**:
  {
  "carNumber" : "12가3456",
  "loginId": "test",
  "powerStatus" : "ON" // "ON" or "OFF"
  }
- **response**:{
  "result": boolean,
  "message": string,
  "data": {
  "carNumber" : string,
  "loginId" : string,
  "powerStatus" : string
  }
  }
- **response example**:{
  "result": true,
  "message": "시동 로그가 성공적으로 저장되었습니다.",
  "data": {
  "car_number" : "12가3456",
  "login_id" : "test",
  "power_status" : "ON" // "ON" or "OFF"
  }
  }

### 3.4 GPS 로그 수신 (프론트 사용 X)

- **Method**: POST
- **Path**: `/api/logs/gps`
- **설명**: 애뮬레이터에서 보낸 GPS 좌표 리스트를 서버에 저장
- **상태**: 완료
- **request**:{
  "carNumber" : "차량 번호",
  "loginId": "로그인ID",
  "startTime" : "로그 collect 시작시간",
  "endTime" : "로그 collect 종료시간"
  "locations": [ // 위치 좌표 리스트
  {
  "latitude": "위도",
  "longitude": "경도",
  "timestamp": "해당 로그의 timestamp"
  }
  ]
  }
- **response**:{
  "result": true,
  "message": "성공메세지",
  "data": {
  "carNumber": "차량번호",
  "start_time" : "로그 collect 시작시간",
  "end_time" : "로그 collect 종료시간"
  }
  }

### 3.5 드라이브 로그 엑셀 다운로드

- **Method**: GET
- **Path**: `/api/drivelogs/excel`
- **설명**: 조건에 맞는 운행 기록을 Excel 파일(`.xlsx`)로 다운로드
- **상태**: 완료

- **request & response**:
```json
{
  "request": {
    "carNumber": "차량 번호",                 // 선택
    "status": "운행 상태",                    // 선택 (예: 운행, 정지)
    "brand": "차량 브랜드",                   // 선택
    "model": "차량 모델",                     // 선택
    "startTime": "조회 시작일 (yyyy-MM-dd)",  // 선택
    "endTime": "조회 종료일 (yyyy-MM-dd)",    // 선택
    "twoParam": true,                         // 선택 (추가 조건 여부)
    "sortBy": "정렬 기준 필드",               // 선택
    "sortOrder": "asc 또는 desc"              // 선택
  },
  "response": {
    "headers": {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=drive_logs.xlsx"
    },
    "body": "Excel(.xlsx) 파일 바이너리 데이터"
  }
}


