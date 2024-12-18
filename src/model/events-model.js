import {getRandomEvent} from '../mock/event.js';
import {SHOW_EVENTS_COUNT} from '../const.js';

export default class EventsModel {
  #events = Array.from({length: SHOW_EVENTS_COUNT}, getRandomEvent);
  getEvents() {
    return this.#events;
  }
}
