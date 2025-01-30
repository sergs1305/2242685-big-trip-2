import {render, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import {SortType, SortTypeName, defaultSortIndex, UpdateType, UserAction, FilterType} from '../const.js';
import {sortByDay, sortByTime, sortByPrice} from '../utils/event.js';
import {filter} from '../utils/filter.js';

export default class MainPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #sortComponent = null;
  #currentSortType = SortType[defaultSortIndex].name;
  #listViewComponent = new ListView();
  #noEventsComponent = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;

  constructor ({boardContainer, eventsModel, filterModel, onNewEventDestroy}) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#listViewComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortTypeName.DAY:
        return filteredEvents.sort(sortByDay);
      case SortTypeName.TIME:
        return filteredEvents.sort(sortByTime);
      case SortTypeName.PRICE:
        return filteredEvents.sort(sortByPrice);
    }
    return filteredEvents;
  }

  init() {
    this.#renderBoard();
  }

  createEvent() {
    this.#currentSortType = SortType[defaultSortIndex].name;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #renderBoard () {
    const events = this.events;
    const eventsCount = events.length;

    if (eventsCount === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();

    //this.#listViewComponent = new ListView();
    render(this.#listViewComponent, this.#boardContainer); // отрисовываем тэг <ul> - контейнер списка точек маршрута

    this.#renderEvents(events);

  }

  #renderNoEvents () {
    this.#noEventsComponent = new ListEmptyView({filterType: this.#filterType});
    render(this.#noEventsComponent, this.#boardContainer);
  }


  #renderEvents = (events) => {
    events.forEach ((event) => {
      const eventPresenter = new EventPresenter({
        listViewComponent: this.#listViewComponent,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
      });
      eventPresenter.init(event);
      this.#eventPresenters.set(event.id, eventPresenter);
    });

    // for (let i = 0; i < events.length; i++) {
    //   const eventPresenter = new EventPresenter({
    //     listViewComponent: this.#listViewComponent,
    //     onDataChange: this.#handleViewAction,
    //     onModeChange: this.#handleModeChange,
    //   });
    //   eventPresenter.init(events[i]);
    //   this.#eventPresenters.set(events[i].id, eventPresenter);
    // }
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    remove(this.#sortComponent);

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType[defaultSortIndex].name;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#boardContainer); //RenderPosition.AFTERBEGIN
  }
}
