// --- constants for mock data ---
const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const OFFERS_TITLES = ['Carry luggage', 'Order Uber', 'Add luggage', 'Separate compartment', 'Add breakfast', 'Rent a car', 'Switch to comfort class', 'Add kangaroo meat', 'Choose seats', 'Add lunch', 'Add local wine'];
const TOTAL_EVENTS_COUNT = 5; //количество точек в массиве - справочнике (mockEvents)
const MIN_BASE_PRICE = 1000;
const MAX_BASE_PRICE = 1500;
const START_DATE = new Date();
const END_DATE = new Date('01/30/2025');
const START_HOUR = 0;
const END_HOUR = 24;
const MIN_DURATION = 1000 * 60 * 60; //в миллисекундах (час)
const MAX_DURATION = 1000 * 60 * 60 * 24; //в миллисекундах (* 5 часов)
const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;
const MIN_OFFER_PRICE = 10;
const MAX_OFFER_PRICE = 100;
// --- ---
const EVENT_EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm'; //'18/03/19 12:25'
const EVENT_VIEW_DAY_FORMAT = 'MMM DD'; //'MAR 18' (месяц - прописные!)
const EVENT_VIEW_TIME_FORMAT = 'HH:mm'; //'14:30'
const EVENT_VIEW_DURATION_TIME_FORMAT = 'HH[H] mm[M]'; //'01H 35M'

export {EVENT_TYPES, TOTAL_EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE, START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION, MIN_OFFERS_COUNT, MAX_OFFERS_COUNT, MIN_OFFER_PRICE, MAX_OFFER_PRICE, OFFERS_TITLES,
  EVENT_EDIT_DATE_FORMAT, EVENT_VIEW_DAY_FORMAT, EVENT_VIEW_TIME_FORMAT, EVENT_VIEW_DURATION_TIME_FORMAT};
