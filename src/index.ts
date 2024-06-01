import './scss/styles.scss';
import {EventEmitter} from './components/base/events';
import {AppState} from './components/AppState';
import {AppAPI} from './components/AppAPI';
import {Card, CardBasket} from './components/Card';
import {Contacts} from './components/Contacts';
import {Order} from './components/Order';
import {Page} from './components/Page';
import {Success} from './components/common/Success';
import {Modal} from './components/common/Modal';
import {Basket} from './components/common/Basket';
import {API_URL, CDN_URL} from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import {ICard, IOrderResult, ISendOrder, IUserInformation, TUserInformationOne, TUserInformationTwo} from './types'

//базовые компоненты
const events = new EventEmitter();
const api = new AppAPI(CDN_URL, API_URL);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//модель данных
const appData = new AppState({}, events);

//глобальные контейнеры отображения 
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
    onClick: (data: { name: string }) => {
        events.emit('buttonAlt:selected', data);
    }
})

//установка обработчика для выбора способа оплаты
events.on('buttonAlt:selected', (data: { name: string }) => {
    order.onInput('payment', `${data.name}`)
})

const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        events.emit('success:close');
    }
})

//установка обработчика для события success:close
events.on('success:close', () => {
    events.emit('modal:close');
    modal.close();
})

//получает карточки товаров с сервера
api.getCardItems()
    .then(data => appData.setCardList(data.items))
    .catch(err => {
        console.error(err);
    })

//установка обработчика: обновление карточек товаров в каталоге
events.on('cardsChanged:change', () => {
    const catalogItems = appData.items.map(item => {
        const card = new Card('card', cloneTemplate(catalogTemplate), {
            onClick: () => {
                events.emit('card:select', item)
            }
        });
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        });
    });
    page.catalog = catalogItems;
    page.counter = appData.getTotalBasket()
})

//установка обработчика: выбора открытой карточки
events.on('card:select', (item: ICard) => {
    appData.setPreview(item)
})

//установка обработчика: открытия карточки для просмотра
events.on('preview:changed', (item: ICard) => {
    const card = new Card('card', cloneTemplate(previewTemplate), {
        onClick: () => {
            events.emit('basketItem:add', item)
        }
    });

    //проверка есть ли элемент в корзине
    const cardInBasket = appData.basket.some(basketItem => basketItem.id === item.id);
    if(cardInBasket) {
        card.status(true)
    };

    return modal.render({
        content: card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            description: item.description,
            category: item.category,
        })
    });
})

//установка обработчика: добавления товара в карзину
events.on('basketItem:add', (item: ICard) => {
    appData.addCardBasket(item);
//проверка на заполненность корзины, для определения состояния кнопки 'оформить'
    if (!appData.basket.length || appData.costOrder() === 0) {
        basket.status = true;
    } else {
        basket.status = false;
    }
    page.counter = appData.getTotalBasket();
    basket.list = appData.basket.map((item, index) => {
        const cardBasket = new CardBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('basketItem:delete', item)
            }
        });
        return cardBasket.render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });
    basket.cost = appData.costOrder()

    modal.close();
});

//установка обработчика: открытие корзины
events.on('basket:open', () => {
    return modal.render({
        content: basket.render()
    });
})

//установка обработчика: удаления товара из корзины
events.on('basketItem:delete', (item: ICard) => {
    appData.deleteCardBasket(item.id);
    page.counter = appData.getTotalBasket();
    basket.cost = appData.costOrder();

    basket.list = appData.basket.map((item, index) => {
        const cardBasket = new CardBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('basketItem:delete', item)
            }
        });
        return cardBasket.render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });

//проверка на заполненность корзины, для определения состояния кнопки 'оформить'
    if (!appData.basket.length) {
        basket.status = true
    } else {
        basket.status = false
    }
})

//установка обработчика: для кнопки 'оформить' в корзине
events.on('basketButton:order', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: []
        })
    });
})

// установка обработчика: ввода данных  в input 
events.on('input:change', (data: { field: keyof IUserInformation, value: string }) => {
    appData.setUserInformation(data.field, data.value);
});

// установка обработчика: валидации данных в order
events.on('formErrorsOrder:validation', (errors: Partial<TUserInformationOne>) => {
    const { payment, address } = errors;
    const isValid = !payment && !address;
    const errorMessages = Object.values({ payment, address }).filter(i => !!i).join('; ');

    order.validation = isValid;
    order.error = errorMessages;
});

// установка обработчика: валидации данных в contacts
events.on('formErrorsContacts:validation', (errors: Partial<TUserInformationTwo>) => {
    const { email, phone } = errors;
    const isValid = !email && !phone;
    const errorMessages = Object.values({ email, phone }).filter(i => !!i).join('; ');

    contacts.validation = isValid;
    contacts.error = errorMessages;
});

// установка обработчика: для кнопки 'далее'
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// установка обработчика: для кнопки 'оплатить'
events.on('contacts:submit', () => {
    appData.order.total = appData.costOrder();
    appData.basket.forEach(item => {
        if(item.price > 0) {
            appData.order.items.push(item.id);
        }
    });
    api.orderItems(appData.order)
        .then((result) => {
            events.emit('orderSuccess:successfully', result)
        })
        .catch(err => {
            console.log(err)
        })
})

//установка обработчика: отрисовки success
events.on('orderSuccess:successfully', (result: IOrderResult) => {
    appData.clearBasket();
    appData.cleanOrderInformation();
    return modal.render({
        content: success.render({
            cost: result.total
        })
    });
})

//очистка корзины, обновление счетчика
events.on('basket:updated', () => {
    page.counter = appData.getTotalBasket();
    basket.list = appData.basket.map((item, index) => {
        const cardBasket = new CardBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('basketItem:delete', item);
            }
        });
        return cardBasket.render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });
    basket.cost = appData.costOrder();

    if (!appData.basket.length) {
        basket.status = true;
    } else {
        basket.status = false;
    }
});


//установка обработчика: блокировка страницы при открытие модального окна
events.on('modal:close', () => {
    page.locked = false;
})

//установка обработчика: снятие блокировки страницы при закрытии модального окна
events.on('modal:open', () => {
    page.locked = true;
})
