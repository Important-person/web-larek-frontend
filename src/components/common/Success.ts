import {Component} from '../base/Component';

interface IAction { onClick: () => void }
  
  export interface ISuccess {
    cost: number;
  }
  
  export class Success extends Component<ISuccess> {
    protected _button: HTMLButtonElement;
    protected _cost: HTMLElement;
  
    constructor(container: HTMLElement, actions?: IAction) {
      super(container);
  
      this._button = container.querySelector('.order-success__close');
      this._cost = container.querySelector('.order-success__description');
  
      if (actions?.onClick) {
        if (this._button) {
          this._button.addEventListener('click', actions.onClick)
        }
      }
    }
  
    set cost(cost: number) {
      this._cost.textContent = 'Списано ' + cost + ' синапсов'
    }
  }