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

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.#replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    this.#eventViewComponent = new EventView({
      event: this.#event,
      onFavoriteClick: this.#handleFavoriteClick,
      onEditBtnClick: () => {
        this.#replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    this.#eventEditComponent = new EditFormView({
      event: this.#event,
      onFormSubmit: () => {
        this.#replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
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
      this.#replaceFormToCard();
    }
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventViewComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventViewComponent, this.#eventEditComponent);
    this.#mode = Mode.DEFAULT;
  }

}
