import {ApiListResponse, Api} from './base/api';

import {IOrderResult, ISendOrder, ICard} from '../types';

export interface IAppAPI {
    getCardItems(): Promise<ApiListResponse<ICard>>;
    orderItems(items: ISendOrder): Promise<IOrderResult>
}

export class AppAPI extends Api implements IAppAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItems(): Promise<ApiListResponse<ICard>> {
        return this.get('/product').then((data: ApiListResponse<ICard>) => ({
            ...data,
            items: data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        }));
    }
    

    orderItems(items: ISendOrder): Promise<IOrderResult> {
        return this.post('/order', items).then(
            (data: IOrderResult) => data
        );
    }
}
