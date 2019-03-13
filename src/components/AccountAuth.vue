<template lang="pug">
    form.account-auth(@submit.prevent="submit")
        fieldset.account-auth__box
            legend.account-auth__title(v-text="title")
            .account-auth__logo
                img(src="@/assets/img/logo.png" alt="logo")
            template(v-if="!recoveryPage")
                p.account-auth__error-text(v-if="errorApiText" v-text="errorApiText")
                ul.account-auth__list()
                    li.account-auth__item.account-auth__field
                        base-field(
                            type="email"
                            placeholder="Введите Е-email"
                            name="email"
                            v-validate="'required'"  v-model="login"
                        )

                    li.account-auth__item.account-auth__field
                        base-field(
                            type="password"
                            placeholder="Введите пароль"
                            name="password"
                            v-validate="'required|max:32|min:6'"
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
                        base-field(
                            type="email"
                            placeholder="Введите Е-email"
                            name="email"
                            v-validate="'required'"  v-model="login"
                        )
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
                recoveryPage: false,
                login: '', //testrbcall@mail.ru fanhorsis@yandex.ru http://mishki.ucoz.net
                password: '', //321tceffE
                title: 'Для входа в личный кабинет введите свои учетные данные',
                passwordSent: false,
                errorApiText:''
            }
        },
        watch: {
            errorApiText(val) {
                if(val) {
                    setTimeout(()=>{
                        this.errorApiText=false;
                    },5000)
                }
            },
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
                    this.recoveryPage = true;
                }
                else this.recoveryPage = false
            },
            submit() {
                this.$validator.validateAll()
                    .then(success => {
                        if (success) {
                            if (this.recoveryPage) {
                                this.recoverRequest()
                            }
                            else {
                                this.sendLoginRequest()
                            }
                        }
                    })

            },
            sendLoginRequest() {

                let data = {
                    name: this.login,
                    password: this.password,

                }

           /*
              data = {
                    name: 'fanhorsis@gmail.com',
                    password: 'msitnikov',

                }
              data = {
                    name: 'TooManyRequestsHttpException@abk.ru',
                    password: 'TooManyRequestsHttpException',

                }*/
            /*     data = {
                    name: 'testrbcall@mail.ru',
                    password: '321tceffE',

                }*/
             /*   data = {
                    name: 'r.bochkarev@bk.ru',
                    password: 'qF5grpgY5e_',

                }*/
                this.$http.post('login', data, {
                    headers: { 'content-type': 'application/json' }
                }).then(({data}) => {


                    this.$store.dispatch('user/getLogin', data.user).then(()=>{
                        if (this.$route.query.return) this.$router.push(this.$route.query.return)
                        else this.$router.push({name:'processAll'})
                    })

                }).catch((errors)=>{

                    this.errorApiText = errors.response.data.message;

                })

            },
            recoverRequest() {
                let data = {
                    email: this.login,
                };
                this.$http.post('forgot-password', data, {
                    headers: { 'content-type': 'application/json' }
                }).then(() => {

                    this.passwordSent = true;
                })
            }

        }
    }
</script>

<style lang="scss">
    .account-auth{
        $color_error:glob-color('error');
        $font-size_small:$glob-font-size_small;
        margin-left:-($glob-indent-main-lr);
        margin-right:-($glob-indent-main-lr);

        display:flex;
        align-items:center;
        justify-content:center;
        height:100%;
        background-color:#f5f6f9;
        text-align:center;
        min-height:500px;

        &__error-text {
            color:$color_error;
            font-size:$font-size_small;
            margin-bottom:calc-em(20);
            margin-top:-2em;
        }

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
