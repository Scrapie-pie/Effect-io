<template lang="pug">
    fieldset.process-actions()
        ul.process-actions__list
            li.process-actions__item

                base-btn(
                    v-if="btnTextYes"
                    color="success-dark"
                    size="lg" ,
                    @click="processActionYes"
                    v-text="btnTextYes"
                )
            li.process-actions__item.process-actions__item_no
                base-btn(
                color="info-dark",
                size="lg",
                @click="processActionNo"
                ) Отклонить
</template>

<script>
import { httpParams, routerPushProcessAllOrItemFirst } from '@/mixins/mixins'
import { dialogPush } from '@/modules/modules'
import lodash_find from 'lodash/find'
export default {
    mixins: [httpParams, routerPushProcessAllOrItemFirst],
    /*  watch:{ //Todo какой то косяк если раскоментирую
        systemMessage(val){
            console.log(val);
            //if (val) this.$root.$emit('chatSystemMessages',this.systemMessages)
        }
    },*/
    props: {
        paramsIds: {
            type: Object,
            default: function() {
                return {

                }
            }
        }
    },
    data() {
        return {
            processItem:{}
        }
    },
    computed: {
        visitorIds() {
            if (this.paramsIds.guest_uuid && this.paramsIds.site_id) {
                return this.paramsIds
            } else {
                let { params } = this.httpParams
                return params
            }
        },
        roomId() {
            return this.process.room_id
        },
        btnTextYes() {
            if (this.status === 'recipient') return 'Принять'
            if (this.status === 'invited') return 'Присоединиться'
            if (this.status === 'unprocessed') return 'Ответить'

            return this.status
        },
        process() {
            let { guest_uuid, site_id } = this.visitorIds

            if (guest_uuid && site_id)
                return (
                    lodash_find(this.$store.state.visitors.process, {
                        guest_uuid,
                        site_id
                    }) || {}
                )

            return {}
        },
        status() {
            return this.process.status
        },
        comment() {
            return this.process.last_message
        },
        author() {
            return this.process.last_message_author
        },
        systemMessage() {
            return {
                position: 'footer',
                type: this.status,
                name: this.author,
                text: this.comment
            }
        }
    },

    methods: {
        processItemSave(){
            //сохраняем перед отправкой запроса.
            //Бывала такая ситуация. Посылаешь запрос, приходит сокет и удаляет диалог, а скрипт в then уже не может его найти
            let { guest_uuid, site_id } = this.visitorIds

            this.processItem = this.$store.state.visitors.process.find(
                item => item.guest_uuid + item.site_id === guest_uuid + site_id
            )

            this.processItem.very_hot = 0
            console.log(this.processItem);
        },
        routerNext(status) {

            let { guest_uuid, site_id } = this.processItem

            let commitProcessRemoveItem = ['visitors/processRemoveItem', { guest_uuid, site_id }]
            let commitUserUnreadUpdate = ['user/unreadUpdate', ['unprocessed', -1]]

            this.$store.commit(...commitProcessRemoveItem)
            this.$store.commit(...commitUserUnreadUpdate)

            this.$root.$emit('actionAnotherTab',['mutation',...commitProcessRemoveItem])
            this.$root.$emit('actionAnotherTab',['mutation',...commitUserUnreadUpdate])




            if (status === 'no') {
                this.routerPushProcessAllOrItemFirst()
            }

            if (status === 'yes') {
                dialogPush(this, 'self', this.processItem)

                this.$root.$emit('actionAnotherTab',['method','dialogPush',['self', this.processItem]])

                setTimeout(()=>{
                    console.log('Router push в мои диалоги')
                    this.$router.push({
                        name: 'chatId',
                        params: { guest_uuid, site_id }
                    })
                },500) //Приходит сокет room-users, обновляется статус комнаты, запускается функция this.accessPage, редиректится в не обработано, ждем примерно секунду, редиректим в диалоги


            }
        },

        processActionNo() {
            this.processItemSave()
            if (this.status) this[this.status + 'No']().then(() => this.routerNext('no'))
        },
        processActionYes() {
            this.processItemSave()

            if (this.status) this[this.status]().then((r) => {
                console.table('processActionYes',r)
                this.routerNext('yes')
            })
        },
        recipient() {
            return this.$http.put('chat-room-user/transfer-acceptance', this.visitorIds)
        },
        recipientNo() {
            return this.$http.put('chat-room-user/transfer-decline', this.visitorIds)
        },
        unprocessed() {
            console.log('Нажал принять chat-room-user/take');
            return this.$http.put('chat-room-user/take', this.visitorIds)
        },
        unprocessedNo() {
            return this.$http.post('chat-room-user/decline-guest', this.visitorIds)
        },
        invited() {
            return this.$http.post('chat-room-user/accept-invitation', {
                room_id: this.roomId
            })
        },
        invitedNo() {
            return this.$http.post('chat-room-user/decline-invitation', {
                room_id: this.roomId
            })
        }
    }
}
</script>

<style lang="scss">
.process-actions {
    &__list {
        @extend %row-flex;
    }
}
</style>
