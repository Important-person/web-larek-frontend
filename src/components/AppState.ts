import { Model } from './base/Model';
import { ICard, IAppState, ISendOrder, TFormErrors, IUserInformation } from '../types/index';

export class AppState extends Model<IAppState> {
    items: ICard[] = [];
    basket: ICard[] = [];
    openCard: ICard | null;
    order: ISendOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: null,
    };
    formErrors: TFormErrors = {};

    addCardBasket(card: ICard): void {
        this.basket.push(card);
    }

    deleteCardBasket(id: string): void {
        this.basket = this.basket.filter(item => item.id !== id);
    }

    clearBasket(): void {
        this.basket = [];
        this.events.emit('basket:updated');
    }

    getTotalBasket(): number {
        return this.basket.length;
    }

    costOrder(): number {
        return this.basket.reduce((a, c) => a + c.price, 0);
    }

    setUserInformation(field: keyof IUserInformation, value: string): void {
        this.order[field] = value;
        if (field === 'address' || field === 'payment') {
            if(this.validationUserInformationOrder()) {
                this.events.emit('order:ready', this.order);
            }
        } else if (field === 'email' || field === 'phone') {
            if(this.validationUserInformationContacts()) {
                this.events.emit('contact:ready', this.order);
            }
        }
        
    }

    validationUserInformationOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsOrder:validation', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validationUserInformationContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать номер телефона';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsContacts:validation', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    cleanOrderInformation(): void {
        this.order.items =  [];
        this.order.total = null;
    }

    setCardList(data: ICard[]): void {
        this.items = data;
        this.emitChanges('cardsChanged:change', { catalog: this.items });
    }

    setPreview(item: ICard): void {
        this.openCard = item;
        this.emitChanges('preview:changed', item);
    }
}
