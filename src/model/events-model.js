import Observable from '../framework/observable.js';
//import {mockEvents} from '../mock/event.js';
//import {SHOW_EVENTS_COUNT} from '../const.js';
import {UpdateType} from '../const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  //#events = mockEvents;
  #events = [];

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
    // this.#eventsApiService.events.then((events) => {
    //   console.log(events.map(this.#adaptToClient));
    // });
  }

  get events() {
    return this.#events;
  }

  async init() {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch(err) {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
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
    // this.#events = [
    //   ...this.#events.slice(0, index),
    //   update,
    //   ...this.#events.slice(index + 1),
    // ];
    // this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];
    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }
    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];
    this._notify(updateType);
  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      //dateFrom: event['due_date'] !== null ? new Date(event['due_date']) : event['due_date'], // На клиенте дата хранится как экземпляр Date
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
