import dummyCarsMock from './dummyCarsMock.json';
import BrandFilterBox from './filter-box';
import floatingStyles from './floating.module.css';
import ListBox from './list-box/list-box';
import NumberSearchBox from './number-search-box';

const dummyCars = dummyCarsMock as Array<{
  carNumber: string;
  brand: string;
  model: string;
  status: string;
}>;

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
          width: '95%',
          position: 'relative',
        }}
      >
        <NumberSearchBox />
        <BrandFilterBox />
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
      <div className={floatingStyles.floatingContainer}>
        <button className={floatingStyles.floatingButton}>+</button>
      </div>
    </>
  );
};

export default SearchBox;
