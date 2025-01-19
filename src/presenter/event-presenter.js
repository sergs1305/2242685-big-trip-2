import {render, replace, remove} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import EventView from '../view/event-view.js';

export default class EventPresenter {
  #event = null;
  #listViewComponent = null;
  #handleDataChange = null;
  #eventViewComponent = null;
  #eventEditComponent = null;

  constructor ({listViewComponent, onDataChange}) {
    //this.#event = event;
    this.#listViewComponent = listViewComponent;
    this.#handleDataChange = onDataChange;
  }

  init(event) {
    this.#event = event;
    const prevEventViewComponent = this.#eventViewComponent;
    const prevEventEditComponent = this.#eventEditComponent;
    //this.#boardEvents = [...this.#eventsModel.events];
    //this.#renderEvent(event, this.#listViewComponent);

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
      //console.log(this.#eventViewComponent, this.#listViewComponent);
      render(this.#eventViewComponent, this.#listViewComponent.element);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#listViewComponent.element.contains(prevEventViewComponent.element)) {
      replace(this.#eventViewComponent, prevEventViewComponent);
    }

    if (this.#listViewComponent.element.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventViewComponent);
    remove(prevEventEditComponent);

    //    render(this.#eventViewComponent, this.#listViewComponent.element);
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventViewComponent);
  }

  #replaceFormToCard() {
    replace(this.#eventViewComponent, this.#eventEditComponent);
  }

}
