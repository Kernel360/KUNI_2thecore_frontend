import { useEffect, useState } from 'react';

const MaxPage = 10; // 페이지 최대 사이즈

const useObserver = () => {
  const [page, setPage] = useState(1); // pagination을 위한 변수
  const [isFetching, setIsFetching] = useState(true); // Loading처리를 위한 변수
  const [lastIntersecting, setLastIntersecting] =
    useState<HTMLDivElement | null>(null); // 구독할 타켓 정보

  //observer 콜백함수
  const onIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      // 뷰 포트에 마지막 요소가 들어올 때,
      if (entry.isIntersecting) {
        // 페이지 최대가 넘어가지 않을 때
        if (page < MaxPage) {
          // page값에 1을 더하여 새 fetch 요청을 보내게됨
          setPage(prev => prev + 1);
          setIsFetching(true);
        }
        // 기존 타겟을 unobserve한다.
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    if (!lastIntersecting) return;
    //observer 인스턴스를 생성한 후 구독
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
    //observer 생성 시 observe할 target 요소는 배열의 마지막 타켓으로 지정
    observer.observe(lastIntersecting);

    return () => observer && observer.disconnect();
  }, [lastIntersecting, page]);

  // 사용할 hook state값 내보내기
  return { page, setPage, isFetching, setIsFetching, setLastIntersecting };
};

export default useObserver;