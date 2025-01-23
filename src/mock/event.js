import {EVENT_TYPES, TOTAL_EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE, START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION} from './const.js';
import {getRandomArrayElement, getRandomInteger, getRandomDate} from '../utils/common.js';
import dayjs from 'dayjs';
import {destinations} from './destinations.js';
import {getEventOffers} from './offers.js';

//заполнение массива mockEvents
const mockEvents = [];
for (let i = 0; i < TOTAL_EVENTS_COUNT; i++) {
  const eventType = getRandomArrayElement(EVENT_TYPES);
  const eventOffers = getEventOffers(eventType); //в зависимости от type
  //формат даты: "2019-07-10T22:55:56.845Z" 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
  const dateFrom = getRandomDate(START_DATE, END_DATE, START_HOUR, END_HOUR);
  const dateFromStr = dayjs(dateFrom).toISOString();
  const dateTo = dateFrom.getTime() + getRandomInteger(MIN_DURATION, MAX_DURATION); //в миллисекундах; д.б. позднее dateFrom
  const dateToStr = dayjs(dateTo).toISOString();
  mockEvents[i] = {
    id: `e${i}`,
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: dateFromStr,
    dateTo: dateToStr,
    destination: getRandomArrayElement(destinations).id,
    isFavorite: getRandomInteger(0, 1) === 1, // false/true
    offers: eventOffers,
    type: eventType,
  };
}

// function getRandomEvent() {
//   return getRandomArrayElement(mockEvents);
// }

export {mockEvents};
