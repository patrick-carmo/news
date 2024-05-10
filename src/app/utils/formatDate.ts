import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  const today = new Date();

  const days = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  switch (true) {
    case years > 0:
      return `${years} ano(s)`;
    case months > 0:
      return `${months} mês`;
    case days > 0:
      return `${days} dia(s)`;
    default:
      return format(date, 'HH:mm');
  }
};
