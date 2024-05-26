export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
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

    setCardList(data: ICard[]): void;
    getCard(id: string): ICard[];
    addCardBusket(card: ICard): void;
    deleteCardBusket(id: string): void;
    costOrder(prise: number[]): number;
    setUserInformation(data: IUserInformation): void;
    getUserInformation(): IUserInformation;
    cleanUserInformation(): void;
    validationMethod(data: Record<keyof IUserInformation, string>): boolean;
}

export interface ISendOrder extends IUserInformation{
    id: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TUserInformationOne = Pick<IUserInformation, 'paymentMethod' | 'address'>;

export type TUserInformationTwo = Pick<IUserInformation, 'email' | 'tell'>;

export type TCardBusketItem = Pick<ICard, 'id' | 'title' | 'price'>;





