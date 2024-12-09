import {render} from '../render.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import EventView from '../view/event-view.js';

export default class mainPresenter {
  init(tripEvents) {
    render(new SortView(), tripEvents);
    render(new ListView(), tripEvents); // отрисовываем тэг <ul> - контейнер списка точек маршрута
    const tripEventsList = tripEvents.querySelector('.trip-events__list'); //css-класс '.trip-events__list' появится в разметке после отрисовки тэга <ul>
    render(new EditFormView(), tripEventsList);

    for (let i = 0; i < 3; i++) {
      render(new EventView(), tripEventsList);
    }
  }
}
