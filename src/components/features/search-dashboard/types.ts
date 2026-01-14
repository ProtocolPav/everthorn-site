export type FilterType = 'multi-select' | 'single-select' | 'boolean';

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  type: FilterType;
  options?: { value: any; label: string }[];
}

export interface SortOption {
  value: string;
  label: string;
}