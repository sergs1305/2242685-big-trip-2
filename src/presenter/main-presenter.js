import {render, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import {SortType, SortTypeName, DEFAULT_SORT_INDEX, UpdateType, UserAction, FilterType, BoardMessage} from '../const.js';
import {sortByDay, sortByTime, sortByPrice} from '../utils/event.js';
import {filter} from '../utils/filter.js';
import BoardMessageView from '../view/board-message-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MainPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #sortComponent = null;
  #currentSortType = SortType[DEFAULT_SORT_INDEX].name;
  #listViewComponent = new ListView();
  #loadingComponent = new BoardMessageView(BoardMessage.LOADING);
  #failedLoadingComponent = new BoardMessageView(BoardMessage.FAILED);
  #noEventsComponent = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isFailedLoad = false;
  #onNewEventDestroy = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor ({boardContainer, eventsModel, filterModel, onNewEventDestroy}) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#onNewEventDestroy = onNewEventDestroy;

    // this.#newEventPresenter = new NewEventPresenter({
    //   eventListContainer: this.#listViewComponent.element,
    //   onDataChange: this.#handleViewAction,
    //   onDestroy: onNewEventDestroy,
    //   destinations: this.#eventsModel.destinations,
    //   allOffers: this.#eventsModel.offers,
    // });

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
    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#listViewComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewEventDestroy,
      destinations: this.#eventsModel.destinations,
      allOffers: this.#eventsModel.offers,
    });

    this.#currentSortType = SortType[DEFAULT_SORT_INDEX].name;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #renderBoard () {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
        destinations: this.#eventsModel.destinations,
        allOffers: this.#eventsModel.offers,
        //isDisabled, isSaving, isDeleting
      });
      eventPresenter.init(event);
      this.#eventPresenters.set(event.id, eventPresenter);
    });
  };

  #clearBoard({resetSortType = false} = {}) {
    if (this.#newEventPresenter) {
      this.#newEventPresenter.destroy();
    }
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType[DEFAULT_SORT_INDEX].name;
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        //this.#eventsModel.updateEvent(updateType, update);
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        //this.#eventsModel.addEvent(updateType, update);
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        //this.#eventsModel.deleteEvent(updateType, update);
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isFailedLoad = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.FAILED:
        this.#isLoading = false;
        this.#isFailedLoad = true;
        remove(this.#loadingComponent);
        this.#renderFailedLoad();
        break;
    }
  };

  #handleModeChange = () => {
    if (this.#newEventPresenter) {
      this.#newEventPresenter.destroy();
    }
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

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer); // .element RenderPosition.AFTERBEGIN
  }

  #renderFailedLoad() {
    render(this.#failedLoadingComponent, this.#boardContainer); // .element RenderPosition.AFTERBEGIN
  }
}
