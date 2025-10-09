import { useState, useCallback } from 'react';
import { AddressSearchResult } from '../types/address';
import { searchAddressByKeyword } from '../services/kakaoAddressService';

export const useAddressSearch = () => {
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await searchAddressByKeyword(query);
      setResults(response.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주소 검색 실패');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchAddress,
    clearResults,
  };
};