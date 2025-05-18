import { format, formatDistance, formatRelative, isToday, isYesterday } from 'date-fns';

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM d, yyyy');
};

export const formatDateTime = (date: string): string => {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string): string => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }
  
  return formatRelative(dateObj, new Date());
};

export const formatTimeAgo = (date: string): string => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const getProgressPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};