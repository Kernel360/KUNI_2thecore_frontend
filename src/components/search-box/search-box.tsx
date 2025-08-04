import React from 'react';
import NumberSearchBox from './number-search-box';
import BrandFilterBox from './filter-box';
import ListBox from './list-box/list-box';
import floatingStyles from './floating.module.css';

const dummyCars = [
  {
    carNumber: '12가 1234',
    brand: '현대',
    model: '소나타',
    status: '운행중',
  },
  {
    carNumber: '23나 2345',
    brand: '기아',
    model: 'K5',
    status: '대기중',
  },
  {
    carNumber: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    status: '수리중',
  },
  {
    carNumber: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    status: '수리중',
  },
  {
    carNumber: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    status: '수리중',
  },
  {
    carNumber: '12가 1234',
    brand: '현대',
    model: '소나타',
    status: '운행중',
  },
  {
    carNumber: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    status: '수리중',
  },
  {
    carNumber: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    status: '수리중',
  },
  {
    carNumber: '12가 1234',
    brand: '현대',
    model: '소나타',
    status: '운행중',
  },
  {
    carNumber: '34라 3456',
    brand: '삼성',
    model: 'SM5',
    status: '수리중',
  },
  {
    carNumber: '23나 2345',
    brand: '기아',
    model: 'K5',
    status: '대기중',
  },
];

const SearchBox = () => {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <NumberSearchBox />
        <BrandFilterBox />
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
              carNumber={car.carNumber}
              brand={car.brand}
              model={car.model}
              status={car.status}
            />
          ))}
        </div>
      </div>
      <div className={floatingStyles.floatingContainer}>
        <button className={floatingStyles.floatingButton}>+</button>
      </div>
    </>
  );
};

export default SearchBox;
