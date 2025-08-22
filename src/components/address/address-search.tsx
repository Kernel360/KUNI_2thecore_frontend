import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { AddressSearchResult } from '@/types/address';
import styles from './address-search.module.css';

interface AddressSearchProps {
  onAddressSelect: (address: AddressSearchResult) => void;
  placeholder?: string;
  value?: string;
  required?: boolean;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  placeholder = '주소를 입력하세요',
  value = '',
  required = false,
}) => {
  const [query, setQuery] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const { results, loading, error, searchAddress, clearResults } = useAddressSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchAddress(query);
        setShowResults(true);
      } else {
        clearResults();
        setShowResults(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAddress, clearResults]);

  const handleAddressSelect = (address: AddressSearchResult) => {
    const displayAddress = address.road_address?.address_name || address.address_name;
    setQuery(displayAddress);
    setShowResults(false);
    onAddressSelect(address);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // 마우스가 결과 리스트 위에서 클릭 중이면 숨기지 않음
    if (!isMouseDown) {
      setTimeout(() => setShowResults(false), 50);
    }
  };

  return (
    <div className={styles.addressSearchContainer}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-gray-50/50 hover:bg-white"
        required={required}
      />
      
      {loading && (
        <div className={styles.loading}>
          검색 중...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {showResults && results.length > 0 && (
        <div 
          className={styles.resultsContainer}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div
                key={index}
                className={styles.resultItem}
                onClick={() => handleAddressSelect(result)}
              >
                <div className={styles.addressName}>
                  {result.road_address?.address_name || result.address_name}
                </div>
                {result.road_address && result.address_name !== result.road_address.address_name && (
                  <div className={styles.jibunAddress}>
                    지번: {result.address_name}
                  </div>
                )}
                <div className={styles.regionInfo}>
                  {result.address?.region_1depth_name} {result.address?.region_2depth_name} {result.address?.region_3depth_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResults && !loading && results.length === 0 && query.trim().length >= 2 && (
        <div className={styles.resultsContainer}>
          <div className={styles.noResults}>
            검색 결과가 없습니다
          </div>
        </div>
      )}
    </div>
  );
};