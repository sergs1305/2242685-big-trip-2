import {render} from '../render.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import EventView from '../view/event-view.js';

export default class mainPresenter {
  constructor ({boardContainer, eventsModel}) {
    this.boardContainer = boardContainer;
    this.eventsModel = eventsModel;
  }

  init() {
    this.boardEvents = [...this.eventsModel.getEvents()];

    render(new SortView(), this.boardContainer);
    render(new ListView(), this.boardContainer); // отрисовываем тэг <ul> - контейнер списка точек маршрута

    const tripEventsList = this.boardContainer.querySelector('.trip-events__list'); //css-класс '.trip-events__list' появится в разметке после отрисовки тэга <ul>
    render(new EditFormView(), tripEventsList);

    for (let i = 0; i < this.boardEvents.length; i++) {
      render(new EventView({event: this.boardEvents[i]}), tripEventsList);
    }
  }
}
