<template lang="pug">
    .chat-page
        header.chat-page__header.chat-page__padding
            user-status.chat-page__user-status
            nav-main.chat-page__nav-main(:item-list="canalList")
            nav-main.chat-page__nav-app(:item-list="appList")
        aside.chat-page__last-messages
            the-last-messages.chat-page__padding

        main.chat-page__main.chat-page__padding
            the-chat-main
            //transition(name="fade" mode="out-in")
                router-view

        footer.chat-page__info.chat-page__padding
            the-client-info


</template>

<script>

    import TheLastMessages from '@/components/TheLastMessagess';
    import TheClientInfo from '@/components/TheClientInfo';
    import TheChatMain from '@/components/TheChatMain';

    import NavMain from '@/components/NavMain';
    import UserStatus from '@/components/UserStatus';

    export default {
        components: {
            TheChatMain,
            TheLastMessages,
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
                    {text: 'Посетители', link: {name: 'visitors'}},
                    {text: 'Общий чат ', link: {name: 'common'}},


                ],
                appList: [
                    {text: 'Ui', link: {name: 'ui'}},
                    {text: 'Настройки', link: {name: 'settingsProfile'}},
                    //{text: 'Сменить учетную запись', link: {name: 'auth'}},
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
        $self:'.chat-page';
        $box-shadow:$glob-box-shadow;
        display:flex;
        height:100%;

        &__header{
            @include box-decor();
            display:flex;
            flex-flow:column;
            z-index:300;
            min-width:165px;
            width:165px;
            padding:0 0 calc-em(30);
            border-radius:0;

            @include media($width_md){
                min-width:75px;
            }

        }


        &__nav-app{
            margin-top:auto;
        }

        &__user-status{
            padding-bottom:calc-em(70);
        }

        &__main{
            flex:1;
            padding:calc-em(15);
        }

        &__last-messages{
            width:275px;
            background-color:glob-color('info-lighten');
            padding-bottom:calc-em(30);

            @include media($width_md){
                width:190px;
            }
        }

        &__info{
            margin-left:auto;
            width:280px;
            padding-right:calc-em(20);

            .client-info{
                margin-top:-1em;
            }

            @include media($width_md){
                width:19.532%;
                padding-right:calc-em(5);
            }
        }

        &__padding{
            padding-top:calc-em(30);
            padding-bottom:calc-em(30);
        }
    }


</style>
