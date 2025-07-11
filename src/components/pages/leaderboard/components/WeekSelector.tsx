'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type IsoWeek } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';

type WeekSelectorProps = {
  weeks: IsoWeek[];
  currentWeek: IsoWeek;
  selectedWeek: IsoWeek;
};

export function WeekSelector({ weeks, currentWeek, selectedWeek }: WeekSelectorProps) {
  const router = useRouter();

  const handleWeekChange = (week: IsoWeek) => {
    router.push(`/leaderboard?week=${week}`);
  };

  return (
    <Select value={selectedWeek} onValueChange={handleWeekChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a week" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={currentWeek}>Current Week</SelectItem>
        {weeks
          .filter((week) => week !== currentWeek)
          .map((week) => (
            <SelectItem key={week} value={week}>
              {week}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
} 