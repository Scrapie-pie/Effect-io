<template lang="pug">
    form.form-otrs(@submit.prevent="submit")
        fieldset
            legend.form-otrs__title Создание заявки в ОТРС

            base-field(
                type="text"
                name="login",
                placeholder="Введите логин (e-mail) клиента"
                v-model="email"
                )
            base-field.form-otrs__input(
                type="textarea"
                name="textarea",
                placeholder="Комментарий"

                v-model="operator_comment"
            )
            base-btn.form-otrs__submit(type="submit") Отправить
            base-btn(color="error", @click="$root.$emit('globBoxControlClose')") Отмена
</template>

<script>
import { httpParams } from '@/mixins/mixins'
export default {
    mixins: [httpParams],

    data() {
        return {
            email:'',
            operator_comment:''
        }
    },
    computed: {

    },
    created() {},
    methods: {
        submit() {

            let data = this.httpParams.params
            data.email = this.email
            data.operator_comment = this.operator_comment

            this.$http.post('regru/regru/send-ticket-to-crm', data).then(({ data }) => {
                this.$root.$emit('globBoxControlClose')
                setTimeout(()=>{
                    this.$root.$emit('popup-notice', 'Заявка успешно  отправлена!')
                },1000)

            })
        }
    }
}
</script>

<style lang="scss">
.form-otrs {
    $self: '.form-otrs';
    width:275px;
    text-align:left;

    &__input {
        margin-top:calc-em(15);
        margin-bottom: calc-em(30);
    }

    &__title {
        @extend %h4
    }
    &__submit {
        margin-right:calc-em(15);
    }

}
</style>
