<template lang="pug">
    form.form-otrs(@submit.prevent="submit")
        base-wait(name="otrsSend")
        fieldset.form-otrs__fieldset
            legend.form-otrs__title Создание заявки в ОТРС
            p(v-text="errText" v-if="errText" class="form-otrs__errText")
            ul.form-otrs__list
                li.form-otrs__item
                    base-field(
                        type="text"
                        name="login",
                        placeholder="Введите логин (e-mail) клиента"
                        v-model="email",
                        :disabled="!!visitorsEmail",
                        @blur="saveTextArea"
                        )
                li.form-otrs__item
                    base-field(
                        type="textarea"
                        name="textarea",
                        placeholder="Комментарий"
                        maxLength="5000"
                        v-model="operator_comment",
                        @blur="saveTextArea"
                    )
                li.form-otrs__item
                    base-field(
                    type="select",
                    :selectOptions="{label:'title',options:selectCategories}"
                    name="category"
                    v-model="category",
                    @blur="saveTextArea"
                    v-validate="'required'"
                    data-vv-as="\"Категория\""
                    )

            base-btn.form-otrs__submit(type="submit" v-wait:disabled='"otrsSend"') Отправить
            base-btn(color="error", @click="$root.$emit('globBoxControlClose')") Отмена
</template>

<script>
import { httpParams } from '@/mixins/mixins'
export default {
    mixins: [httpParams],

    data() {
        return {
            errText: '',
            email: '',
            operator_comment: '',
            category: {}
        }
    },
    computed: {
        visitorsEmail() {
            return this.$store.state.visitors.itemOpen.regRuLogin
        },
        selectCategories() {
            return [
                { title: 'Финансовые вопросы', val: 'billing' },
                { title: 'Домены/SSL/ЛК', val: 'support' },
                { title: 'ТП Хостинга', val: 'hosting' },
                { title: 'Dedicated/Colocation', val: 'hosting-cloud' },
                { title: 'Перенос сайта', val: 'hosting-move' },
                { title: 'Правовые вопросы в Abuse', val: 'abuse' },
                { title: 'Отдел по работе с партнерами', val: 'partner' },
                { title: 'Конструктор сайтов', val: 'hosting-site-pro' },
                { title: 'Свидетельства', val: 'Свидетельства/Сертификаты' },
                { title: 'Договоры', val: 'Договоры' }
            ]
        }
    },
    watch: {
        visitorsEmail: {
            handler(val) {
                this.email = val
            },
            immediate: true
        }
    },
    mounted() {
        this.getTextArea()
        //this.getLoginRegRu()
    },
    methods: {
        getTextArea(){
            const {site_id,guest_uuid,chat_id} = this.httpParams.params
            let list = this.$store.state.visitors.self

            let find = list.find(item => item.site_id + item.guest_uuid+item.chat_id === site_id + guest_uuid + chat_id)
            if(find) {
                this.email = find?.formOTRS?.email || ''
                this.operator_comment = find?.formOTRS?.operator_comment || ''
                this.category = find?.formOTRS?.category || ''
            }
        },
        saveTextArea(){
            this.$store.commit(`visitors/saveTextAreaPopups`, {
                ids: this.httpParams.params,
                nameComponent: 'formOTRS',
                obj:{
                    email:this.email,
                    operator_comment:this.operator_comment,
                    category:this.category
                }
            })
        },
        getLoginRegRu() {
            let params = this.httpParams.params

            this.$http.get('regru/regru/get-login-by-uuid', { params }).then(({ data }) => {
                this.email = data.data.login
            })
        },
        submit() {
            let data = this.httpParams.params
            data.email = this.email
            data.operator_comment = this.operator_comment
            data.category = this.category.val

            this.$http
                .post('regru/regru/send-ticket-to-crm', data)
                .then(({ data }) => {
                    this.$root.$emit('globBoxControlClose')

                    //this.$root.$emit('popup-notice', 'Заявка успешно  отправлена!')
                    //this.$root.$emit('popup-notice', data.data.message)
                    //this.$root.$emit('popup-notice', '<a>kakos</a>')
                })
                .catch(err => {
                    //this.$root.$emit('popup-notice', err.response.data.message)
                    this.errText = err.response.data.message
                    setTimeout(() => {
                        this.errText = ''
                    }, 3000)
                    //this.$root.$emit('popup-notice', err.response.data.message)
                    //this.$root.$emit('formORTS')
                })
        }
    }
}
</script>

<style lang="scss">
.form-otrs {
    $self: '.form-otrs';

    width: 245px;
    @include media($width_xs, 1) {
    }

    text-align: left;

    &__fieldset {
        min-width: auto;
    }

    &__errText {
        color: glob-color('error');
        word-break: break-word;
        margin-bottom: calc-em(20);
    }

    &__item {
        margin-bottom: calc-em(20);

        .field__select.v-select .vs__dropdown-menu {
            max-height: 200px;
            bottom: calc(100% + 3px);
            top: auto;
        }
    }

    &__input {
        margin-top: calc-em(15);
        margin-bottom: calc-em(30);
    }

    &__title {
        @extend %h4;
    }
    &__submit {
        margin-right: calc-em(15);
    }
}
</style>
