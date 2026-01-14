import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { FilterBar } from './filter-bar';
import { SortBar } from './sort-bar';
import type { FilterConfig, SortOption } from './types';

interface SearchDashboardProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  filters: FilterConfig<T>[];
  sortOptions: SortOption[];
  onFilteredDataChange: (filteredData: T[]) => void;
}

export function SearchDashboard<T>({
  data,
  searchKeys,
  filters,
  sortOptions,
  onFilteredDataChange,
}: SearchDashboardProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [sortValue, setSortValue] = useState(sortOptions[0]?.value || '');

  // Initialize filterValues
  useEffect(() => {
    const initial: Record<string, any> = {};
    filters.forEach((f) => {
      if (f.type === 'multi-select') initial[f.key as string] = [];
      else if (f.type === 'single-select') initial[f.key as string] = '';
      else if (f.type === 'boolean') initial[f.key as string] = false;
    });
    setFilterValues(initial);
  }, [filters]);

  // Process data
  const processedData = useMemo(() => {
    let filtered = data;

    // Search
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filters
    filters.forEach((f) => {
      const val = filterValues[f.key as string];
      if (f.type === 'multi-select' && val.length > 0) {
        filtered = filtered.filter((item) => val.includes(item[f.key]));
      } else if (f.type === 'single-select' && val) {
        filtered = filtered.filter((item) => item[f.key] === val);
      } else if (f.type === 'boolean' && val) {
        filtered = filtered.filter((item) => !!item[f.key]);
      }
    });

    // Sort
    if (sortValue) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortValue as keyof T];
        const bVal = b[sortValue as keyof T];
        if (typeof aVal === 'string') return (aVal as string).localeCompare(bVal as string);
        return (aVal as number) - (bVal as number);
      });
    }

    return filtered;
  }, [data, searchTerm, filterValues, sortValue, searchKeys, filters]);

  useEffect(() => {
    onFilteredDataChange(processedData);
  }, [processedData, onFilteredDataChange]);

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiToggle = (key: string, value: any) => {
    setFilterValues((prev) => {
      const current = prev[key] || [];
      const newArr = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: newArr };
    });
  };

  const clearAll = () => {
    setSearchTerm('');
    const reset: Record<string, any> = {};
    filters.forEach((f) => {
      if (f.type === 'multi-select') reset[f.key as string] = [];
      else if (f.type === 'single-select') reset[f.key as string] = '';
      else if (f.type === 'boolean') reset[f.key as string] = false;
    });
    setFilterValues(reset);
    setSortValue(sortOptions[0]?.value || '');
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FilterBar
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onMultiToggle={handleMultiToggle}
      />
      <SortBar sortOptions={sortOptions} sortValue={sortValue} onSortChange={setSortValue} />
      <Button variant="outline" onClick={clearAll}>
        Clear
      </Button>
    </div>
  );
}