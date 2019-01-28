<template lang="pug">
    form.account-auth(@submit.prevent="submit")
        fieldset.account-auth__box
            legend.account-auth__title(v-text="title")
            .account-auth__logo
                img(src="@/assets/img/logo.png" alt="logo")

            template(v-if="!recover")
                ul.account-auth__list()
                    li.account-auth__item.account-auth__field
                        base-field(
                        type="email"
                        placeholder="Введите Е-email"
                        name="login"
                        v-validate="'required|email'" data-vv-as="логин" v-model="email"
                        )
                    li.account-auth__item.account-auth__field
                        base-field(
                        type="password"
                        placeholder="Введите пароль"
                        name="password"
                        v-validate="'required'"
                        data-vv-as="пароль"
                        v-model="password"
                        )
                .account-auth__bottom
                    .account-auth__btn
                        base-btn(theme="sign" type="submit") Войти
                    router-link.account-auth__link(:to='{name:"recover"}' ) Забыли пароль?

            template(v-else)
                .account-auth__list
                    .account-auth__item.account-auth__field(v-if="!passwordSent")
                        base-field(type="email" placeholder="Введите Е-email" autocomplete="off" name="email")
                    p.account-auth__text(v-else) Новый пароль отправлен #[br] на указанный e-mail
                .account-auth__bottom
                    .account-auth__btn
                        base-btn(theme="sign" type="submit" v-if="!passwordSent") Восстановить пароль
                    router-link.account-auth__link(:to='{name:"auth"}' v-if="!passwordSent") Я помню пароль
                    router-link.account-auth__link(:to='{name:"auth"}' v-else) Вернуться ко входу

</template>

<script>

    import { hideHeader } from '@/mixins/mixins'
    export default {
        components: {},
        mixins:[hideHeader],
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
                return this.$router.push({name: 'process'})

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
    .account-auth{

        margin-left:-($glob-indent-main-lr);
        margin-right:-($glob-indent-main-lr);

        display:flex;
        align-items:center;
        justify-content:center;
        height:100%;
        background-color:#f5f6f9;
        text-align:center;
        min-height:500px;

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
                font-size:$glob-font-size_h1;
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
            font-size:$glob-font-size_h1;
            font-weight:300;
            line-height:1.7;
        }
    }
</style>
