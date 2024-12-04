import {render} from './render.js';
import FilterView from './view/filters-view.js';
import MainPresenter from './presenter/presenter.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const mainPresenter = new MainPresenter({boardContainer: tripEvents});

render(new FilterView(), tripControlsFilters);

mainPresenter.init();
