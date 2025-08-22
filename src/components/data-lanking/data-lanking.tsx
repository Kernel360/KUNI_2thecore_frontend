import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DashboardRanking,
  StatisticsService,
} from '@/services/statistics-service';
import { useEffect, useState } from 'react';

interface DataType {
  title: string;
  emoji: string;
  data: { rank: string; medal: string; value: string }[];
}

export default function DataLanking() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rankingData, setRankingData] = useState<DashboardRanking | null>(null);
  const [loading, setLoading] = useState(true);

  const medals = ['🥇', '🥈', '🥉'];
  const ranks = ['1위', '2위', '3위'];

  const getDataTypes = (): DataType[] => {
    if (!rankingData) return [];

    return [
      {
        title: '이달의 최다 운행 차량 TOP 3',
        emoji: '🏆',
        data: [
          {
            rank: ranks[0],
            medal: medals[0],
            value: rankingData.topCarModel.model1,
          },
          {
            rank: ranks[1],
            medal: medals[1],
            value: rankingData.topCarModel.model2,
          },
          {
            rank: ranks[2],
            medal: medals[2],
            value: rankingData.topCarModel.model3,
          },
        ],
      },
      {
        title: '이달의 최다 방문 지역 TOP 3',
        emoji: '🏆',
        data: [
          {
            rank: ranks[0],
            medal: medals[0],
            value: rankingData.topRegion.region1,
          },
          {
            rank: ranks[1],
            medal: medals[1],
            value: rankingData.topRegion.region2,
          },
          {
            rank: ranks[2],
            medal: medals[2],
            value: rankingData.topRegion.region3,
          },
        ],
      },
      {
        title: '이달의 최다 빌린 차급 TOP 3',
        emoji: '🏆',
        data: [
          {
            rank: ranks[0],
            medal: medals[0],
            value: rankingData.topCarType.type1,
          },
          {
            rank: ranks[1],
            medal: medals[1],
            value: rankingData.topCarType.type2,
          },
          {
            rank: ranks[2],
            medal: medals[2],
            value: rankingData.topCarType.type3,
          },
        ],
      },
    ];
  };

  const dataTypes = getDataTypes();

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const data = await StatisticsService.getDashboardRanking();
        setRankingData(data);
      } catch (error) {
        console.error('랭킹 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  useEffect(() => {
    if (dataTypes.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % dataTypes.length);
        setIsAnimating(false);
      }, 300);
    }, 1000);

    return () => clearInterval(interval);
  }, [dataTypes.length]);

  if (loading) {
    return (
      <div className="flex flex-row pt-5 pr-4 pl-4 pb-2 w-[98%] mx-auto">
        <Card className="flex-1 bg-white border-none shadow-md">
          <div className="flex flex-row items-center h-full justify-center">
            <div className="text-gray-500">데이터 로딩 중...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (!rankingData || dataTypes.length === 0) {
    return (
      <div className="flex flex-row pt-5 pr-4 pl-4 pb-2 w-[98%] mx-auto">
        <Card className="flex-1 bg-white border-none shadow-md">
          <div className="flex flex-row items-center h-full justify-center">
            <div className="text-gray-500">데이터를 불러올 수 없습니다.</div>
          </div>
        </Card>
      </div>
    );
  }

  const currentData = dataTypes[currentIndex];

  return (
    <div className="flex flex-row pt-5 pr-4 pl-4 pb-2 w-[98%] mx-auto">
      <Card className="flex-1 bg-white border-none shadow-md">
        <div className="flex flex-row items-center h-full">
          <CardHeader>
            <CardTitle
              className={`text-xl font-bold text-gray-800 whitespace-nowrap ml-5 transition-all duration-300 ${
                isAnimating
                  ? 'opacity-0 translate-x-[-10px]'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {currentData.emoji} {currentData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div
              className={`flex justify-end gap-20 mr-5 transition-all duration-300 ${
                isAnimating
                  ? 'opacity-0 translate-x-[10px]'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {currentData.data.map((item, index) => (
                <div key={index} className="flex flex-row items-center gap-4">
                  <span className="text-xl font-semibold text-gray-700">
                    {item.medal}
                    {item.rank}
                  </span>
                  <span className="text-lg text-gray-500">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
