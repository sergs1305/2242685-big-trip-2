import {EVENT_TYPES, MIN_OFFERS_COUNT, MAX_OFFERS_COUNT, MIN_OFFER_PRICE, MAX_OFFER_PRICE, OFFERS_TITLES} from './const.js';
import {getRandomInteger} from '../utils.js';

// заполнение массива mockAllOffers
const mockAllOffers = [];
let offerIdNumber = 1;
// EVENT_TYPES получить из данных!
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
  mockAllOffers.push({
    type: eventType,
    offers: offers,
  });
});

function getEventOffers(type) {
//возвращает массив (случайный набор предложений) offersIds для конкретного type
  const offers = mockAllOffers[mockAllOffers.findIndex((item) => item.type === type)].offers; //ищет элемент (объект) в массиве mockOffers по ключу type
  const offersIds = [];
  for (let i = 0; i < offers.length; i++) {
    if (getRandomInteger(0, 1) === 1) {
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

const allOffers = mockAllOffers;

export {allOffers, getEventOffers};
