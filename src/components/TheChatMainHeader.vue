<template lang="pug">
    header.chat-main-header
        .chat-main-header__text
            h1.chat-main-header__members
                span.chat-main-header__name.chat-main-header__name_open_client-info.js-client-info(
                    v-text="targetName"
                )
                template(v-for="(item, index) in compMembersList")
                    span.chat-main-header__name
                        | , {{item}}
                        button(type="button" v-if="index").chat-main-header__name-tooltip Убрать из диалога

            .chat-main-header__channel(v-if="viewModeChat=='visitors'") На сайте: site.ru -&nbsp;
                .chat-main-header__channel-btn-wrap
                    base-btn(
                        theme="text",
                    ).btn-arrow.chat-main-header__channel-btn
                        | Кеды для спорта
                        span.btn-arrow__arrow(:class="{'btn-arrow__arrow':showClientHistoryActions}")
                    .chat-main-header__client-history-actions()
                        the-chat-main-header-history

        ul.chat-main-header__controls
            li.chat-main-header__control
                base-btn(
                    theme="default"
                    padding="xs",
                    @click.prevent="showInvite=true"
                ) + Пригласить
                .chat-main-header__select-operator
                    box-controls(
                        :show="showInvite",
                        @box_control_close="showInvite=false"
                    )
                        select-operators

            li.chat-main-header__control.chat-main-header__control_more
                base-btn(
                    :icon="{name:'more'}",
                    @click.prevent="showMoreChatActions=true"
                ).chat-main-header__more-btn
                .chat-main-header__more
                    box-controls(
                        :show="showMoreChatActions",
                        @box_control_close="showMoreChatActions=false"
                    )
                        the-chat-main-header-actions()
</template>

<script>
    import TheChatMainHeaderHistory from '@/components/TheChatMainHeaderHistory'
    import TheChatMainHeaderActions from '@/components/TheChatMainHeaderActions'
    import SelectOperators from '@/components/SelectOperators'
    import { viewModeChat } from '@/mixins/mixins'

    export default {
        components: {
            TheChatMainHeaderHistory,
            TheChatMainHeaderActions,
            SelectOperators
        },
        mixins:[viewModeChat],
        data() {
            return {
                membersList: [],
                showClientHistoryActions:false,
                showInvite:false,
                showMoreChatActions:false,
                //moreActionsClose:false,
            }
        },
        computed:{
            targetName(){
                if (this.viewModeChat=="visitors") return this.$store.state.visitors.itemOpen.name;
                else {
                    return this.$store.state.operators.all.find( item => item.id == this.$route.params.id).fullName;

                }

            },
            compMembersList(){
                return this.membersList
            }
        },
        methods:{
            getActions(e){
                if (e = 'blockClient' ) this.showConfirmBlockClient=true;
            },
            separator(index){
                if (!index) return ', '
            },

            showClientInfo(){
                document.body
                    .classList.add('is-opened-client-info');
                document.addEventListener('click', this.hideClientInfo);

            },
            hideClientInfo(e) {
                if (!e.target.matches('.chat-dialog__info, .chat-dialog__info *,.js-client-info')) {
                    document.body
                        .classList.remove('is-opened-client-info')
                    document.removeEventListener('click', this.hideClientInfo);
                }
            },

        },
        created() {
            //this.membersList.push(this.$store.state.visitors.itemOpen.name)
            //this.membersList = ['Петр Иванов Камикадзев','Кирил'];
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
        &__channel-btn-wrap {
            display:inline-block;
        }
        &__channel-btn-wrap:hover &__client-history-actions {
            opacity:1;
            visibility:visible;
        }
        &__client-history-actions {
            @include box-decor();
            position:absolute;
            top:100%;
            right:0;
            left:0;
            margin-top:calc-em(30);
            opacity:0;
            visibility:hidden;

        }

    }
</style>