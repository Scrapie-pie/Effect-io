<template lang="pug">
    form.form-password(@submit.prevent="submit")
        fieldset.form-password__box
            legend.form-password__title(v-text="title")
            .form-password__logo
                img(src="@/assets/img/logo.png" alt="logo")

            template(v-if="!recover")
                ul.form-password__list()
                    li.form-password__item.form-password__field
                        base-field(
                        type="email"
                        placeholder="Введите Е-email"
                        name="login"
                        v-validate="'required|email'" data-vv-as="логин" v-model="email"
                        )
                    li.form-password__item.form-password__field
                        base-field(
                        type="password"
                        placeholder="Введите пароль"
                        name="password"
                        v-validate="'required'"
                        data-vv-as="пароль"
                        v-model="password"
                        )
                .form-password__bottom
                    .form-password__btn
                        base-btn(theme="sign" type="submit") Войти
                    router-link.form-password__link(:to='{name:"recover"}' ) Забыли пароль?

            template(v-else)
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
                recover: false,
                email: '',
                password: '',
                title: 'Для входа в личный кабинет введите свои учетные данные',
                disableLoginForm: false,
                passwordSent: false
            }
        },
        watch: {
            '$route'(from, to) {
                this.selectTemplate()
            }
        },
        created() {
            this.selectTemplate()

        },
        methods: {
            selectTemplate() {
                if (this.$route.name == 'recover') {
                    this.title = 'Для восстановления пароля введите Ваш email';
                    this.recover = true;
                }
                else this.recover = false
            },
            submit() {
                if (this.recover) {
                    this.passwordSent = true;
                }
                else {
                    this.login()
                }


            },
            login() {
                console.log('login');
                return this.$router.push({name: 'settingsApp'})

                if (!this.disableLoginForm) {
                    this.$validator.validateAll()
                        .then(success => {
                            if (success) {
                                this.buffering = true
                                this.sendLoginRequest()
                            }
                        })
                } else {
                    flash(['Пароль был введен некорректно несколько раз. <br> Попытайтесь снова через 5 минут'], 'error')
                }
            },
            sendLoginRequest() {
                let obj = {
                    userName: this.email,
                    password: this.password,
                    grant_type: 'password'
                }
                obj = {
                    userName: 'j40975@nwytg.net',
                    password: 'Qwe12345!',
                    grant_type: 'password'
                }

                let data = []

                for (let field in obj) data.push(encodeURIComponent(field) + '=' + encodeURIComponent(obj[field]))

                data = data.join('&')
                axios({
                    method: 'POST',
                    url: '/auth/Token',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(({data}) => {
                        this.buffering = false
                        this.$store.commit('buffering', false)
                        this.$store.dispatch('user/login', data)
                    })
                    .then(() => {
                        this.$router.push('/')
                    })
                    .catch((error) => {
                        console.log(error);

                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log(error.response.data)
                            console.log(error.response.status)
                            console.log(error.response.headers)
                        } else if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log(error.request)
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message)
                        }
                        console.log(error.config)


                        flash(['Логин или пароль неверные'], 'error')
                        this.buffering = false
                    })
            }

        }
    }
</script>

<style lang="scss">
    .form-password{
        display:flex;
        align-items:center;
        justify-content:center;
        height:100%;
        background-color:#f5f6f9;
        text-align:center;
        &__box{
            @include box-decor();
            padding:2em 2em 2em;
            width:100%;
            max-width:370px;
            box-shadow:0 2px 50px 1px rgba(0, 0, 0, 0.12);
        }

        &__title{
            @extend %visuallyhidden;
        }

        &__logo{
            margin-bottom:2em;
        }

        &__list{
            display:flex;
            flex-flow:column;
            justify-content:center;
            height:130px;
        }

        &__item{
            margin-bottom:2em;
        }

        &__field{
            .field__input{
                border:0;
                border-radius:0;
                border-bottom:1px solid glob-color('info');
                text-align:center;
                font-size:$font-size_h1;
                font-weight:300;
                $p:calc-em(5);
                padding-top:$p;
                padding-bottom:$p;
            }
        }

        &__btn{
            margin-bottom:3.5em;
            height:51px;
            .btn{
                $p:calc-em(13);
                padding-top:$p;
                padding-bottom:$p;
                font-size:calc-em(16);
                width:100%;
            }
        }

        &__bottom{
            padding-top:.5em;
        }
        &__link{
            color:glob-color('main');
        }

        &__text{
            font-size:$font-size_h1;
            font-weight:300;
            line-height:1.7;
        }
    }
</style>
