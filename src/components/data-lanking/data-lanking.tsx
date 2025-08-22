import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface DataType {
  title: string;
  emoji: string;
  data: { rank: string; medal: string; value: string }[];
}

export default function DataLanking() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const dataTypes: DataType[] = [
    {
      title: '이달의 최다 운행 차량 TOP 3',
      emoji: '🏆',
      data: [
        { rank: '1위', medal: '🥇', value: '12가 1234' },
        { rank: '2위', medal: '🥈', value: '23나 5678' },
        { rank: '3위', medal: '🥉', value: '34다 9012' },
      ],
    },
    {
      title: '이달의 최다 방문 지역 TOP 3',
      emoji: '📍',
      data: [
        { rank: '1위', medal: '🥇', value: '강남구' },
        { rank: '2위', medal: '🥈', value: '서초구' },
        { rank: '3위', medal: '🥉', value: '송파구' },
      ],
    },
    {
      title: '이달의 최다 빌린 차급 TOP 3',
      emoji: '🚗',
      data: [
        { rank: '1위', medal: '🥇', value: '중형차' },
        { rank: '2위', medal: '🥈', value: '소형차' },
        { rank: '3위', medal: '🥉', value: '대형차' },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dataTypes.length);
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [dataTypes.length]);

  const currentData = dataTypes[currentIndex];

  return (
    <div className="flex flex-row pt-5 pr-4 pl-4 pb-2 w-[98%] mx-auto">
      <Card className="flex-1 bg-white border-none shadow-md">
        <div className="flex flex-row items-center h-full">
          <CardHeader>
            <CardTitle 
              className={`text-xl font-bold text-gray-800 whitespace-nowrap ml-5 transition-all duration-300 ${
                isAnimating ? 'opacity-0 translate-x-[-10px]' : 'opacity-100 translate-x-0'
              }`}
            >
              {currentData.emoji} {currentData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div 
              className={`flex justify-end gap-20 mr-5 transition-all duration-300 ${
                isAnimating ? 'opacity-0 translate-x-[10px]' : 'opacity-100 translate-x-0'
              }`}
            >
              {currentData.data.map((item, index) => (
                <div key={index} className="flex flex-row items-center gap-4">
                  <span className="text-xl font-semibold text-gray-700">
                    {item.medal}{item.rank}
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
