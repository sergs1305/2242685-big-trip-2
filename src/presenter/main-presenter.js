import {render, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import EventPresenter from './event-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import {sortByDay, sortByTime, sortByPrice} from '../utils/event.js';

export default class MainPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #boardEvents = [];
  #eventPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedBoardEvents = [];
  #listViewComponent = null;

  constructor ({boardContainer, eventsModel}) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
    this.#boardEvents = [...this.#eventsModel.events];
    this.#sourcedBoardEvents = [...this.#eventsModel.events];
  }

  init() {
    this.#sortEvents(this.#currentSortType);
    this.#renderBoard();
  }

  #renderBoard = () => {
    this.#listViewComponent = new ListView();

    if (this.#boardEvents.length === 0) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }

    this.#renderSort();
    render(this.#listViewComponent, this.#boardContainer); // отрисовываем тэг <ul> - контейнер списка точек маршрута
    this.#renderEvents();
  };

  #clearBoard() {
    //this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
  }

  #renderEvents = () => {
    for (let i = 0; i < this.#boardEvents.length; i++) {
      const eventPresenter = new EventPresenter({
        listViewComponent: this.#listViewComponent,
        onDataChange: this.#handleEventChange,
        onModeChange: this.#handleModeChange,
      });
      eventPresenter.init(this.#boardEvents[i]);
      this.#eventPresenters.set(this.#boardEvents[i].id, eventPresenter);
    }
  };

  #handleEventChange = (updatedEvent) => {
    this.#boardEvents = updateItem(this.#boardEvents, updatedEvent);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortEvents(sortType);
    // - Очищаем список
    //this.#clearEventsList();
    this.#clearBoard();
    // - Рендерим список заново
    //this.#renderEvents();
    this.#renderBoard();
  };

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#boardEvents.sort(sortByDay);
        break;
      // case SortType.EVENT:
      //   this.#boardEvents.sort(sortByEvent);
      //   break;
      case SortType.TIME:
        this.#boardEvents.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#boardEvents.sort(sortByPrice);
        break;
      // case SortType.OFFER:
      //   this.#boardEvents.sort(sortByOffer);
      //   break;
      default:
        this.#boardEvents = [...this.#sourcedBoardEvents];
    }
    this.#currentSortType = sortType;
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#boardContainer); //RenderPosition.AFTERBEGIN
  }
}
