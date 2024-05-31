import {TUserInformationOne} from '../types/index';
import {IEvents} from './base/events';
import {Form} from './common/Form';
import {ensureAllElements} from '../utils/utils'

export type buttonAlt = {
    onClick: (data: { name: string }) => void
}


export class Order extends Form<TUserInformationOne> {
    _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents, actions?: buttonAlt) {
        super(container, events)

        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                actions?.onClick?.({name: button.name});
                this.selected(button.name)
            });
        })
    }

    selected(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === name);
        });
    }
}