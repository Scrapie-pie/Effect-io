import Vue from 'vue'

import VeeValidate, { Validator } from 'vee-validate'
import messagesRu from 'vee-validate/dist/locale/ru'

messagesRu.messages = { ...messagesRu.messages, confirmed: 'Пароли не совпадают' }
/*messagesRu.custom = {login: {email: 'В поле ЛОГИН укажите действующий электронный адрес'}}*/

Vue.use(VeeValidate)
Validator.localize('ru', messagesRu)
