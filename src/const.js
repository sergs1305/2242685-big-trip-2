const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const EVENTS_COUNT = 5;
const MIN_BASE_PRICE = 1000;
const MAX_BASE_PRICE = 1500;
const START_DATE = new Date();
const END_DATE = new Date('01/30/2025');
const START_HOUR = 0;
const END_HOUR = 24;
const MIN_DURATION = 1000 * 60 * 60; //в миллисекундах (час)
const MAX_DURATION = 1000 * 60 * 60 * 5; //в миллисекундах

export {EVENT_TYPES, EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE, START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION};
