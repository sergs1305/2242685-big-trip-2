import {render} from '../render.js';
import SortingView from './view/sorting-view.js';
import CreationFormView from './view/creation-form-view.js';
import WaypointView from './view/waypoint-view.js';

const tripEvents = document.querySelector('.trip-events');

render(new SortingView(), tripEvents);
render(new CreationFormView(), tripEvents);

export default class Presenter {
  // boardComponent = new BoardView();
  // taskListComponent = new TaskListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    // render(this.boardComponent, this.boardContainer);
    // render(new SortView(), this.boardComponent.getElement());
    // render(this.taskListComponent, this.boardComponent.getElement());
    // render(new TaskEditView(), this.taskListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), this.taskListComponent.getElement());
    }
    // render(new LoadMoreButtonView(), this.boardComponent.getElement());
  }
}
