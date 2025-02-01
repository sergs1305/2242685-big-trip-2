//import AbstractView from '../framework/view/abstract-view.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {EVENT_EDIT_DATE_FORMAT, DEFAULT_EVENT_TYPE} from '../const.js';
import {EVENT_TYPES} from '../mock/const.js';
import {formatDate, capitalizeFirstLetter} from '../utils/common.js';
import {destinations} from '../mock/destinations.js';
import {allOffers} from '../mock/offers.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  id: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  type : DEFAULT_EVENT_TYPE,
  destination: '',
  basePrice: 0,
  offers: [],
  isFavorite: false,
};

function createEventSectionOffersTemplate (event) {
  const availableOffers = getAvailableOffers(event); //массив доступных offers для кокретного type
  if (availableOffers.length === 0) {
    return '';
  }
  let availableOffersHtml = '';
  availableOffers.forEach((offer) => {
    //const checked = offer.selected ? 'checked' : '';
    availableOffersHtml += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${offer.selected ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
      `;
  });

  return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${availableOffersHtml}
      </div>
    </section>
  `);
}


function createEventSectionDestination (currentDestination) {
  const pictures = destinations[destinations.findIndex((item) => item.id === currentDestination.id)].pictures; //массив фотографий для текущего destination
  let photosHtml = '';
  pictures.forEach((picture) => {
    photosHtml += `
      <img class="event__photo" src="${picture.src}" alt="${picture.description}">
     `;
  });

  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${currentDestination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosHtml}
        </div>
      </div>
    </section>
  `);
}

function createEditFormTemplate (event) {
  const {basePrice, dateFrom, dateTo, type, destination, id} = event; //id, isFavorite , offers
  const currentDestinationId = destinations.findIndex((item) => item.id === destination);

  let currentDestinationName = '\'\'';
  let eventTypesTemplate = '';
  let currentDestination = {};
  let destinationsTemplate = '';

  EVENT_TYPES.forEach((eventType) => {
    eventTypesTemplate += `
      <div class="event__type-item">
        <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${eventType}>
        <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(eventType)}</label>
      </div>
      `;
  });

  if (currentDestinationId > -1) {
    currentDestination = destinations[currentDestinationId];
    currentDestinationName = currentDestination.name;
  }
  destinationsTemplate = `
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${currentDestinationName} list="destination-list-1">
      <datalist id="destination-list-1">
      `;

  destinations.forEach((destinationItem) => {
    destinationsTemplate += `
        <option value=${destinationItem.name}></option>
      `;
  });
  destinationsTemplate += `
      </datalist>
    `;


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
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>
            ${destinationsTemplate}
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
          <button class="event__reset-btn" type="reset">${id ? 'Delete' : 'Cancel'}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createEventSectionOffersTemplate(event)}
          ${currentDestinationId > -1 ? createEventSectionDestination(currentDestination) : ''}
        </section>
      </form>
    </li>`
  );
}

function getAvailableOffers (event) {
  let availableOffers = [];
  //if (event.offers) {
  availableOffers = allOffers[allOffers.findIndex((item) => item.type === event.type)].offers; //массив доступных offers для кокретного type

  if (event.offers) {
    availableOffers.forEach((offer) => {
      offer.selected = event.offers.includes(offer.id);
    });
  }
  return availableOffers;
}

export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleFormCancel = null;
  #handleDeleteClick = null;
  #event = null;
  #datepicker = null;

  constructor({event = BLANK_EVENT, onFormSubmit, onFormCancel, onDeleteClick}) {
    super();
    this.#event = event;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCancel = onFormCancel;
    this.#handleDeleteClick = onDeleteClick;
    this._setState(EditFormView.parseEventToState(event));
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state);
  }

  //removeElement()?

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToEvent(this._state));
  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.className.includes('event__type-label')) {
      return;
    }

    this._state.type = evt.target.parentElement.querySelector('.event__type-input').value; //найти в родительском элементе класс event__type-input и взять его value
    this._state.availableOffers = getAvailableOffers(this._state);
    this.updateElement({
      type: this._state.type,
    });
    //this.#handleFormSubmit(EditFormView.parseStateToEvent(this._state));
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();

    const selectedDestinationIndex = destinations.findIndex((item) => item.name === evt.target.value);

    if (selectedDestinationIndex === -1) {
      return;
    }

    this._state.destination = destinations[selectedDestinationIndex].id;
    this.updateElement({
      destination: this._state.destination,
    });
  };

  #dateFromCloseHandler = ([selectedDate]) => {
    this.updateElement({
      dateFrom: selectedDate,
    });
  };

  #dateToCloseHandler = ([selectedDate]) => {
    this.updateElement({
      dateTo: selectedDate,
    });
  };

  #offerHandler = (evt) => {
    //evt.preventDefault();
    if (!(evt.target.className.includes('event__offer-label') || evt.target.className.includes('event__offer-title') || evt.target.className.includes('event__offer-price'))) {
      return;
    }
    let labelElement = null;
    if (evt.target.className.includes('event__offer-label')) {
      labelElement = evt.target;
    } else {
      labelElement = evt.target.parentElement;
    }

    //for="event-offer-${offer.id}-1"
    const offerId = labelElement.htmlFor.slice(0, labelElement.htmlFor.length - 2).replace('event-offer-', '');
    const offerIdIndex = this._state.availableOffers.findIndex((item) => item.id === offerId);
    this._state.availableOffers[offerIdIndex].selected = !this._state.availableOffers[offerIdIndex].selected;
  };

  #setDatepickerFrom() {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        minDate: 'today',
        enableTime: true,
        'time_24hr': true,
        onClose: this.#dateFromCloseHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  #setDatepickerTo() {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        onClose: this.#dateToCloseHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToEvent(this._state));
  };

  reset(event) {
    this.updateElement(
      EditFormView.parseEventToState(event),
    );
  }

  _restoreHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#eventTypeHandler);
    //if (this.#event.destination) {
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationHandler); //destination-list-1
    //}
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handleFormCancel); // кнопка "стрелка вниз"
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    if (this._state.availableOffers.length > 0) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerHandler);
    }
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  static parseEventToState(event) {
    const availableOffers = getAvailableOffers(event);

    return {...event,
      availableOffers: availableOffers,
    };
  }

  static parseStateToEvent(state) {
    const event = {...state};
    event.offers = [];
    //event.offers.length = 0; //очищаем массив offers для event
    //переносим выбранные offers (id) в свойство (массив) event.offers
    event.availableOffers.forEach((offer) => {
      if (offer.selected) {
        event.offers.push(offer.id);
      }
    });

    delete event.availableOffers;

    return event;
  }
}

