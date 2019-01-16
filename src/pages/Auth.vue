<template lang="pug">
    form.form-password(@submit.prevent="login")
        fieldset.form-password__box
            legend.form-password__title Для входа в личный кабинет #[br] введите свои учетные данные
            .form-password__logo
                img(src="@/assets/img/logo.png" alt="Логотип")
            ul.form-password__list
                li.form-password__item.form-password__field
                    base-field(
                    type="email"
                    placeholder="Введите Е-email"
                    autocomplete="off"
                    name="email"
                    )
                li.form-password__item.form-password__field
                    base-field(
                    type="password"
                    placeholder="Введите пароль"
                    autocomplete="off"
                    name="password"
                    )
            .form-password__bottom
                .form-password__btn
                    base-btn(theme="sign") Войти
                router-link.form-password__link(:to='{name:"recover"}' ) Забыли пароль?
</template>

<script>
    import AccountAuth from '@/components/AccountAuth'

    export default {
        components: {
            AccountAuth
        },
        computed: {}
    }
</script>

