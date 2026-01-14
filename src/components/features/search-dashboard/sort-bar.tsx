import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SortOption } from './types';

interface SortBarProps {
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
}

export function SortBar({ sortOptions, sortValue, onSortChange }: SortBarProps) {
  return (
    <Select value={sortValue} onValueChange={onSortChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}