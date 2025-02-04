import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #destinations = [];
  #offers = [];

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const events = await this.#eventsApiService.events;
      const destinations = await this.#eventsApiService.destinations;
      const offers = await this.#eventsApiService.offers;

      this.#events = events.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;

      this._notify(UpdateType.INIT);

    } catch(err) {
      this.#events = [];
      this.#destinations = [];
      this.#offers = [];

      this._notify(UpdateType.FAILED);
    }
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }
    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response);
      this.#events = [newEvent, ...this.#events];
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add event');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }
    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedEvent['is_favorite'];
    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];

    return adaptedEvent;
  }

}
