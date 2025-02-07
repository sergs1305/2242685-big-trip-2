import dayjs from 'dayjs';

function formatDate(date, dateFormat) {
  return dayjs(date).format(dateFormat);
}

function capitalizeFirstLetter(text) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export {formatDate, capitalizeFirstLetter};
