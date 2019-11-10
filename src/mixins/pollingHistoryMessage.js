export default {
    data() {
        return {

            pollingHistoryMessageInterval:null
        }
    },
    created() {



        this.pollingHistoryMessageInterval = setInterval(()=>{

            this.pollingHistoryMessageLoad()
        },5000)
    },
    beforeDestroy() {


        clearTimeout(this.pollingHistoryMessageInterval)
    },
    methods: {
        pollingHistoryMessageLoad(){


            let params = {
                    //last_msg_id: this.messageLastId,
                    limit:10
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
            return this.$http.get('message/history', { params }).then(({ data }) => {

                let { count, messages, users } = data.data
                if (!count) return

                messages.reverse().forEach(message=>{
                    message.socket=true
                    this.emitMessageAdd(message)
                })

               /* messages = messages.filter(message=>!this.messageList.some(item=>item.id===message.id)) //убираем дубликаты
                console.log(messages);

                this.messageListUnshift(...messages)*/
                //this.messageList.push(...messages)

            })
        },
    }
}
