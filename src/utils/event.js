import dayjs from 'dayjs';

function sortByDay(eventA, eventB) {
  //const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);
  return dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
}

function sortByTime(eventA, eventB) {
  return (eventA.dateTo - eventA.dateFrom) - (eventB.dateTo - eventB.dateFrom);
}

function sortByPrice (eventA, eventB) {
  return eventB.basePrice - eventA.basePrice; //возможно, с учётом стоимости offers
}

export {sortByDay, sortByTime, sortByPrice};
