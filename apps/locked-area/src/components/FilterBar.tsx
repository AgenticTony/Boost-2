import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category: string;
  duration: string;
  targetGroup: string;
}

export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    duration: '',
    targetGroup: '',
  });

  const handleChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select
        className="border rounded p-2"
        value={filters.category}
        onChange={(e) => handleChange('category', e.target.value)}
      >
        <option value="">All categories</option>
        <option value="warmup">Warm-up</option>
        <option value="main">Main exercise</option>
        <option value="cooldown">Cool-down</option>
      </select>

      <select
        className="border rounded p-2"
        value={filters.duration}
        onChange={(e) => handleChange('duration', e.target.value)}
      >
        <option value="">Any duration</option>
        <option value="short">Short (≤5 min)</option>
        <option value="medium">Medium (5–15 min)</option>
        <option value="long">Long (&gt;15 min)</option>
      </select>

      <select
        className="border rounded p-2"
        value={filters.targetGroup}
        onChange={(e) => handleChange('targetGroup', e.target.value)}
      >
        <option value="">All groups</option>
        <option value="children">Children</option>
        <option value="youth">Youth</option>
        <option value="adults">Adults</option>
      </select>
    </div>
  );
};