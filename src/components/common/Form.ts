import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    _buttonSubmit: HTMLButtonElement;
    _error: HTMLElement

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._buttonSubmit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._error = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInput(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    set validation(valid: boolean) {
        this._buttonSubmit.disabled = !valid;
    }

    set error(massege: string) {
        this.setText(this._error, massege);
    }

    onInput(field: keyof T, value: string) {
        this.events.emit('input:change', {field, value})
    }

    render(state: Partial<T> & IFormState): HTMLElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
      }
}