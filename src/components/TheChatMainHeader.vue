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
                        the-select-operator

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
                        the-chat-main-header-actions



</template>

<script>
    import TheChatMainHeaderHistory from '@/components/TheChatMainHeaderHistory'
    import TheChatMainHeaderActions from '@/components/TheChatMainHeaderActions'
    import TheSelectOperator from '@/components/TheSelectOperator'
    export default {
        components: {
            TheChatMainHeaderHistory,
            TheChatMainHeaderActions,
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
                fill:glob-color('info-dark');
            }
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