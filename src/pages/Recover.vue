<template lang="pug">
    form.form-password(@submit.prevent="submit")
        fieldset.form-password__box
            .form-password__logo
                img(src="@/assets/img/logo.png" alt="Логотип")
            .form-password__list
                .form-password__item.form-password__field(v-if="!passwordSent")
                    base-field(type="email" placeholder="Введите Е-email" autocomplete="off" name="email")
                p.form-password__text(v-else) Новый пароль отправлен #[br] на указанный e-mail
            .form-password__bottom
                .form-password__btn
                    base-btn(theme="sign" type="submit" v-if="!passwordSent") Восстановить пароль
                router-link.form-password__link(:to='{name:"auth"}' v-if="!passwordSent") Я помню пароль
                router-link.form-password__link(:to='{name:"auth"}' v-else) Вернуться ко входу

</template>
<script>
    export default {
        components: {},
        data() {
            return {
                email: '',
                passwordSent: false
            }
        },
        methods: {
            submit() {
                this.passwordSent = true;

            },


        }
    }
</script>
<style lang="scss">
    .form-password__text{
        font-size:$font-size_h1;
        font-weight:300;
        line-height:1.7;
    }
</style>

