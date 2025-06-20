interface WeekRange {
  start: Date;
  end: Date;
  weekString: string;
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
  const weekNumber = getWeekNumber(startOfWeek);
  const weekString = `${year}-W${weekNumber.toString().padStart(2, '0')}`;

  return {
    start: startOfWeek,
    end: endOfWeek,
    weekString,
  };
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
} 