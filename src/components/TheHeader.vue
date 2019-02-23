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
                    {text: 'recover', link: {name: 'recover'}},
                    {text: 'Ui', link: {name: 'ui'}},
                    {text: 'Настройки', link: {name: 'settingsProfile'}},
                    //{text: 'Сменить учетную запись', link: {name: 'auth'}},
                    {text: 'Выход', link: {name: 'exit'}},
                ],
            }
        },
        computed:{
            routerNameProcessVisitorsFirst(){



                    let visitorFirst = this.$store.state.visitors.process,
                        params = {uuid: 0,site_id:0}

                if (visitorFirst.length)  {
                    visitorFirst = visitorFirst[0],
                    params.uuid=visitorFirst.uuid;
                    params.site_id=visitorFirst.site_id
                }


                return {name:'process',params}
            },
            routerNameChatVisitorsFirst(){
                let visitorFirst = this.$store.state.visitors.self[0],
                params = {uuid: 0,site_id:0}
                if (visitorFirst)  {
                    params.uuid=visitorFirst.uuid;
                    params.site_id=visitorFirst.site_id
                }
                return {name:'chatId',params}
            },
            canalList(){
                return [
                    {text: 'Не обработано', link: this.routerNameProcessVisitorsFirst,unread:this.unreadGuest},
                    {text: 'Мои диалоги', link: this.routerNameChatVisitorsFirst,unread:this.unreadGuest,exact:true},
                    {text: 'Команда', link: {name: 'team'},unread:this.unreadPrivate},
                    {text: 'Посетители', link: {name: 'visitors'}},
                    {text: 'Общий чат ', link: {name: 'common'},unread:this.unreadCommon},
                ]
            },
            unread(){
                if (this.$store.state.user.profile.unread) return this.$store.state.user.profile.unread
                else return {}

            },
            unreadCommon(){
                return this.unread.common
            },
            unreadGuest(){
                return this.unread.guest
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
