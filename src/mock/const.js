// --- constants for mock data ---
const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const OFFERS_TITLES = ['Order Uber', 'Add luggage', 'Private room', 'Add breakfast', 'Rent a car', 'Switch to comfort class', 'Add kangaroo meat', 'Choose seats', 'Add lunch', 'Add local wine'];
const TOTAL_EVENTS_COUNT = 5; //количество точек в массиве - справочнике (mockEvents)
const MIN_BASE_PRICE = 1000;
const MAX_BASE_PRICE = 1500;
const START_DATE = new Date('01/20/2025');
const END_DATE = new Date('01/31/2025');
const START_HOUR = 0;
const END_HOUR = 24;
const MIN_DURATION = 1000 * 60 * 60; //в миллисекундах (час)
const MAX_DURATION = 1000 * 60 * 60 * 24; //в миллисекундах (* 24 часа)
const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;
const MIN_OFFER_PRICE = 10;
const MAX_OFFER_PRICE = 100;

export {EVENT_TYPES, TOTAL_EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE,
  START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION,
  MIN_OFFERS_COUNT, MAX_OFFERS_COUNT, MIN_OFFER_PRICE, MAX_OFFER_PRICE, OFFERS_TITLES};
