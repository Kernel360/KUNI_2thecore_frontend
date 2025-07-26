import React from 'react';
import NumberSearchBox from './number-search-box';
import BrandFilterBox from './filter-box';
import { Dropdown } from './dropdown';
import ListBox from './list-box/list-box';
import styles from './list-box/list-box.module.css';
import Status from './status';
import { Button } from '../ui/button';

const dummyCars = [
  {
    num: '12가 1234',
    brand: '현대',
    model: '소나타',
    location: '서울',
    status: '운행중',
  },
  {
    num: '23나 2345',
    brand: '기아',
    model: 'K5',
    location: '동작구',
    status: '대기중',
  },
  {
    num: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    location: '국민대',
    status: '수리중',
  },
  {
    num: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    location: '국민대',
    status: '수리중',
  },
  {
    num: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    location: '국민대',
    status: '수리중',
  },
  {
    num: '12가 1234',
    brand: '현대',
    model: '소나타',
    location: '서울',
    status: '운행중',
  },
  {
    num: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    location: '국민대',
    status: '수리중',
  },
  {
    num: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    location: '국민대',
    status: '수리중',
  },
  {
    num: '12가 1234',
    brand: '현대',
    model: '소나타',
    location: '서울',
    status: '운행중',
  },
  {
    num: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    location: '국민대',
    status: '수리중',
  },
  {
    num: '23나 2345',
    brand: '기아',
    model: 'K5',
    location: '동작구',
    status: '대기중',
  },
];

const SearchBox = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        justifyContent: 'center',
      }}
    >
      <NumberSearchBox />
      <BrandFilterBox />
      <Button
        style={{
          width: '80px',
          height: '44px',
          marginLeft: '0px',
          backgroundColor: '#0070f3',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        검색
      </Button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        {dummyCars.map((car, idx) => (
          <ListBox
            key={idx}
            num={car.num}
            brand={car.brand}
            model={car.model}
            location={car.location}
            status={car.status}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
