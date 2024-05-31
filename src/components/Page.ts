import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    _catalog: HTMLElement;
    _buttonBasket: HTMLElement;
    _counter: HTMLElement;
    _wrapper: HTMLElement

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._buttonBasket = ensureElement<HTMLElement>('.header__basket');

    this._buttonBasket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  set counter(items: number) {
    this.setText(this._counter, items.toString())
  }

  set locked(value: boolean) {
    if (value) {
        this._wrapper.classList.add('page__wrapper_locked');
    } else {
        this._wrapper.classList.remove('page__wrapper_locked');
    }
}
    
}

