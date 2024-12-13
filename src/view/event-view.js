import {createElement} from '../render.js';
import {EVENT_VIEW_DATE_FORMAT, EVENT_VIEW_DAY_FORMAT, EVENT_VIEW_TIME_FORMAT, EVENT_VIEW_DURATION_TIME_FORMAT} from '../const.js';
import {formatDate, capitalizeFirstLetter} from '../utils.js';
import {mockDestinations, mockOffers} from '../mock/event.js';

function getOfferTitleById (type, offerId) {
  const offersByType = mockOffers[mockOffers.findIndex((item) => item.type === type)].offers; //массив предложений для конкретного type
  const offerIndex = offersByType.findIndex((item) => item.id === offerId);
  return offerIndex > -1 ? offersByType[offerIndex].title : '';
}

function getOfferPriceById(type, offerId) {
  const offersByType = mockOffers[mockOffers.findIndex((item) => item.type === type)].offers; //массив предложений для конкретного type
  const offerIndex = offersByType.findIndex((item) => item.id === offerId);
  return offerIndex > -1 ? offersByType[offerIndex].price : '';
}

function createEventTemplate(event) {
  const {basePrice, dateFrom, dateTo, destination, type, offers} = event; //id, isFavorite,
  const eventDate = formatDate(dateFrom, EVENT_VIEW_DATE_FORMAT);
  const dayFrom = formatDate(dateFrom, EVENT_VIEW_DAY_FORMAT).toUpperCase();
  const timeFrom = formatDate(dateFrom, EVENT_VIEW_TIME_FORMAT);
  const timeTo = formatDate(dateTo, EVENT_VIEW_TIME_FORMAT);
  const eventDuration = formatDate(new Date(new Date(dateTo) - new Date(dateFrom)), EVENT_VIEW_DURATION_TIME_FORMAT);
  console.log('dateTo:', dateTo, 'new Date(dateTo):', new Date(dateTo));
  console.log('dateFrom:', dateFrom, 'new Date(dateFrom):', new Date(dateFrom));
  console.log('new Date(dateTo) - new Date(dateFrom):', new Date(dateTo) - new Date(dateFrom), 'new Date(new Date(dateTo) - new Date(dateFrom)):', new Date(new Date(dateTo) - new Date(dateFrom)));
  const destinationName = mockDestinations[mockDestinations.findIndex((item) => item.id === destination)].name;
  let selectedOffersHtml = '';
  //итерация по массиву выбранных предложений (offers)
  offers.forEach((offerId) => {
    selectedOffersHtml += `
    <li class="event__offer">
      <span class="event__offer-title">${getOfferTitleById(type, offerId)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${getOfferPriceById(type, offerId)}</span>
    </li>
    `;
  });

  return (
    `<li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${eventDate}">${dayFrom}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${capitalizeFirstLetter(type)} ${destinationName}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime=${dateFrom}>${timeFrom}</time>
              &mdash;
              <time class="event__end-time" datetime=${dateTo}>${timeTo}</time>
            </p>
            <p class="event__duration">${eventDuration}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">

            ${selectedOffersHtml}

          </ul>
          <button class="event__favorite-btn event__favorite-btn--active" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
  );
}

export default class EventView {
  constructor({event}) {
    this.event = event;
  }

  getTemplate() {
    return createEventTemplate(this.event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
