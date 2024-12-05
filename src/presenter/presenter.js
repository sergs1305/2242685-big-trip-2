import {render} from '../render.js';
import SortingView from '../view/sorting-view.js';
//import CreationFormView from '../view/creation-form-view.js';
import EditingFormView from '../view/editing-form-view.js';
import ListView from '../view/list-view.js';
import WaypointView from '../view/waypoint-view.js';

const tripEvents = document.querySelector('.trip-events');

export default class Presenter {
  // boardComponent = new BoardView();
  // taskListComponent = new TaskListView();

  // constructor({boardContainer}) {
  //   this.boardContainer = boardContainer;
  // }

  init() {
    render(new SortingView(), tripEvents);
    render(new ListView(), tripEvents); // отрисовываем тэг ul - контейнер списка точек маршрута
    const tripEventsList = tripEvents.querySelector('.trip-events__list');
    //render(new CreationFormView(), tripEventsList);
    render(new EditingFormView(), tripEventsList);

    // render(this.boardComponent, this.boardContainer);
    // render(new SortView(), this.boardComponent.getElement());
    // render(this.taskListComponent, this.boardComponent.getElement());
    // render(new TaskEditView(), this.taskListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), tripEventsList);
    }
    // render(new LoadMoreButtonView(), this.boardComponent.getElement());
  }
}
