import {createElement} from '../render.js';
import {EVENT_VIEW_DATE_FORMAT, EVENT_VIEW_DAY_FORMAT, EVENT_VIEW_TIME_FORMAT} from '../const.js';
import {formatDate, capitalizeFirstLetter} from '../utils.js';
import {destinations} from '../mock/destinations.js';
import {allOffers} from '../mock/offers.js';
import dayjs from 'dayjs';

function getOfferById (type, offerId) {
  const offersByType = allOffers[allOffers.findIndex((item) => item.type === type)].offers; //массив предложений для конкретного type
  const offerIndex = offersByType.findIndex((item) => item.id === offerId);
  return offerIndex > -1 ? offersByType[offerIndex] : '';
}

function createEventTemplate(event) {
  const {basePrice, dateFrom, dateTo, destination, type, offers: selectedOffers, isFavorite} = event; //id,
  const eventDate = formatDate(dateFrom, EVENT_VIEW_DATE_FORMAT);
  const dayFrom = formatDate(dateFrom, EVENT_VIEW_DAY_FORMAT).toUpperCase();
  const timeFrom = formatDate(dateFrom, EVENT_VIEW_TIME_FORMAT);
  const timeTo = formatDate(dateTo, EVENT_VIEW_TIME_FORMAT);
  const durationHours = dayjs(dateTo).diff(dateFrom, 'h');
  const durationMinuts = Math.round(dayjs(dateTo).diff(dateFrom, 'm', true) % 60);
  const eventDuration = `${durationHours}H ${durationMinuts}M`;
  const destinationName = destinations[destinations.findIndex((item) => item.id === destination)].name;
  const isEventFavoriteBtnActive = isFavorite ? 'event__favorite-btn--active' : '';

  // eslint-disable-next-line no-unused-vars
  let selectedOffersTemplate = '';
  //итерация по массиву выбранных предложений (selectedOffers)
  selectedOffers.forEach((offerId) => {
    selectedOffersTemplate += `
      <li class="event__offer">
        <span class="event__offer-title">${getOfferById(type, offerId).title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${getOfferById(type, offerId).price}</span>
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

            ${selectedOffersTemplate}

          </ul>
          <button class="event__favorite-btn ${isEventFavoriteBtnActive}" type="button">
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
