import {CURRENT_DATE} from '../const.js';

// массив-список фильтров с функциями-условиями
const filtersList = [
  {
    name: 'everything',
    condition: function() { // возвращает true, если event удовлетворяет условию
      return true;
    }
  },
  {
    name: 'future',
    condition: function(event) { // возвращает true, если event удовлетворяет условию
      // если event.dateFrom позже текущего момента, return true;
      return new Date(event.dateFrom) > CURRENT_DATE;
    }
  },
  {
    name: 'present',
    condition: function(event) { // возвращает true, если event удовлетворяет условию
      // если event.dateFrom раньше текущего момента, а event.dateTo - позже, return true;
      return (new Date(event.dateFrom) < CURRENT_DATE) && (new Date(event.dateTo) > CURRENT_DATE);
    }
  },
  {
    name: 'past',
    condition: function(event) { // возвращает true, если event удовлетворяет условию
      // если event.dateTo раньше текущего момента, return true;
      return new Date(event.dateTo) < CURRENT_DATE;
    }
  },
];

function generateFilters(events) { // возвращает массив объектов с названием и статусом доступности фильтра
  const filters = [];
  filtersList.forEach((filter) => {
    filters.push({
      name: filter.name,
      enabled: events.some((event) => filter.condition(event)), //доступен, если хотя бы один элемент удовлетворяет фильтру
    });
  });
  return filters;
}

export {generateFilters};
