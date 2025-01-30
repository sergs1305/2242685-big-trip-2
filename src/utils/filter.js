import {CURRENT_DATE, FilterType} from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => (events),
  [FilterType.FUTURE]: (events) => events.filter((event) => new Date(event.dateFrom) > CURRENT_DATE),
  [FilterType.PRESENT]: (events) => events.filter((event) => (new Date(event.dateFrom) < CURRENT_DATE) && (new Date(event.dateTo) > CURRENT_DATE)),
  [FilterType.PAST]: (events) => events.filter((event) => new Date(event.dateTo) < CURRENT_DATE),
};

export {filter};
