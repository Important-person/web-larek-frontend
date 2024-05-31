export interface ICard {
    id?: string;
    description?: string;
    image?: string;
    title?: string;
    category?: string;
    price?: number | null;
}

export interface IUserInformation {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

export interface IAppState {
    items: ICard[];
    order: ISendOrder;
    basket: ICard[];
    openCard: ICard;
    formErrors: TFormErrors;

    addCardBusket(card: ICard): void;
    deleteCardBusket(id: string): void;
    clearBasket(): void;
    getTotalBasket(): number;
    costOrder(prise: number[]): number;
    setUserInformation(field: keyof IUserInformation, value: string): void;
    validationUserInformationOrder(): void;
    validationUserInformationContacts(): void;
    cleanUserInformation(): void;
    setCardList(data: ICard[]): void;
    setPreview(item: ICard): void;
}

export interface ISendOrder extends IUserInformation{
    items: string[];
    total: number | null;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TUserInformationOne = Pick<IUserInformation, 'payment' | 'address'>;

export type TUserInformationTwo = Pick<IUserInformation, 'email' | 'phone'>;

export type TCardBusketItem = Pick<ICard, 'id' | 'title' | 'price'>;

export type TFormErrors = Partial<Record<keyof ISendOrder, string>>;

export type CardCategory = {
    другое: string;
    'софт-скил': string;
    дополнительное: string;
    кнопка: string;
    'хард-скил': string;
};




