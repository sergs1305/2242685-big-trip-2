import {render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import MainPresenter from './presenter/main-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const eventsModel = new EventsModel();

const filterModel = new FilterModel();

const mainPresenter = new MainPresenter({
  boardContainer: tripEvents,
  eventsModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFiltersElement,
  filterModel,
  eventsModel
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});
function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}
function handleNewEventButtonClick() {
  mainPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

render(new TripInfoView(), tripMainElement, 'AFTERBEGIN');

render(newEventButtonComponent, tripMainElement);

filterPresenter.init();
mainPresenter.init();
