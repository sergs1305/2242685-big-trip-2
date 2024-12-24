import {render, replace} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import EventView from '../view/event-view.js';
import ListEmptyView from '../view/list-empty-view.js';

export default class mainPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #boardEvents = [];

  constructor ({boardContainer, eventsModel}) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#boardEvents = [...this.#eventsModel.events];
    this.#renderBoard();
  }

  #renderBoard() {
    const listViewComponent = new ListView();

    if (this.#boardEvents.length === 0) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }

    render(new SortView(), this.#boardContainer);
    render(listViewComponent, this.#boardContainer); // отрисовываем тэг <ul> - контейнер списка точек маршрута

    for (let i = 0; i < this.#boardEvents.length; i++) {
      this.#renderEvent(this.#boardEvents[i], listViewComponent);
    }
  }

  #renderEvent(event, listViewComponent) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const eventViewComponent = new EventView({
      event,
      onEditBtnClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const editFormViewComponent = new EditFormView({
      event,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });
    function replaceCardToForm() {
      replace(editFormViewComponent, eventViewComponent);
    }
    function replaceFormToCard() {
      replace(eventViewComponent, editFormViewComponent);
    }
    render(eventViewComponent, listViewComponent.element);
  }

}
