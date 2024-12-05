import {render} from './render.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filters-view.js';
import MainPresenter from './presenter/presenter.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
//const tripEvents = document.querySelector('.trip-events');
//const mainPresenter = new MainPresenter({boardContainer: tripEvents});
const mainPresenter = new MainPresenter();

render(new TripInfoView(), tripMain, 'AFTERBEGIN');
render(new FilterView(), tripControlsFilters);

mainPresenter.init();
