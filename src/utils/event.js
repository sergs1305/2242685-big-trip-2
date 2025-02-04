import dayjs from 'dayjs';
//import {mockEvents} from '../mock/event.js';

function sortByDay(eventA, eventB) {
  return dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
}

function sortByTime(eventA, eventB) {
  return (dayjs(eventB.dateTo) - dayjs(eventB.dateFrom)) - (dayjs(eventA.dateTo) - dayjs(eventA.dateFrom));
}

function sortByPrice (eventA, eventB) {
  return eventB.basePrice - eventA.basePrice; //возможно, с учётом стоимости offers
}

// получение уникального event.id вида 'e<num>'
// function getNewId () {
//   let maxIdNum = 0;

//   mockEvents.forEach((event) => {
//     maxIdNum = Math.max(maxIdNum, Number(event.id.slice(1)));
//   });

//   return String(maxIdNum + 1);
// }

export {sortByDay, sortByTime, sortByPrice};
