import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import minMax from '../../node_modules/dayjs/plugin/minMax.js';
dayjs.extend(minMax);

export default class InfoView extends AbstractView {
  #eventsModel = null;
  #firstEvent = {};
  #lastEvent = {};
  #events = [];

  constructor ({eventsModel}) {
    super();
    this.#eventsModel = eventsModel;
    this.#events = this.#eventsModel.events;
    //this.#firstEvent = this.#events[this.#events.map((event) => dayjs(event.dateFrom)).indexOf(dayjs.min(this.#events.map((event) => dayjs(event.dateFrom))))];
    this.#firstEvent = this.#getFirstEvent();
    //this.#lastEvent = this.#events[this.#events.map((event) => dayjs(event.dateTo)).indexOf(dayjs.max(this.#events.map((event) => dayjs(event.dateTo))))];
    this.#lastEvent = this.#getLastEvent();
    //console.log(this.#firstEvent);
  }

  get template() {
    return this.#createInfoTemplate();
  }

  #getFirstEvent() {
    const fromDates = this.#events.map((event) => dayjs(event.dateFrom));
    const minDate = dayjs.min(fromDates);
    const minDateIndex = fromDates.indexOf(minDate);

    return this.#events[minDateIndex];
  }

  #getLastEvent() {
    const toDates = this.#events.map((event) => dayjs(event.dateTo));
    const maxDate = dayjs.max(toDates);
    const maxDateIndex = toDates.indexOf(maxDate);

    return this.#events[maxDateIndex];
  }

  // <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
  #getTripInfoTitle () {
    if (!this.#firstEvent) {
      return '';
    }

    const destinations = this.#eventsModel.destinations;

    let firstDestinationName = '';
    let secondDestinationName = '';
    let lastDestinationName = '';
    let tripInfoTitle = '';

    if (this.#events.length > 0) {
      firstDestinationName = destinations[destinations.findIndex((destination) => destination.id === this.#firstEvent.destination)].name;
    }

    if (this.#events.length > 1) {
      lastDestinationName = destinations[destinations.findIndex((destination) => destination.id === this.#lastEvent.destination)].name;
    }

    if (this.#events.length === 3) {
      const events = structuredClone(this.#eventsModel.events);
      events.forEach((event) => {
        if (event.id !== this.#firstEvent.id && event.id !== this.#lastEvent.id) {
          secondDestinationName = destinations[destinations.findIndex((destination) => destination.id === event.destination)].name;
        }
      });
    }

    switch (this.#events.length) {
      case 0:
        break;
      case 1:
        tripInfoTitle = firstDestinationName;
        break;
      case 2:
        tripInfoTitle = `${firstDestinationName} — ${lastDestinationName}`;
        break;
      case 3:
        tripInfoTitle = `${firstDestinationName} — ${secondDestinationName} — ${lastDestinationName}`;
        break;
      default:
        tripInfoTitle = `${firstDestinationName} — ... — ${lastDestinationName}`;
    }

    return tripInfoTitle;
  }

  // <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
  // dayjs('2019-01-25').format('DD/MM/YYYY')
  #getTripInfoDates () {
    if (!this.#firstEvent) {
      return '';
    }

    const firstDay = dayjs(this.#firstEvent.dateFrom).format('D');
    const lastDay = dayjs(this.#lastEvent.dateTo).format('D');
    const lastMonth = dayjs(this.#lastEvent.dateTo).format('MMM').toUpperCase();

    let firstMonth = dayjs(this.#firstEvent.dateFrom).format('MMM').toUpperCase();

    firstMonth = firstMonth !== lastMonth ? firstMonth : '';

    return `${firstDay} ${firstMonth} — ${lastDay} ${lastMonth}`;

  }

  // <p class="trip-info__cost">
  // Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  // </p>
  #getTripInfoCost () {
    if (!this.#firstEvent) {
      return '';
    }

    const allOffers = this.#eventsModel.offers;

    let tripCost = 0;

    this.#events.forEach((event) => {
      tripCost += event.basePrice;
      const offersByType = allOffers[allOffers.findIndex((offer) => offer.type === event.type)].offers;
      event.offers.forEach((offerId) => {
        tripCost += offersByType[offersByType.findIndex((offer) => offer.id === offerId)].price;
      });
    });
    return String(tripCost);
  }

  #createInfoTemplate() {
    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${this.#getTripInfoTitle()}</h1>

          <p class="trip-info__dates">${this.#getTripInfoDates()}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.#getTripInfoCost()}</span>
        </p>
      </section>`
    );
  }

}
