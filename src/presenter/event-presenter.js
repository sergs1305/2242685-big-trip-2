import {render, replace, remove} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import EventView from '../view/event-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #event = null;
  #listViewComponent = null;
  #handleDataChange = null;
  #eventViewComponent = null;
  #eventEditComponent = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #destinations = [];
  #allOffers = [];

  constructor ({listViewComponent, onDataChange, onModeChange, destinations, allOffers}) {
    //this.#event = event;
    this.#listViewComponent = listViewComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
  }

  init(event) {
    this.#event = event;
    const prevEventViewComponent = this.#eventViewComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventViewComponent = new EventView({
      event: this.#event,
      onFavoriteClick: this.#handleFavoriteClick,
      onEditBtnClick: () => {
        this.#replaceCardToForm();
      },
      destinations: this.#destinations,
      allOffers: this.#allOffers,

    });

    this.#eventEditComponent = new EditFormView({
      event: this.#event,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleFormCancel,
      onDeleteClick: this.#handleDeleteClick,
      destinations: this.#destinations,
      allOffers: this.#allOffers,
    });

    if (prevEventViewComponent === null || prevEventEditComponent === null) {
      render(this.#eventViewComponent, this.#listViewComponent.element);
      return;
    }

    // Проверка на наличие в DOM необходима, чтобы не пытаться заменить то, что не было отрисовано
    //if (this.#listViewComponent.element.contains(prevEventViewComponent.element)) {
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventViewComponent, prevEventViewComponent);
    }

    //if (this.#listViewComponent.element.contains(prevEventEditComponent.element)) {
    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventViewComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventViewComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToCard();
    }
  }

  #handleFormSubmit = (update) => {
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление
    const isMinorUpdate = this.#event.dateFrom !== update.dateFrom;

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (event) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#handleFormCancel(evt);
    }
  };

  #handleFormCancel = (evt) => {
    evt.preventDefault();
    this.#eventEditComponent.reset(this.#event);
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventViewComponent);
    this.#handleModeChange();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventViewComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#eventViewComponent.init();
    this.#mode = Mode.DEFAULT;
  }

}
