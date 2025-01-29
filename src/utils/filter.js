import {CURRENT_DATE, FilterType} from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => (events),
  [FilterType.FUTURE]: (events) => events.filter((event) => new Date(event.dateFrom) > CURRENT_DATE),
  [FilterType.PRESENT]: (events) => events.filter((event) => (new Date(event.dateFrom) < CURRENT_DATE) && (new Date(event.dateTo) > CURRENT_DATE)),
  [FilterType.PAST]: (events) => events.filter((event) => new Date(event.dateTo) < CURRENT_DATE),
};

export {filter};

// массив-список фильтров с функциями-условиями
// const filtersList = [
//   {
//     name: 'everything',
//     condition: () => true
//   },
//   {
//     name: 'future',
//     condition: (event) => new Date(event.dateFrom) > CURRENT_DATE // если event.dateFrom позже текущего момента, return true;
//   },
//   {
//     name: 'present',
//     condition: (event) => (new Date(event.dateFrom) < CURRENT_DATE) && (new Date(event.dateTo) > CURRENT_DATE) // если event.dateFrom раньше текущего момента, а event.dateTo - позже, return true;
//   },
//   {
//     name: 'past',
//     condition: (event) => new Date(event.dateTo) < CURRENT_DATE // если event.dateTo раньше текущего момента, return true;
//   },
// ];

// function generateFilters(events) { // возвращает массив объектов с названием и статусом доступности фильтра
//   return filtersList.map((filter) => ({name: filter.name, enabled: events.some((event) => filter.condition(event))})); //доступен, если хотя бы один элемент удовлетворяет фильтру
// }

//export {filtersList, generateFilters};
