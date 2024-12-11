const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const TOTAL_EVENTS_COUNT = 5;
const MIN_BASE_PRICE = 1000;
const MAX_BASE_PRICE = 1500;
const START_DATE = new Date();
const END_DATE = new Date('01/30/2025');
const START_HOUR = 0;
const END_HOUR = 24;
const MIN_DURATION = 1000 * 60 * 60; //в миллисекундах (час)
const MAX_DURATION = 1000 * 60 * 60 * 5; //в миллисекундах
const MIN_OFFERS_COUNT = 1;
const MAX_OFFERS_COUNT = 5;
const MIN_OFFER_PRICE = 10;
const MAX_OFFER_PRICE = 100;
const OFFERS_TITLES = ['Carry luggage', 'Order Uber', 'Add luggage', 'Separate compartment', 'Add breakfast', 'Rent a car', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Add lunch', 'Add wine'];

export {EVENT_TYPES, TOTAL_EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE, START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION, MIN_OFFERS_COUNT, MAX_OFFERS_COUNT, MIN_OFFER_PRICE, MAX_OFFER_PRICE, OFFERS_TITLES};
