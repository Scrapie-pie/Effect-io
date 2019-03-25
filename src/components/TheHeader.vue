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


            }
        },
        computed:{
            appList(){
                return [
                    /* {text: 'recover', link: {name: 'recover'}},
                     {text: 'Ui', link: {name: 'ui'}},*/
                    {text: 'Статистика', link: {name: 'stats'},icon:'statistics',hide:!this.$store.getters['user/isRole'](['admin','owner','operatorSenior'])},
                    {text: 'Настройки', link: {name: 'settingsProfile'},icon:'settingsApp'},
                    //{text: 'Сменить учетную запись', link: {name: 'auth'}},
                    {text: 'Выход', link: {name: 'exit'}},
                ]
            },
            canalList(){
                return [
                    {text: 'Не обработано', link: {name:'processAll'},unread:this.unreadProcess,icon:'process'},
                    {text: 'Мои диалоги', link: {name:'messageAll'},unread:this.unreadGuest,icon:'chatId'},
                    {text: 'Команда', link: {name: 'team'},unread:this.unreadPrivate},
                    {text: 'Посетители', link: {name: 'visitors'}},
                    {text: 'Общий чат ', link: {name: 'common'},unread:this.unreadCommon,hide:!this.$store.state.user.profile.is_common_chat}
                ]

            },
            unread(){
                return this.$store.state.user.profile.unread || {}

            },
            unreadCommon(){
                return this.unread.common
            },
            unreadGuest(){
                return this.unread.guest
            },
            unreadProcess(){
                return this.unread.unprocessed
            },
            unreadPrivate(){
                return this.unread.private
            },


        }

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

        z-index:2;

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
