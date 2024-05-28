export interface IPostcard {
    total: number;
    items: ICard[];
}

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IUserInformation {
    paymentMethod?: string;
    address?: string;
    email?: string;
    tell?: string;
}

export interface IAppState {
    items: ICard[];
    order: ISendOrder;
    basket: ICard[];
    openCard: ICard;
    isOrderReady: string | null;
    validationError: boolean;
    sumOrder: number;

    getCard(id: string): ICard[];
    addCardBusket(card: ICard): void;
    deleteCardBusket(id: string): void;
    clearBasket(): void;
    getTotalBasket(): number;
    costOrder(prise: number[]): number;
    setUserInformationOne(data: TUserInformationOne): void;
    setUserInformationTwo(data: TUserInformationTwo): void;
    validationUserInformationOne(): void;
    validationUserInformationTwo(): void;
    cleanUserInformation(): void;
    setCardList(data: ICard[]): void;
    setPreview(item: ICard): void;
}

export interface ISendOrder extends IUserInformation{
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TUserInformationOne = Pick<IUserInformation, 'paymentMethod' | 'address'>;

export type TUserInformationTwo = Pick<IUserInformation, 'email' | 'tell'>;

export type TCardBusketItem = Pick<ICard, 'id' | 'title' | 'price'>;





