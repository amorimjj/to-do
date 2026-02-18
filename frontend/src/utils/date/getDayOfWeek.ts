type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

const days: Array<DayOfWeek> = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

export const getDayOfWeek = (dateString: string): DayOfWeek => {
  const date = new Date(dateString);
  return days[date.getDay()];
};
