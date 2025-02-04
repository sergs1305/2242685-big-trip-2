import {remove, render, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #eventEditComponent = null;
  #destinations = [];
  #allOffers = [];

  constructor({eventListContainer, onDataChange, onDestroy, destinations, allOffers}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }
    this.#eventEditComponent = new EditFormView({
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleDeleteClick,
      onDeleteClick: this.#handleDeleteClick,
      destinations: this.#destinations,
      allOffers: this.#allOffers,
    });
    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
    //this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
