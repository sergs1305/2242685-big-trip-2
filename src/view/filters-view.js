import AbstractView from '../framework/view/abstract-view.js';
import capitalizeFirstLetter from '../utils.js';

function createFilterTemplate(filterName, isDisabled = false, isChecked = false) {
  return (
    `
    <div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${capitalizeFirstLetter(filterName)}</label>
    </div>
    `
  );
}

function createFiltersTemplate(filters) { //filters - массив пар "название фильтра" и "кол-во events" (удовлетворяющих фильтру) (либо второе свойство - доступность (если кол-во events > 0))
  let filtersTemplate = '';
  for (let i = 0; i < filters.length(); i++) {
    filtersTemplate += createFilterTemplate(filters[i].name);
  }

  return (
    `<form class="trip-filters" action="#" method="get">

      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  get template() {
    return createFiltersTemplate();
  }
}
