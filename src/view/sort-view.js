import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';
import {capitalizeFirstLetter} from '../utils/common.js';

function createSortTemplate(currentSortType) {
  let sortTemplate = '<form class="trip-events__trip-sort  trip-sort" action="#" method="get">';
  SortType.forEach((sortType) => {
    sortTemplate +=
      `<div class="trip-sort__item  trip-sort__item--${sortType.name}">
        <input id="sort-${sortType.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType.name}" ${!sortType.isDisabled && currentSortType === sortType.name ? 'checked' : ''} ${sortType.isDisabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${sortType.name}" data-sort-type="${sortType.name}">${capitalizeFirstLetter(sortType.name)}</label>
      </div>`;
  });
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

    const selectedSortType = evt.target.dataset.sortType;

    if (!selectedSortType) {
      return;
    }

    if (SortType[SortType.findIndex((item) => item.name === selectedSortType)].isDisabled) {
      return;
    }

    this.#handleSortTypeChange(selectedSortType);
  };

}
