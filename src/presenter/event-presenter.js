import {render, replace, remove} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import EventView from '../view/event-view.js';

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

  constructor ({listViewComponent, onDataChange, onModeChange}) {
    //this.#event = event;
    this.#listViewComponent = listViewComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
        // const eventRollupBtn = this.querySelector('.event__rollup-btn');
        // eventRollupBtn.addEventListener('click', this.#eventRollupBtnHandler);
      },
    });
    this.#eventEditComponent = new EditFormView({
      event: this.#event,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleFormCancel,
      onDeleteClick: this.#handleFormDelete,
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

  #handleFormSubmit = (update) => { //(update)
    this.#replaceFormToCard();
    this.#handleDataChange(update);
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление
    //const isMinorUpdate =
    // !isDatesEqual(this.#task.dueDate, update.dueDate) ||
    // isTaskRepeating(this.#task.repeating) !== isTaskRepeating(update.repeating);

    // this.#handleDataChange(
    //   UserAction.UPDATE_TASK,
    //   isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
    //   update,
    //);
  };

  #handleFormDelete = () => {
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
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
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
