import dayjs from 'dayjs';

function sortByDay(eventA, eventB) {
  return dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
}

function sortByTime(eventA, eventB) {
  return (dayjs(eventB.dateTo) - dayjs(eventB.dateFrom)) - (dayjs(eventA.dateTo) - dayjs(eventA.dateFrom));
}

function sortByPrice (eventA, eventB) {
  return eventB.basePrice - eventA.basePrice;
}

export {sortByDay, sortByTime, sortByPrice};
