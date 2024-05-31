import {Component} from "../base/Component";
import {EventEmitter} from "../base/events";

interface IBasket { 
    list: HTMLElement[];
    cost: number;
    status: boolean;
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _cost: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._button = container.querySelector('.basket__button');
        this._cost = container.querySelector('.basket__price');
        this._list = container.querySelector('.basket__list');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('basketButton:order');
            })
        }
    }

    set list(elements: HTMLElement[]) {
        this._list.replaceChildren(...elements)
    }

    set status(value: boolean) {
        this.setDisabled(this._button, value)
    }

    set cost(cost: number) {
        this._cost.textContent = cost.toString() + ' синапсов'
    }
}
