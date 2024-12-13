import {createElement} from '../render.js';
import {EVENT_TYPES, EVENT_EDIT_DATE_FORMAT} from '../const.js';
import {formatDate, capitalizeFirstLetter, lastWord} from '../utils.js';
import {mockDestinations, mockOffers} from '../mock/event.js';

function createEditFormTemplate (event) {
  const {basePrice, dateFrom, dateTo, type, destination, offers} = event; //id, isFavorite
  let eventTypesHtml = '';

  EVENT_TYPES.forEach((eventType) => {
    eventTypesHtml += `
      <div class="event__type-item">
        <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${eventType}>
        <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(eventType)}</label>
      </div>
      `;
  });

  const currentDestination = mockDestinations[mockDestinations.findIndex((item) => item.id === destination)];

  let destinationsHtml = `
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${currentDestination.name} list="destination-list-1">
    <datalist id="destination-list-1">
    `;
  for (let i = 0; i < mockDestinations.length; i++) {
    destinationsHtml += `
      <option value=${mockDestinations[i].name}></option>
    `;
  }
  destinationsHtml += `
    </datalist>
  `;

  const availableOffers = mockOffers[mockOffers.findIndex((item) => item.type === type)].offers; //массив доступных предложений для кокретного type
  let availableOffersHtml = '';
  availableOffers.forEach((offer) => {
    const offerShortTitle = lastWord(offer.title);
    const checked = offers.includes(offer.id) ? 'checked' : '';
    availableOffersHtml += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerShortTitle}-1" type="checkbox" name="event-offer-${offerShortTitle}" ${checked}>
        <label class="event__offer-label" for="event-offer-${offerShortTitle}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
      `;
  });

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${eventTypesHtml}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>

            ${destinationsHtml}

          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, EVENT_EDIT_DATE_FORMAT)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, EVENT_EDIT_DATE_FORMAT)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">

              ${availableOffersHtml}

            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class EditFormView {
  constructor(event) {
    this.event = event;
  }

  getTemplate() {
    return createEditFormTemplate(this.event);
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
