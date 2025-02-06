import AbstractView from '../framework/view/abstract-view.js';

function createBoardMessageTemplate(boardMessage) {
  return (
    `<p class="trip-events__msg">${boardMessage}</p>`
  );
}

export default class BoardMessageView extends AbstractView {
  #boardMessage = '';

  constructor(boardMessage) {
    super();
    this.#boardMessage = boardMessage;
  }

  get template() {
    return createBoardMessageTemplate(this.#boardMessage);
  }
}
