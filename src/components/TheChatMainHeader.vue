<template lang="pug">
    header.chat-main-header
        .chat-main-header__text
            h1.chat-main-header__name(v-text="clientName")
            p.chat-main-header__channel На сайте: site.ru -&nbsp;
                base-btn(
                    theme="text",
                    @click.prevent="showClientHistoryActions=true"
                ).btn-arrow
                    | Кеды для спорта
                    span.btn-arrow__arrow(:class="{'btn-arrow__arrow':showClientHistoryActions}")
                base-box-menu.chat-main-header__client-history-actions(
                    :show="showClientHistoryActions",
                    @base_box_menu_close="showClientHistoryActions=false"
                )
                    ul.chat-main-header__client-history-list
                        li.chat-main-header__client-history-item
                            |На страницу - https://effect.com/
                        li.chat-main-header__client-history-item
                            | На страницу - Effect.com - феноменальный подход к общению с клиентами на сайте (https://effect.com/)
                        li.chat-main-header__client-history-item
                            | Заказал звонок
                        li.chat-main-header__client-history-item
                            |Написал в чат

        ul.chat-main-header__controls
            li.chat-main-header__control
                base-btn(
                    theme="default"
                    padding="xs",
                    @click.prevent="showInvite=true"
                ) + Пригласить
                base-box-menu.chat-main-header__select-operator(
                    :show="showInvite",
                    @base_box_menu_close="showInvite=false"
                )
                    the-select-operator

            li.chat-main-header__control
                base-btn(
                :icon="{name:'more'}",
                @click.prevent="showMoreChatActions=true"
                ).chat-main-header__more-btn
                base-box-menu.chat-main-header__more(
                :show="showMoreChatActions",
                @base_box_menu_close="showMoreChatActions=false"
                )
                    ul.chat-main-header__more-list
                        li.chat-main-header__more-item
                            base-btn(:icon="{name:'transfer',top:true}") Передать диалог
                        li.chat-main-header__more-item
                            base-btn(:icon="{name:'exit',top:true}") Выйти из диалога
                        li.chat-main-header__more-item
                            base-btn(:icon="{name:'bl',top:true}") Блокировать клиента



</template>

<script>
    import TheSelectOperator from '@/components/TheSelectOperator'
    export default {
        components: {
            TheSelectOperator
        },
        data() {
            return {
                clientName: '',
                showClientHistoryActions:false,
                showInvite:false,
                showMoreChatActions:false,
                //moreActionsClose:false,
            }
        },
        created() {
            this.clientName = 'Петр Иванов';

        },



    }
</script>

<style lang="scss">
    .chat-main-header{
        $color_info-dark:glob-color('info-dark');

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
        }
        &__select-operator {
            position:absolute;
            top:100%;
            right:0;
            left:0;
        }

        &__name{
            font-size:inherit;
            margin-bottom:.5em;
        }

        &__more-btn {
            .icon {
                fill:$color_info-dark;
                width:27px;
                height:17px;
            }
        }
        &__more-list {
            display:flex;
        }
        &__more-item {
            padding-left:calc-em(25);
            padding-right:calc-em(25);
            white-space:nowrap;
        }

        &__client-history-item {
            &+& {
                margin-top:calc-em(15);
            }
        }


    }
</style>