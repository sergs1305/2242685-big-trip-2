import Observable from '../framework/observable.js';

export default class TripInfoModel extends Observable {
  //#filter = FilterType.EVERYTHING;
  #tripInfo = null;

  get tripInfo() {
    return this.#tripInfo;
  }

  setTripInfo(updateType) {
    //this.#tripInfo = tripInfo;
    this._notify(updateType);
  }
}
