import { Component } from "./base/Component";
import { ensureElement } from '../utils/utils';
import {settingsCategory} from '../utils/constants'
import { ICard, CardCategory} from "../types";

interface IAction { onClick: () => void; }

export class Card<T> extends Component<ICard> {
    _title: HTMLElement;
    _category: HTMLElement;
    _image?: HTMLImageElement;
    _description?: HTMLElement;
    _price: HTMLElement;
    _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: IAction) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }           
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set price(value: number | null) {
        if(value) {
            this._price.textContent = String(value) + ' синапсов'
        } else {
            this._price.textContent = 'Бесценно'
        }
    }

    set category(value: keyof CardCategory) {
        const className = Array.from(this._category.classList).filter(item => item.startsWith('card__category_'));
        if(className) {
            this._category.classList.remove(String(className))
        }
        this._category.classList.add(`card__category_${settingsCategory[value]}`);
        this.setText(this._category, value)
    }

    status(value: boolean) {
        this.setDisabled(this._button, value)
    }
}

export interface ICardBusketItem extends ICard{
    index: number;
    price: number;
    title: string;
}

export class CardBasket extends Component<ICardBusketItem> {
    _index?: HTMLElement;
    _buttonCloseBasket: HTMLButtonElement;
    _price: HTMLElement;
    _title: HTMLElement;

    constructor(blockName: string, container: HTMLElement, actions?: IAction) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = container.querySelector(`.${blockName}__price`);
        this._buttonCloseBasket = container.querySelector('.basket__item-delete');
        this._index = container.querySelector('.basket__item-index');

        if (this._buttonCloseBasket) {
            this._buttonCloseBasket.addEventListener('click', actions?.onClick)
        }       
    }

    set index(value: number) {
        if (this._index) {
            this.setText(this._index, value);
        }
    }

    set price(value: number | null) {
        if(value) {
            this._price.textContent = String(value) + ' синапсов'
        } else {
            this._price.textContent = 'Бесценно'
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }
}





