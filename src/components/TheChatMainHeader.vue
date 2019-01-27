<template lang="pug">
    header.chat-main-header
        .chat-main-header__text
            h1.chat-main-header__members
                template(
                    v-for="(item, index) in membersList",

                )
                    span.chat-main-header__name(

                        :class="{'chat-main-header__name_open_client-info js-client-info':!index}"
                    )
                        | {{item}}
                        button(type="button" v-if="index").chat-main-header__name-tooltip Убрать из диалога
                    |{{separator(index)}}
            p.chat-main-header__channel На сайте: site.ru -&nbsp;
                base-btn(
                    theme="text",
                    @click.prevent="showClientHistoryActions=true"
                ).btn-arrow
                    | Кеды для спорта
                    span.btn-arrow__arrow(:class="{'btn-arrow__arrow':showClientHistoryActions}")
                .chat-main-header__client-history-actions
                    base-box-menu(
                        :show="showClientHistoryActions",
                        @base_box_menu_close="showClientHistoryActions=false"
                    )
                        the-chat-main-header-history

        ul.chat-main-header__controls
            li.chat-main-header__control
                base-btn(
                    theme="default"
                    padding="xs",
                    @click.prevent="showInvite=true"
                ) + Пригласить
                .chat-main-header__select-operator
                    base-box-menu(
                        :show="showInvite",
                        @base_box_menu_close="showInvite=false"
                    )
                        select-operators

            li.chat-main-header__control.chat-main-header__control_more
                base-btn(
                    :icon="{name:'more'}",
                    @click.prevent="showMoreChatActions=true"
                ).chat-main-header__more-btn
                .chat-main-header__more
                    base-box-menu(
                        :show="showMoreChatActions",
                        @base_box_menu_close="showMoreChatActions=false"
                    )
                        the-chat-main-header-actions()





</template>

<script>
    import TheChatMainHeaderHistory from '@/components/TheChatMainHeaderHistory'
    import TheChatMainHeaderActions from '@/components/TheChatMainHeaderActions'
    import SelectOperators from '@/components/SelectOperators'
    export default {
        components: {
            TheChatMainHeaderHistory,
            TheChatMainHeaderActions,
            SelectOperators
        },
        data() {
            return {
                membersList: [],
                showClientHistoryActions:false,
                showInvite:false,
                showMoreChatActions:false,
                //moreActionsClose:false,
            }
        },
        computed(){

        },
        methods:{
            getActions(e){
                if (e = 'blockClient' ) this.showConfirmBlockClient=true;
            },
            separator(index){
                if (!index) return ', '
            },

            showClientInfo(){
                document.getElementsByTagName('html')[0]
                    .classList.add('is-opened-client-info');
                document.addEventListener('click', this.hideClientInfo);

            },
            hideClientInfo(e) {



                if (!e.target.matches('.chat-dialog__info, .chat-dialog__info *,.js-client-info')) {
                    document.getElementsByTagName('html')[0]
                        .classList.remove('is-opened-client-info')
                    document.removeEventListener('click', this.hideClientInfo);
                }
            },

        },
        created() {
            this.membersList = ['Петр Иванов','Кирил'];

        },
        mounted(){
            document.querySelector('.js-client-info')
                .addEventListener('click', this.showClientInfo)

        },
        beforeDestroy() {
            document.removeEventListener('click', this.hideClientInfo);
        },



    }
</script>

<style lang="scss">
    .chat-main-header{


        position:relative;
        display:flex;
        justify-content:space-between;
        margin-bottom:2.5em;
        z-index:1;


        &__controls {
            display:flex;

        }

        &__control {
           /* position:relative;*/
            &_more {
                .icon_more {
                    fill:glob-color('info-dark');
                }

            }
        }

        &__select-operator {
            position:absolute;
            top:100%;
            right:0;
            left:0;
        }

        &__members{
            font-size:inherit;
            margin-bottom:.5em;
        }

        &__name {
            position:relative;


            &_open_client-info {
                @include media($width_md) {
                    border-bottom:1px dashed;
                }
            }

            &-tooltip {

                @include box-decor();
                position:absolute;
                top:100%;
                left:50%;
                z-index:1;

                margin-top:calc-em(10);
                padding:calc-em(10);

                border:0;
                opacity:0;
                visibility:hidden;

                white-space:nowrap;
                font-weight:400;

                transform:translateX(-50%);
            }

            &:hover &-tooltip {
                opacity:1;
                visibility:visible;
            }

        }



        &__more {
            position:absolute;
            right:0;
            top:100%
        }

        &__client-history-actions {
            position:absolute;
            top:100%;
            right:0;
            left:0;
        }


    }
</style>