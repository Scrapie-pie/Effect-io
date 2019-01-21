<template lang="pug">
    .chat-page
        header.chat-page__header
            user-status.chat-page__user-status
            nav-main.chat-page__nav-main(:item-list="canalList")
            nav-main.chat-page__nav-app(:item-list="appList")
        .chat-page__people-message
            base-field.chat-page__search(type="search" name="search" v-model="search" theme="soft")
            .chat-page__people
                ul.people-list
                    li.people-list__item(v-for="(item, index) in peopleList",:key="index")
                        base-people(:name="item.name" :text="item.text" :bg-text-no-fill="true")
        the-chat-main.chat-page__main
            //transition(name="fade" mode="out-in")
                router-view

        the-client-info.chat-page__info


</template>

<script>

    import TheClientInfo from '@/components/TheClientInfo';
    import TheChatMain from '@/components/TheChatMain';

    import NavMain from '@/components/NavMain';
    import UserStatus from '@/components/UserStatus';

    export default {
        components: {
            TheChatMain,
            TheClientInfo,
            NavMain,
            UserStatus,

        },
        data() {
            return {

                canalList: [
                    {text: 'Не обработано', link: {name: 'process'}},
                    {text: 'Мои диалоги', link: {name: 'my'}},
                    {text: 'Команда', link: {name: 'team'}},
                    {text: 'Посетители', link: {name: 'visitor'}},
                    {text: 'Общий чат ', link: {name: 'common'}},


                ],
                appList: [
                    {text: 'Ui', link: {name: 'ui'}},
                    {text: 'Настройки', link: {name: 'settingsApp'}},
                    {text: 'Сменить учетную запись', link: {name: 'settingsProfile'}},
                    {text: 'Выход', link: {name: 'auth'}},
                ],

                peopleList: [
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                ],


            }
        },
        computed: {}
    }
</script>


<style lang="scss">
    .chat-page{
        $box-shadow:$glob-box-shadow;
        display:flex;
        height:100%;

        &__header{
            @include box-decor();
            display:flex;
            flex-flow:column;
            z-index:1;
            width:165px;
            padding:0 0 calc-em(30);
            border-radius:0;
        }

        &__nav-app{
            margin-top:auto;
        }

        &__user-status{
            padding:calc-em(30) calc-em(20) calc-em(70);
        }

        &__people-message{
            width:275px;
            background-color:glob-color('info-lighten');

        }

        &__main{
            flex:1;
            padding:calc-em(15);
        }

        .people-list{
            &__item{
                padding:0 calc-em(7);
            }
        }

        &__info{
            margin-left:auto;
            width:300px;
        }


    }


</style>
