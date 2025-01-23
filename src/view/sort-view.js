import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';
import {capitalizeFirstLetter} from '../utils/common.js';

function createSortTemplate(currentSortType) {
  let sortTemplate = '<form class="trip-events__trip-sort  trip-sort" action="#" method="get">';
  for (let i = 0; i < SortType.length; i++) {
    sortTemplate += `
      <div class="trip-sort__item  trip-sort__item--${SortType[i].name}">
        <input id="sort-${SortType[i].name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType[i].name}" ${!SortType[i].isDisabled && currentSortType === SortType[i].name ? 'checked' : ''} ${SortType[i].isDisabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${SortType[i].name}" data-sort-type="${SortType[i].name}">${capitalizeFirstLetter(SortType[i].name)}</label>
      </div>
    `;
  }
  sortTemplate += '</form>';
  return sortTemplate;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

}
