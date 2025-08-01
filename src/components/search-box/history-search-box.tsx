'use client';

import { FromCalendar } from './calendar/from-calendar';
import { ToCalendar } from './calendar/to-calendar';
import BrandFilterBox from './filter-box';
import NumberSearchBox from './number-search-box';

const HistorySearchBox = () => {
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
        <FromCalendar />
        <ToCalendar />
      </div>
    </>
  );
};

export default HistorySearchBox;
