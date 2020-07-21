<template lang="pug">
    header.chat-main-header
        .chat-main-header__text
            h1.chat-main-header__members

                span.chat-main-header__name.chat-main-header__name_open_client-info.js-client-info(
                    v-text="targetName"
                )
                template(v-if="viewModeChat!='operators'")

                    template(v-for="(item, index) in compMembersList")
                        span.chat-main-header__name
                            | , {{item.first_name}}
                            button(
                                type="button",
                                @click="removeFromRoom(item.id)"
                                v-if="$store.state.roomActive.isAdmin"
                            ).chat-main-header__name-tooltip Убрать из диалога
                    link-share

            .chat-main-header__channel(v-if="viewModeChat!='operators'")
                .chat-main-header__channel-btn-wrap
                    base-btn(
                        theme="text",
                        :title="visitorPage"
                    ).btn-arrow.chat-main-header__channel-btn
                        | {{visitorPage}}
                        span.btn-arrow__arrow(:class="{'btn-arrow__arrow':showClientHistoryActions}")
                    .chat-main-header__client-history-actions()
                        the-chat-main-header-history


        ul.chat-main-header__controls(v-if="!['operators','search','visor'].includes(viewModeChat)")
            template(v-if="viewModeChat!='process'")
                li.chat-main-header__control()
                    base-btn(
                    color="info-dark"
                    padding="xs",
                    @click.prevent="coBrowser"
                    ) Совместный браузер
                li.chat-main-header__control
                    form
                        fieldset(:disabled="!roomActiveUserActive")

                            base-btn(

                                color="error"
                                padding="xs",
                                @click.prevent="chatCompletion",
                                v-wait:disabled='"chatMain"'
                            ) Завершить диалог
                li.chat-main-header__control()
                    base-btn(
                        theme="default"
                        padding="xs",
                        @click.prevent="$root.$emit('showSelectOperatorInvitePopup')"
                    ) + Пригласить



            li.chat-main-header__control.chat-main-header__control_more
                base-btn(
                    :icon="{name:'more'}",
                    @click.prevent="showMoreChatActions=true"
                ).chat-main-header__more-btn
                .chat-main-header__more
                    box-controls(
                        v-if="showMoreChatActions",
                        @boxControlClose="showMoreChatActions=false"
                    )
                        the-chat-main-header-actions()


</template>

<script>
import { viewModeChat, httpParams, removeMessageAndPush } from '@/mixins/mixins'

export default {
    components: {
        LinkShare: () => import('@/components/LinkShare'),
        TheChatMainHeaderHistory: () => import('@/components/TheChatMainHeaderHistory'),
        TheChatMainHeaderActions: () => import('@/components/TheChatMainHeaderActions')
    },
    mixins: [viewModeChat, httpParams, removeMessageAndPush],
    data() {
        return {
            membersList: [],
            showClientHistoryActions: false,

            showMoreChatActions: false,

            showSelectBranch: false
            //moreActionsClose:false,
        }
    },
    computed: {
        visitorPage() {
            return this.visitor.page
        },
        visitor() {
            return this.$store.state.visitors.itemOpen
        },
        targetName() {
            if (this.viewModeChat !== 'operators') return this.visitor.name
            else {
                if (this.$store.state.user.profile.id === this.httpParams.params.id)
                    return 'Здесь Вы можете оставить важные заметки, которые будут видны только Вам. Или поговорить с самим собой'
                let operator = this.$store.getters['operators/all'].find(
                    item => item.id == this.$route.params.id
                )
                if (operator) return operator.fullName
                return ''
            }
        },
        roomActiveUserActive() {
            let id = this.$store.state.user.profile.id,
                ids = this.$store.state.roomActive.usersActive
            return ids.includes(id)
        },
        compMembersList() {
            let id = this.$store.state.user.profile.id,
                usersIds = this.$store.state.roomActive.usersActive

            usersIds = usersIds.filter(item => item !== id) //Убираем из списка себя
            let operators = []
            usersIds.forEach(itemId => {
                let find = this.$store.getters['operators/all'].find(item => item.id === itemId)

                if (find) {
                    let { id, first_name } = find
                    operators.push({ id, first_name })
                }
            })
            return operators
        }
    },
    created() {
        this.$root.$on('showTransfer', () => {
            this.showMoreChatActions = false
            setTimeout(() => {
                this.$root.$emit('showSelectOperatorTransferPopup')
            }, 500)
        })
    },
    mounted() {
        document.querySelector('.js-client-info').addEventListener('click', this.showClientInfo)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.hideClientInfo)
    },
    methods: {
        coBrowser() {
            let host = '//effect.com/'
            if (process.env.VUE_APP_ENV !== 'production') host = '//newrobocall.ru/'

            const params =
                '?guestUuid=' +
                this.httpParams.params.guest_uuid +
                '&siteId=' +
                this.httpParams.params.site_id

            this.$http.post('co-browsing/request', this.httpParams.params).then(() => {
                const win = window.open(host + 'cobrowsing' + params, '_blank')
                win.focus()
            })
        },
        chatCompletion() {
            let data = this.httpParams.params
            data.intent = 'farewell'

            this.$http.post('message/send-from-operator', data)
        },
        removeFromRoom(user_id) {
            let room_id = this.$store.state.roomActive.id
            this.$http.post('chat-room-user/remove', { room_id, user_id })
        },
        getActions(e) {
            if (e === 'blockClient') this.showConfirmBlockClient = true
        },
        showClientInfo() {
            document.body.classList.add('is-opened-client-info')
            document.addEventListener('click', this.hideClientInfo)
        },
        hideClientInfo(e) {
            if (!e.target.matches('.page-chat__info, .page-chat__info *,.js-client-info')) {
                document.body.classList.remove('is-opened-client-info')
                document.removeEventListener('click', this.hideClientInfo)
            }
        }
    }
}
</script>

<style lang="scss">
.chat-main-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5em;
    z-index: 10; //лодеры с сообщений были выше попапа

    @include media($width_xs) {
        display: none;
    }

    &__controls {
        display: flex;
    }

    &__control {
        padding: 0 calc-em(5);
        &_more {
            padding: 0;
            .icon_more {
                fill: glob-color('info-dark');
            }
        }
    }

    &__select-operator {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
    }

    &__members {
        font-size: inherit;
        margin-bottom: 0.5em;
    }

    &__name {
        position: relative;

        &_open_client-info {
            @include media($width_md) {
                border-bottom: 1px dashed;
            }
        }

        &-tooltip {
            @include box-decor();
            position: absolute;
            top: 100%;
            left: 50%;
            z-index: 1;

            margin-top: calc-em(10);
            padding: calc-em(10);

            border: 0;
            opacity: 0;
            visibility: hidden;

            white-space: nowrap;
            font-weight: 400;

            transform: translateX(-50%);
        }

        &:hover &-tooltip {
            opacity: 1;
            visibility: visible;
        }
    }

    &__more {
        position: absolute;
        right: 0;
        top: 100%;
    }
    &__channel-btn-wrap {
        display: block;
        min-width: 0;
    }
    &__channel-btn {
        //word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
    }
    &__channel-btn-wrap:hover &__client-history-actions {
        opacity: 1;
        visibility: visible;
    }
    &__client-history-actions {
        @include box-decor();
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        margin-top: calc-em(30);
        opacity: 0;
        visibility: hidden;
    }

    &__text {
        min-width: 0;
    }
}
</style>
