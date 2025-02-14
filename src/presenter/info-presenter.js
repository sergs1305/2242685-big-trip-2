import {render, replace, remove} from '../framework/render.js';
import InfoView from '../view/info-view.js';

export default class InfoPresenter {
  #eventsModel = null;
  #infoComponent = null;
  #infoContainer = null;

  constructor({infoContainer, eventsModel}) {
    this.#infoContainer = infoContainer;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    //const filters = this.filters;
    const prevInfoComponent = this.#infoComponent;
    this.#infoComponent = new InfoView({
      eventsModel: this.#eventsModel
    });
    if (prevInfoComponent === null) {
      render(this.#infoComponent, this.#infoContainer, 'AFTERBEGIN');
      return;
    }
    replace(this.#infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

}
