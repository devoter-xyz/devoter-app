import { START_WEEK } from './constants';

export type IsoWeek = `${string}-W${string}`;

interface WeekRange {
  start: Date;
  end: Date;
  weekString: string;
}

export function getWeeks(): IsoWeek[] {
  const [startYear, startWeekNum] = START_WEEK.split('-W').map(Number);

  const weeks: IsoWeek[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { weekString: currentWeekString } = getCurrentWeek();
  const [_, currentWeekNum] = currentWeekString.split('-W').map(Number);


  if (currentYear < startYear) {
    return [];
  }

  let year = startYear;
  let week = startWeekNum;

  while(year < currentYear || (year === currentYear && week <= currentWeekNum)) {
    weeks.push(`${year}-W${String(week).padStart(2, '0')}` as IsoWeek);
    week++;
    // A year has 52 or 53 weeks. This is a simplification.
    // A better approach would be to check the week number of the last day of the year.
    const lastDayOfYear = new Date(year, 11, 31);
    const lastWeekOfYearString = getWeek(lastDayOfYear);
    const [__, lastWeekOfYear] = lastWeekOfYearString.split('-W').map(Number);
    if (week > lastWeekOfYear) {
      week = 1;
      year++;
    }
  }

  return weeks;
}

export function getCurrentWeek(): WeekRange {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  // Format week string as YYYY-Www (e.g., 2024-W23)
  const year = startOfWeek.getFullYear();
  const weekString = getWeek(startOfWeek);

  return {
    start: startOfWeek,
    end: endOfWeek,
    weekString,
  };
}

export function getWeek(date: Date): string {
  const year = date.getUTCFullYear();
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
} 