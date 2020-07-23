<template lang="pug">
    article.chat-main
        base-wait(name="chatMain")
        the-chat-main-header.chat-main__header(v-if!="!['search','visor','common'].includes(viewModeChat)")
        .chat-main__header(v-if="['search','visor'].includes(viewModeChat)")
            h1.chat-main__header-title Просмотр диалога: {{chat_id}}
            base-btn(v-if="$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])" name="setTag", @click="$root.$emit('showTagsEmit')" theme="link") Добавить тэг



        scroll-bar.chat-main__body(ref="scrollbar", @ps-y-reach-end="CMSPA_scrollDownButtonShow=false", @ps-scroll-up="scrollLoad", :class="{'chat-main__body_simple':['search','visor'].includes(viewModeChat)}")

            ul.chat-main__list()
                li.chat-main__item
                    base-wait(name="chatMainBody" position="r")
                li.chat-main__item(v-for="(days, daysIndex) in messageGroupDaysReverse",:key="days.index")
                    time.chat-main__date {{days[0]}}
                    ul.chat-main__messages
                        li.chat-main__messages-item(
                            v-for="(item, index) in days[1]",
                            :key="item.id" ,
                            :class="{'chat-main__messages-item_right':item.from_user_info.id != $store.state.user.profile.employee_id}"
                        )
                            template(v-if="!['search','visor'].includes(viewModeChat)")
                                template(v-if="item.from_role_id!=9")
                                    base-people(v-bind="item.basePeopleOptions")



                                input-emoji.chat-main__messages-sys(tag="p" v-else type="text", :text="sysText(item)")
                            template(v-else)
                                message-item(v-bind="item.basePeopleOptions")

                        li.chat-main__messages-item.chat-main__messages-item_right(
                            v-if="messageGroupDaysReverse.length-1===daysIndex && showVisitorTypingLive"
                        )

                            base-people(
                                :key="'visitorTypingLive'"
                                avatar-width="md",
                                :time="(new Date).getTime() / 1000",
                                :avatar-url="visitorInfo.photo",
                                :avatar-stub="visitorInfo.photo_stub",
                                :name="visitorInfo.name",
                                :text="visitorTypingLive | messageBreakLine",
                                :right="true",
                            )

                        template(v-if="(roomActiveUsersInvited.length || roomActiveUsersRecipient.length) && roomActiveIsAdmin")
                            li.chat-main__messages-item.chat-main__messages-sys(
                                v-for="(item, index) in roomActiveUsersInvited",
                                :key="item.id",

                                )
                                    |Ожидаем подтверждение от: {{item.first_name}}&nbsp;
                                    base-btn(theme="link" v-text="'Отменить приглашение'", @click="invitedCancel(item.id)")
                            li.chat-main__messages-item.chat-main__messages-sys(
                                v-for="(item, index) in roomActiveUsersRecipient",
                                :key="item.id",

                            )
                                |Ожидаем подтверждение от: {{item.first_name}}&nbsp;
                                base-btn(theme="link" v-text="'Отменить передачу'", @click="transferCancel(item.id)")

        footer.chat-main__footer(v-if="!['search','visor'].includes(viewModeChat)")
            .chat-main__scroll-down-button-wrap
                scroll-down-button.chat-main__scroll-down-button(
                    v-if="CMSPA_scrollDownButtonShow"
                    @click="CMSPA_chatDown",
                    :count="CMSPA_countNoReadMessage"
                )

            the-chat-main-footer

</template>

<script>
import { mapState } from 'vuex'
import TheChatSystemMessages from '@/components/TheChatSystemMessages'
import TheChatMainHeader from '@/components/TheChatMainHeader'
import TheChatMainFooter from '@/components/TheChatMainFooter'
import MessageItem from '@/components/MessageItem'
import { wrapTextUrls } from '@/modules/modules'
import { datetimeDMY, datetimeHMS } from '@/modules/datetime'
import inputEmoji from '@/components/inputEmoji'

import { viewModeChat, httpParams, scrollbar, chatMainScrollPushArrow } from '@/mixins/mixins'

import lodash_groupBy from 'lodash/groupBy'
import lodash_find from 'lodash/find'
import lodash_uniqBy from 'lodash/uniqBy'
import ScrollDownButton from "@/components/ScrollDownButton";

export default {
    components: {
        ScrollDownButton,
        inputEmoji,
        TheChatSystemMessages,
        TheChatMainHeader,
        TheChatMainFooter,
        MessageItem
    },
    filters: {
        wrapTextUrls,
        datetimeHMS,
        messageBreakLine: function(value) {
            return value.replace(/(\r\n|\n|&lt;br&gt;)/g, '<br>') // из виджета &lt;br&gt;
        },
        deliveredText(numb) {
            if (numb == 0) return 'Доставляется'
            if (numb == 1) return 'Доставлено'
            if (numb == 2) return 'Не доставлено'
            return
        }
    },
    mixins: [viewModeChat, httpParams, scrollbar, chatMainScrollPushArrow],
    data() {
        return {
            historyMessageLoadStart: true, //При прокрутке страницы, функция historyMessageLoad выполнялась раньше чем приходил ответ, из за этого лишние индификаторы были
            messageRun: true, //Если история закончилась, что бы больше не отправлял запросы
            messageList: [],
            limit: 30,
            systemMessages: [],
            visitorTypingLive: '',
            chat_id: null,

            scrollTopBeforeAddContent: 0
        }
    },

    computed: {
        ...mapState('roomActive', {
            roomActiveUsers: 'users',
            roomActiveUsersUnprocessed: 'usersUnprocessed',
            roomActiveUsersInvited: 'usersInvited',
            roomActiveUsersActive: 'usersActive',
            roomActiveUsersRecipient: 'usersRecipient',
            roomActiveIsAdmin: 'isAdmin',
            roomActiveVisitor: 'visitor',
            roomActiveId: 'id'
        }),
        showVisitorTypingLive() {
            if (['visitors'].includes(this.viewModeChat)) {
                let { guest_uuid, site_id } = this.roomActiveVisitor,
                    { params } = this.httpParams
                //console.log('showVisitorTypingLive',guest_uuid+site_id , params.guest_uuid+ params.site_id,this.visitorTypingLive.length);

                return (
                    guest_uuid + site_id === params.guest_uuid + params.site_id &&
                    this.visitorTypingLive.length
                )
            }
            return null
        },
        compVisitorTypingLive() {
            let { typingLive } = this.roomActiveVisitor
            if (typingLive) typingLive += '...<br><small>(гость печатает сообщение)</small>'
            return typingLive
        },

        messageGroupDaysReverse() {
            let list = Object.entries(this.messageGroupDays).reverse() //['14.15.2018',[messages]]
            list.forEach(itemParent => {
                itemParent[1] = itemParent[1].map(item => {
                    /*      if(item.from_role_id==9) {

                        item.basePeopleOptions = {
                            text:this.$options.filters.datetimeHMS(item.time) +': '+ this.$options.filters.wrapTextUrls(this.$options.filters.messageBreakLine(item.body)
                            ),

                        }
                        console.log(item.basePeopleOptions.text);
                    }
                    else {*/
                    item.basePeopleOptions = {
                        roleId: item.from_role_id, //message-item component
                        avatarWidth: 'md',
                        avatarUrl: item.from_user_info.photo,
                        avatarStub: item.from_user_info.photo_stub,
                        name: this.name(item, this.visitorInfo),
                        regRuLogin: this.regRuLogin(item, this.visitorInfo),
                        text: this.$options.filters.wrapTextUrls(
                            this.$options.filters.messageBreakLine(item.body)
                        ),
                        time: item.time,
                        loaderMessage: item.delivery_status,
                        right:
                            item.from_user_info.id !== this.$store.state.user.profile.employee_id,
                        files: item.files || []
                    }
                    //}

                    return item
                })
                itemParent[1] = itemParent[1].reverse()
            })

            return list
        },
        messageGroupDays() {
            let filterList = lodash_uniqBy(this.messageList, 'id')
            return lodash_groupBy(filterList, item => {
                return datetimeDMY(item.time)
                //moment(item.time*1000).format('HH:mm')
            })
        },
        messageLastId() {
            return this.messageListReverse[0] ? this.messageListReverse[0].id : null
        },

        messageListReverse() {
            let list = this.messageList.slice()
            return list.reverse()
        },
        visitorInfo() {
            return this.$store.state.visitors.itemOpen
        }
    },
    watch: {
        /*    roomActiveUsers:{
            handler(list){


                if(
                    list.length &&  //без этого условия бесконечный цикл, был редирект на другую страницу, происходит roomActive/resetState, страбатывает watch roomActiveUsers
                    !this.accessPage(list)) {
                    console.log('$router.push({ name: \'processAll\' })');
                    this.$router.push({ name: 'processAll' })
                }


            },
            immediate: false
        },*/
        /*        roomActiveId(val) {
            if (val) {
                console.log(this.$route.name)
                return
                if (this.viewModeChat === 'search') return
                if (
                    this.viewModeChat === 'all' &&
                    this.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])
                )
                    return

                if (
                    !this.roomActiveUsers.some(
                        user => user.user_id === this.$store.state.user.profile.id
                    )
                )
                    this.$router.push({ name: 'processAll' })
            }
        },*/
        $route(to, from) {
            this.getPhrasesUse()
            this.getRoomUserAll()
            this.historyMessageLoadStart = true
            this.messageRun = true
            this.messageList = [] //Todo баг не сбрасывается до []
            ;(this.clearTimerVisitorTypingLive = null),
                this.historyMessageLoad().then(() => {
                    this.scrollbarScrollerPush(this.$refs.scrollbar)
                })
        },
        messageDays(val) {
            return val
        },
        compVisitorTypingLive(val, oldVal) {
            this.visitorTypingLive = val
            clearTimeout(this.clearTimerVisitorTypingLive)
            this.clearTimerVisitorTypingLive = setTimeout(() => {
                this.visitorTypingLive = ''
            }, 1000 * 20) //секунд

            if (!val.length === !oldVal.length) {
                return
            } else {
                this.CMSPA_scrollbarScrollerPush()
            }
        }
    },
    created() {
        this.getRoomUserAll()
        this.$root.$on('chatSystemMessages', val => this.systemMessages.push(val))

        this.historyMessageLoad().then(() => {
            this.scrollbarScrollerPush(this.$refs.scrollbar)
        })

        this.$root.$on('messageAdd', this.emitMessageAdd)
        this.$root.$on('messageDelivered', this.emitMessageDelivered)

        this.$root.$on('messageVisitorUpdateName', ({ name, guest_uuid, site_id }) => {
            lodash_find(this.messageList, { site_id, from_user_info: { guest_uuid } })
            this.messageList.forEach(item => {
                if (item.site_id + item.from_user_info.guest_uuid === site_id + guest_uuid)
                    item.from_user_info.name = name
            })
        })

        this.syncOperatorMessageVisor()

        this.getPhrasesUse()
    },
    beforeDestroy() {
        this.$root.$off('messageAdd', this.emitMessageAdd)
        this.$root.$off('messageDelivered', this.emitMessageDelivered)
    },

    methods: {
        getPhrasesUse() {
            let site_id = this.httpParams?.params?.site_id
            if (site_id) {
                this.$store.dispatch('phrases/getItemListUse', { site_id })
            }
        },

        syncOperatorMessageVisor() {
            if (!['visitors', 'visor', 'search'].includes(this.viewModeChat)) return

            window.addEventListener('storage', e => {
                // Делаем синхранизацию, если опер открыл в журнале свой диалог и пишет сообщени в другой вкладке

                if (e.key == 'messageAdd') {
                    let message = JSON.parse(e.newValue)
                    //console.log(message);

                    if (
                        message.guest_uuid === this.httpParams.params.guest_uuid &&
                        message.site_id === this.httpParams.params.site_id &&
                        message.room_id === this.$store.state.roomActive.id
                    )
                        this.$root.$emit('messageAdd', message)
                }
            })
        },
        sysText(message) {
            return (
                this.$options.filters.datetimeHMS(message.time) +
                ': ' +
                this.$options.filters.wrapTextUrls(
                    this.$options.filters.messageBreakLine(message.body)
                )
            )
        },
        name(item, visitorInfo) {
            if (item.from_user_info.guest_uuid) return visitorInfo.name
            else return item.from_user_info.name
        },
        regRuLogin(item, visitorInfo) {
            if (item.from_user_info.guest_uuid) return visitorInfo.regRuLogin
            else return null
        },
        emitMessageDelivered(val, stop) {
            let findIndex = this.messageList.findIndex(item => item.id === val.message_id)
            console.log('emitMessageDelivered', findIndex)
            if (findIndex !== -1) {
                this.$set(this.messageList[findIndex], 'delivery_status', val.delivery_status)
            } else {
                if (stop) return
                setTimeout(() => {
                    this.emitMessageDelivered(val)
                }, 1000)
            }
        },
        emitMessageAdd(message) {
            //console.log('this.$root.$on(\'messageAdd\'');
            console.log('message.isPolling', message.isPolling)
            if (message.isPolling) return this.messagePollingAdd(message)

            if (message.socket) {
                //Todo Временное решение, на проверку дубликатов, пока Симон не исправит
                let findIndex = this.messageList.findIndex(item => item.id === message.id)

                if (findIndex === -1) {
                    console.log('дубликат', findIndex, message.id, this.messageList)

                    this.messageListUnshift(message)
                }
            } else {
                this.messageListUnshift(message)
            }
        },
        messagePollingAdd(messagePolling) {
            //console.log(message)
            let incomingMessages = this.messageList
            //.filter(item=>item.from_role_id!='8') //Получаем только входящие сообщения

            let findPrevIndex = 0

            console.log('incomingMessages', incomingMessages)

            incomingMessages.reverse().forEach((item, index) => {
                if (item.id < messagePolling.id) findPrevIndex = index
            })

            messagePolling.time = incomingMessages[findPrevIndex].time + 1

            //let cloneMessage = lodash_cloneDeep(this.messageList)
            incomingMessages.splice(findPrevIndex + 1, 0, messagePolling)
            this.messageList = incomingMessages.reverse()
            //state.messages = cloneMessage
            //console.log('state.messages.splice',cloneMessage);
            // ищем предыдущее сообщение
        },
        messageListUnshift(message) {
            this.messageList.unshift(message)
            if (!message.socket) {
                this.CMSPA_scrollbarScrollerPush(true)
            } else {
                this.CMSPA_scrollbarScrollerPush()
            }
        },
        transferCancel(to_id) {
            let data = this.httpParams.params
            data.to_id = to_id
            this.$http.put('chat-room-user/transfer-cancel', data)
        },
        invitedCancel(user_id) {
            this.$http.post('chat-room-user/cancel-invitation', {
                room_id: this.roomActiveId,
                user_id
            })
        },

        getRoomUserAll() {
            if (this.viewModeChat === 'operators') return
            if (this.viewModeChat === 'common') {
                this.$store.commit('roomActive/set', [
                    { room_id: this.$store.state.user.profile.common_room_id }
                ])
                return
            }

            if (this.httpParams) {
                console.log('getRoomUserAll')
                let viewModeChat = this.viewModeChat //пользователь мог не дожидаться запроса и на момент ответа viewModeChat содержала другой роут проходил редирект обратно
                this.$http
                    .get('chat-room-user/all', this.httpParams)
                    .then(({ data }) => {
                        console.log(data)
                        if (!this.accessPage(data.data, viewModeChat)) {
                            return this.$router.push({ name: 'processAll' })
                        }

                        //console.log(this.httpParams);

                        data.data.visitor = this.httpParams.params
                        this.$store.commit('roomActive/set', data.data)
                    })
                    .catch(() => {
                        this.$router.push({ name: 'processAll' })
                    })
            }
        },
        accessPage(list, viewModeChat) {
            console.log('accessPage',viewModeChat,list,this.$store.state.user.profile.id)
            if (viewModeChat === 'common') return true

            if (viewModeChat === 'search') return true
            if (
                viewModeChat === 'visor' &&
                this.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])
            )
                return true
            if (!list.length) return false

            //return true //Todo какая то проблема со статусами? редиректит всех, убрал что бы не бесило пользователя

            let listFilter
            if (viewModeChat === 'process') {
                listFilter = list.filter(item =>
                    ['recipient', 'unprocessed', 'invited'].includes(item.status)
                )

                if (listFilter.some(user => user.user_id === this.$store.state.user.profile.id))
                    return true

                //Если доступ не получен, нужно удалить из списка если есть, чтобы не в пасть в бесконечный цикл

                this.$root.$emit('processRemoveItem', this.httpParams.params)
            }

            if (viewModeChat === 'visitors') {
                listFilter = list.filter(item => ['active'].includes(item.status))
                console.log(listFilter, this.$store.state.user.profile.id)
                if (listFilter.some(user => user.user_id === this.$store.state.user.profile.id))
                    return true

                this.$store.dispatch('setMessageRead', {
                    guest_uuid: this.httpParams.params.guest_uuid,
                    site_id: this.httpParams.params.site_id,
                    type: 'visitors'
                })
                this.$store.commit('visitors/selfMessageRemoveItem', this.httpParams.params)
            } else return false
        },
        scrollLoad(e) {
            if (this.scrollLoadAllow(e, 'up')) {
                const scroller = e.target
                let height = scroller.clientHeight,
                    scrollHeight = scroller.scrollHeight - height

                this.historyMessageLoad().then(() => {
                    scroller.scrollTop =
                        scroller.scrollHeight -
                        scroller.clientHeight -
                        scrollHeight +
                        this.scrollTopBeforeAddContent //После загрузки двигаем полосу прокрутки на предыдущее место
                })
            }
        },
        historyMessageLoad() {
            return new Promise((resolve, reject) => {
                if (!this.messageRun) return
                if (!this.historyMessageLoadStart) return

                console.log()

                let params = {
                        last_msg_id: this.messageLastId,
                        limit: this.limit
                    },
                    guest_uuid,
                    site_id,
                    users_ids = []

                if (this.viewModeChat === 'visitors' || this.viewModeChat === 'process') {
                    let { guest_uuid, site_id } = this.httpParams.params
                    ;(params.guest_uuid = guest_uuid), (params.site_id = site_id)
                } else if (this.viewModeChat === 'operators') {
                    params.users_ids = [this.$route.params.id, this.$store.state.user.profile.id]
                } else if (this.viewModeChat === 'common') {
                    params.room_id = this.$store.state.user.profile.common_room_id
                } else if (['search', 'visor'].includes(this.viewModeChat)) {
                    let { guest_uuid, site_id, chat_id } = this.httpParams.params
                    ;(params.guest_uuid = guest_uuid), (params.site_id = site_id)
                    params.chat_id = chat_id
                }

                this.historyMessageLoadStart = false
                this.messageRun = false

                let currentRoute = this.$route

                this.$http.get('message/history', { params }).then(({ data }) => {
                    //console.log('message/history',JSON.stringify(currentRoute.params) , JSON.stringify(this.$route.params));
                    if (JSON.stringify(currentRoute.params) !== JSON.stringify(this.$route.params))
                        return console.log('Нет подмешиванию')
                    this.historyMessageLoadStart = true
                    let { count, messages, users } = data.data
                    if (!count) return

                    this.chat_id = messages[0].chat_id
                    this.$store.commit('roomActive/setChatId', this.chat_id)

                    this.messageRun = count
                    //console.log('historyMessageLoad');

                    //console.log('messages',messages);

                    //messages = messages.filter(message=>!this.messageList.some(item=>item.id===message.id)) //убираем дубликаты

                    this.messageList.push(...messages)
                    this.scrollTopBeforeAddContent = this.$refs.scrollbar.$el.scrollTop
                    //console.log('this.messageList.push',this.messageList);
                    //this.$wait.end('message-history');

                    resolve()
                })
            })
        }
    }
}
</script>

<style lang="scss">
.chat-main {
    $color_border: glob-color('border');

    $color_bg_date: glob-color('light');
    $color_bg_message: glob-color('info-lighten');

    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    min-width: 0; //для шаблонов, чтобы работало text-overflow: ellipsis;

    &__spinner {
        height: 100%;
    }

    &__header-title {
        @extend %h4;
        margin-bottom: 0;
        margin-top: 1em;
    }

    &__item {
        &.spinner {
            height: 50px;
        }

        padding-top: calc-em(25);

        &_history_more {
            text-align: center;
        }

        .base-people__text {
            white-space: normal;
        }
    }

    &__body:not(&__body_simple) {
        margin-top: auto;
        height: auto;
    }
    &__list,
    &__header {
        padding-right: calc-em(15);
    }
    &__header {
        display: grid;
        grid-template-columns: 1fr max-content;
        gap: calc-em(30);
        align-items: baseline;
    }

    &__date {
        position: relative;
        display: block;
        text-align: center;
        margin: 0 0 1.5em;

        &::before {
            content: '';
            border-top: 1px solid $color_border;
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            z-index: -1;
        }
        &::after {
            content: '';
            display: block;
            @extend %full-abs;
            z-index: -1;
            margin: 0 auto;
            width: 98px;
            background: $color_bg_date;
        }
    }

    &__list {
        margin-bottom: calc-em(25);
    }

    &__messages-item {
        & + & {
            margin-top: calc-em(15);
        }

        a:not([href^='mailto:']):not([href^='tel:']) {
            display: inline-block;
            max-width: 166px;
            @extend %text-truncate;
            vertical-align: middle;
        }

        .base-people {
            align-items: flex-start;
        }
        .base-people {
            margin-right: 14%;
        }
        &_right {
            text-align: right;
            .base-people {
                margin-left: 14%;
                margin-right: auto;

                text-align: left;
                display: inline-flex;
                &__inner {
                    background-color: $color_bg_message;
                }
                &__name {
                    margin-left: auto;
                }
            }
        }
    }
    &__messages-sys {
        text-align: center;
    }
    &__footer {
        position: relative;
    }
    &__scroll-down-button {

    }
    &__scroll-down-button-wrap {
        position: absolute;
        right: 0;
        bottom: 100%;
        transform: translateY(50%);
        z-index: 999;
        margin-right: 1em;

        display: inline-block;
    }
}
</style>
