<template lang="pug">
    form.account-auth(@submit.prevent="submit")
        fieldset.account-auth__box
            legend.account-auth__title(v-text="title")
            .account-auth__logo
                img(src="@/assets/img/logo.png" alt="logo")
            template(v-if="!recoveryPage")
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
                        base-field(
                            type="email"
                            placeholder="Введите Е-email"
                            name="login"
                            v-model="email"
                            v-validate="'required|email'" data-vv-as="login"
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
                email: '',//todo кастомнай компонент не обновляет значение v-model на другом кастомном компоненте
                password: '',
                title: 'Для входа в личный кабинет введите свои учетные данные',
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
                //todo Пароль был введен некорректно несколько раз. Попытайтесь снова через 5 минут ДОБАВЛЯЕМ?
                let data = {
                    name: this.email,
                    password: this.password,

                }
           /*     data = {
                    name: 'TooManyRequestsHttpException@bk.ru',
                    password: 'TooManyRequestsHttpException',

                }*/
            /*    data = {
                    name: 'simon.oganesyan@gmail.com',
                    password: '321tceffE',

                }*//*    data = {
                    name: 'r.bochkarev@bk.ru',
                    password: 'romanroman',

                }*/
                data = {
                    name: 'simon.oganesyan@gmail.com',
                    password: '321tceffE',
                }

                axios.post('app.php?login', data, {
                    headers: { 'content-type': 'application/json' }
                }).then(({ data }) => {
                    console.log('user', data.user)
                    this.$store.dispatch('user/login', data.user).then(()=>{
                        if (this.$route.query.return) this.$router.push(this.$route.query.return)
                        else this.$router.push({name:'process'})
                    })

                }).catch((error) => {
                    showError(error)
                    if (error.response.status == 429) alert('Аккаунт заблокирован, вы совершили много http запросов')
                })

            },
            recoverRequest() {
                let data = {
                    email: this.email,
                }
                axios.post('app.php?forgot-password', this.email, {
                    headers: { 'content-type': 'application/json' }
                }).then(({ data }) => {
                    console.log(data);
                    this.passwordSent = true;
                }).catch((error) => {
                    showError(error)
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
