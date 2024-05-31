import {Form} from './common/Form';
import {IEvents} from './base/events';
import {TUserInformationTwo} from '../types/index';

export class Contacts extends Form<TUserInformationTwo> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
}