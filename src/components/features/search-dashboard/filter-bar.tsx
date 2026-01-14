import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { FilterConfig } from './types';

interface FilterBarProps<T> {
  filters: FilterConfig<T>[];
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onMultiToggle: (key: string, value: any) => void;
}

export function FilterBar<T>({ filters, filterValues, onFilterChange, onMultiToggle }: FilterBarProps<T>) {
  return (
    <>
      {filters.map((f) => {
        if (f.type === 'multi-select') {
          return (
            <div key={f.key as string} className="flex flex-wrap gap-1">
              {f.options?.map((opt) => {
                const selected = filterValues[f.key as string]?.includes(opt.value);
                return (
                  <Badge
                    key={opt.value}
                    variant={selected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => onMultiToggle(f.key as string, opt.value)}
                  >
                    {opt.label}
                  </Badge>
                );
              })}
            </div>
          );
        } else if (f.type === 'single-select') {
          return (
            <Select
              key={f.key as string}
              value={filterValues[f.key as string] || ''}
              onValueChange={(val) => onFilterChange(f.key as string, val)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                {f.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else if (f.type === 'boolean') {
          return (
            <div key={f.key as string} className="flex items-center gap-2">
              <label className="text-sm">{f.label}</label>
              <Switch
                checked={filterValues[f.key as string] || false}
                onCheckedChange={(checked) => onFilterChange(f.key as string, checked)}
              />
            </div>
          );
        }
        return null;
      })}
    </>
  );
}