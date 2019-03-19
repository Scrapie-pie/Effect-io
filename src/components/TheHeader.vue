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

                appList: [
                   /* {text: 'recover', link: {name: 'recover'}},
                    {text: 'Ui', link: {name: 'ui'}},*/
                    {text: 'Статистика', link: {name: 'statsService'},icon:'stats'},
                    {text: 'Настройки', link: {name: 'settingsProfile'},icon:'settings'},
                    //{text: 'Сменить учетную запись', link: {name: 'auth'}},
                    {text: 'Выход', link: {name: 'exit'}},
                ],
            }
        },
        computed:{
            canalList(){
                let list = [
                    {text: 'Не обработано', link: {name:'processAll'},unread:this.unreadProcess,icon:'process'},
                    {text: 'Мои диалоги', link: {name:'messageAll'},unread:this.unreadGuest,icon:'chatId'},
                    {text: 'Команда', link: {name: 'team'},unread:this.unreadPrivate},
                    {text: 'Посетители', link: {name: 'visitors'}}
                ];
                if(this.$store.state.user.profile.common_room_id) list.push({text: 'Общий чат ', link: {name: 'common'},unread:this.unreadCommon})

                return list

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
