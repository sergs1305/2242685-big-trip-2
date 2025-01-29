import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizeFirstLetter(type)}</label>
    </div>`
  );
}

function createFilterTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}

// import AbstractView from '../framework/view/abstract-view.js';
// import {capitalizeFirstLetter} from '../utils/common.js';

// function createFilterTemplate(filterName, isDisabled = false, isChecked = false) {
//   return (
//     `
//     <div class="trip-filters__filter">
//       <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
//       <label class="trip-filters__filter-label" for="filter-${filterName}">${capitalizeFirstLetter(filterName)}</label>
//     </div>
//     `
//   );
// }

// function createFiltersTemplate(filters) { //filters - массив пар "название фильтра" и "кол-во events" (удовлетворяющих фильтру) (либо второе свойство - доступность (если кол-во events > 0), либо массив events)
//   const filtersTemplate = filters.reduce((accumulator, filter) => accumulator + createFilterTemplate(filter.name, !filter.enabled), '');

//   return (
//     `<form class="trip-filters" action="#" method="get">
//       ${filtersTemplate}
//       <button class="visually-hidden" type="submit">Accept filter</button>
//     </form>`
//   );
// }

// export default class FiltersView extends AbstractView {
//   #filters = [];

//   constructor(filters) {
//     super();
//     this.#filters = filters;
//   }

//   get template() {
//     return createFiltersTemplate(this.#filters);
//   }
// }
