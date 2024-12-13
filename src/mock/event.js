import {EVENT_TYPES, TOTAL_EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE, START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION, MIN_OFFERS_COUNT, MAX_OFFERS_COUNT, MIN_OFFER_PRICE, MAX_OFFER_PRICE, OFFERS_TITLES} from '../const.js';
import {getRandomArrayElement, getRandomInteger, getRandomDate} from '../utils.js';
import dayjs from 'dayjs';

const mockDestinations = [
  {
    id: 'd1',
    description: 'Sydney is the capital city of the state of New South Wales and the most populous city in Australia.',
    name: 'Sydney',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1920px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg',
        description: 'Jørn Utzon\'s Sydney Opera House, and the Harbour Bridge, two of Sydney\'s most famous landmarks, taken at late dusk. The Sydney Opera House is one of the most iconic buildings built in the 20th century (1973) and is UNESCO\'s world heritage.',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Bondi_1.jpg/1280px-Bondi_1.jpg',
        description: 'Bondi Beach',
      },
    ]
  },
  {
    id: 'd2',
    description: 'Melbourne is the capital and most populous city of the Australian state of Victoria, and the second-most populous city in Australia, after Sydney.',
    name: 'Melbourne',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Melburnian_Skyline_b.jpg/1280px-Melburnian_Skyline_b.jpg',
        description: 'Melbourne skyline',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Flinders_Street_Station_Melbourne_March_2021.jpg/1280px-Flinders_Street_Station_Melbourne_March_2021.jpg',
        description: 'Flinders Street Station in Melbourne with Eureka Tower and Australia 108 visible',
      },
    ]
  },
  {
    id: 'd3',
    description: 'Brisbane is the capital and largest city of the state of Queensland and the third-most populous city in Australia and Oceania, with a population over 2.7 million.',
    name: 'Brisbane',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Brisbane_CBD_from_Southbank_in_July_2024.jpg/1280px-Brisbane_CBD_from_Southbank_in_July_2024.jpg',
        description: 'Brisbane CBD from Southbank in July 2024',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Brisbane_City_Hall%2C_February_2023_%28cropped%29.jpg/800px-Brisbane_City_Hall%2C_February_2023_%28cropped%29.jpg',
        description: 'Brisbane City Hall, February 2023',
      },
    ]
  },
  {
    id: 'd4',
    description: 'Perth is the capital city of Western Australia.',
    name: 'Perth',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Perth_CBD_skyline_from_State_War_Memorial_Lookout%2C_2023%2C_04_b.jpg/1920px-Perth_CBD_skyline_from_State_War_Memorial_Lookout%2C_2023%2C_04_b.jpg',
        description: 'Perth CBD skyline from State War Memorial Lookout, 2023',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Perth_town_hall_march21_%28cropped%29.jpg/800px-Perth_town_hall_march21_%28cropped%29.jpg',
        description: 'Perth Town hall',
      },
    ]
  },
];

// заполнение массива mockOffers
const mockOffers = [];
let offerIdNumber = 1;
EVENT_TYPES.forEach((eventType) => {
  const offersCount = getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT);
  const offers = [];
  const offersTitles = OFFERS_TITLES.slice();
  for (let i = 0; i < offersCount; i++) {
    const offersTitlesElementNum = getRandomInteger(0, offersTitles.length - 1);
    offers.push({
      id: `o${offerIdNumber}`,
      title: offersTitles[offersTitlesElementNum],
      price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
    });
    offerIdNumber++;
    offersTitles.splice(offersTitlesElementNum, 1); //удаляем из массива использованный (присвоенный) элемент для исключения повторения
  }
  mockOffers.push({
    type: eventType,
    offers: offers,
  });
});
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
    destination: getRandomArrayElement(mockDestinations).id,
    isFavorite: false,
    offers: eventOffers,
    type: eventType,
  };
}

function getEventOffers(type) {
//возвращает массив (случайный набор предложений) offersIds для конкретного type
  const offers = mockOffers[mockOffers.findIndex((item) => item.type === type)].offers; //ищет элемент (объект) в массиве mockOffers по ключу type
  const offersIds = [];
  for (let i = 0; i < offers.length; i++) {
    if (getRandomInteger(0, 1) === 1) { //добавить?
      offersIds.push(offers[i].id);
    }
  }
  // offers.forEach((offer) => {
  //   if (getRandomInteger(0, 1)) { //добавить или нет
  //     offersIds.push(offer.id);
  //   }
  // });
  return offersIds;
}

function getRandomEvent() {
  return getRandomArrayElement(mockEvents);
}

export {getRandomEvent, mockDestinations, mockOffers};
