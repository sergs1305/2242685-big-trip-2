import {render} from './render.js';
import TripInfoView from './view/trip-info-view.js';
import FiltersView from './view/filters-view.js';
import MainPresenter from './presenter/main-presenter.js';
import EventsModel from './model/events-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const eventsModel = new EventsModel();
const mainPresenter = new MainPresenter({
  boardContainer: tripEvents,
  eventsModel
});

render(new TripInfoView(), tripMainElement, 'AFTERBEGIN');
render(new FiltersView(), tripControlsFiltersElement);

mainPresenter.init();
