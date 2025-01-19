import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
//import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
//import EventView from '../view/event-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import EventPresenter from './event-presenter.js';
import {updateItem} from '../utils/common.js';

export default class MainPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #boardEvents = [];
  #eventPresenters = new Map();

  constructor ({boardContainer, eventsModel}) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#boardEvents = [...this.#eventsModel.events];
    this.#renderBoard();
  }

  #renderBoard() {
    const listViewComponent = new ListView();

    if (this.#boardEvents.length === 0) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }

    render(new SortView(), this.#boardContainer);
    render(listViewComponent, this.#boardContainer); // отрисовываем тэг <ul> - контейнер списка точек маршрута

    for (let i = 0; i < this.#boardEvents.length; i++) {
      const eventPresenter = new EventPresenter({
        //event: this.#boardEvents[i],
        listViewComponent,
        onDataChange: this.#handleEventChange,
      });
      eventPresenter.init(this.#boardEvents[i]);
      this.#eventPresenters.set(this.#boardEvents[i].id, eventPresenter);
    }
  }

  #handleEventChange = (updatedEvent) => {
    this.#boardEvents = updateItem(this.#boardEvents, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

}
