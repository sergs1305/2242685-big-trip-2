import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
//import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
//import EventView from '../view/event-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import EventPresenter from './event-presenter.js';
import {updateItem} from '../utils/common.js';
//import {sortTaskUp, sortTaskDown} from '../utils/task.js'; !!!
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
  }

  init() {
    this.#boardEvents = [...this.#eventsModel.events];
    this.#sourcedBoardEvents = [...this.#eventsModel.events];
    this.#listViewComponent = new ListView();

    if (this.#boardEvents.length === 0) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }

    //render(new SortView(), this.#boardContainer);
    this.#renderSort();
    render(this.#listViewComponent, this.#boardContainer); // отрисовываем тэг <ul> - контейнер списка точек маршрута
    this.#renderEvents();

    // for (let i = 0; i < this.#boardEvents.length; i++) {
    //   const eventPresenter = new EventPresenter({
    //     listViewComponent,
    //     onDataChange: this.#handleEventChange,
    //     onModeChange: this.#handleModeChange,
    //   });
    //   eventPresenter.init(this.#boardEvents[i]);
    //   this.#eventPresenters.set(this.#boardEvents[i].id, eventPresenter);
    // }
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
    this.#clearEventsList();
    // - Рендерим список заново
    this.#renderEvents();
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
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#boardContainer); //RenderPosition.AFTERBEGIN
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    //this.#renderedTaskCount = TASK_COUNT_PER_STEP;
  }
}
