<template lang="pug">
    header.header
        user-status.header__user-status
        nav-main.header__nav-main(:item-list="canalList")
        nav-main.header__nav-app(:item-list="appList")
</template>

<script>
    import NavMain from '@/components/NavMain';
    import UserStatus from '@/components/UserStatus';

    export default {
        components: {
            NavMain,
            UserStatus,
        },
        data() {
            return {
                canalList: [
                    {text: 'Не обработано', link: {name: 'process'}},
                    {text: 'Мои диалоги', link: {name: 'dialog'}},
                    {text: 'Команда', link: {name: 'team'}},
                    {text: 'Посетители', link: {name: 'visitors'}},
                    {text: 'Общий чат ', link: {name: 'common'}},
                ],
                appList: [
                    {text: 'recover', link: {name: 'recover'}},
                    {text: 'Ломанный маршрут', link: {name: 'bad'}},
                    {text: 'Ui', link: {name: 'ui'}},
                    {text: 'Настройки', link: {name: 'settingsProfile'}},
                    //{text: 'Сменить учетную запись', link: {name: 'auth'}},
                    {text: 'Выход', link: {name: 'exit'}},
                ],
            }
        },

    }
</script>


<style lang="scss">

    .header {
        position:relative;
        @include box-decor();
        display:flex;
        flex-flow:column;
        min-width:165px;
        width:165px;
        padding:0 0 calc-em(30);
        border-radius:0;

        @include media($width_lg){
            min-width:75px;
            width:75px;
        }

        &__nav-app{
            margin-top:auto;
        }

        &__user-status{

            padding-bottom: 7.5vh;
        }

    }


</style>
