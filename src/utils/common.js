import dayjs from 'dayjs';

function formatDate(date, dateFormat) {
  return dayjs(date).format(dateFormat);
}

function capitalizeFirstLetter(str) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

export {formatDate, capitalizeFirstLetter};
