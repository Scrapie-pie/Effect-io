<template lang="pug">
    .chat-page
        header.chat-page__header
            user-status
            nav-main(:item-list="menuList")
        main.chat-page__main
            transition(name="fade" mode="out-in")
                router-view


</template>

<script>

    import NavMain from '@/components/NavMain'

    export default {
        components: {NavMain},
        data() {
            return {
                menuList: [
                    {text: 'Настройки приложения', link: {name: 'settingsApp'}},
                    {text: 'Настройки профиля', link: {name: 'settingsProfile'}},
                    {text: 'Форма авторизации', link: {name: 'auth'}},

                    {text: 'Ui', link: {name: 'ui'}},
                    {text: 'Команда', link: {name: 'team'}},
                    {text: 'Посетители', link: {name: 'visitor'}},
                ]
            }
        }
    }
</script>


<style lang="scss">
    .chat-page{
        $box-shadow:$glob-box-shadow;
        display:flex;
        height:100%;

        &__header{
            width:175px;
            @include box-decor();
            border-radius:0;
            padding:0;
        }

        &__main{
            flex:1;
            padding:calc-em(15);
        }
    }


</style>
