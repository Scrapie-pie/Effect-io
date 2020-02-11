import config from '@/config/index'
export default {
    data() {
        return {
            pollingSocketsGo: false
        }
    },
    created() {},
    beforeDestroy() {},
    computed: {},
    methods: {
        pollingSocketsInit() {
            if (!this.pollingSocketsGo) return
            let pollingServ = this.$http

            if (config.polling_server) {
                pollingServ = this.$http.create({
                    baseURL: config.polling_server,
                    headers: { 'content-type': 'application/json' }
                })
            }

            pollingServ
                .get('/socket/polling', {
                    params: {
                        uuid: this.$store.state.user.profile.uuid,
                        socketGroupId: this.$store.state.user.profile.owner_id,
                        type: 'employee'
                    }
                })
                .then(({ data: { data } }) => {

                    console.log(data);
                    data.forEach(itemApi => {
                        let socketStoreItemFind = this.$store.state.sockets.history.find(
                            itemStore => {
                                return itemStore?.socket_id === itemApi.payload.socket_id
                            }
                        )

                        if (!socketStoreItemFind) {
                            let socketEmitName = this.$store.state.sockets.emitList[itemApi.event]

                            itemApi.payload.isPolling = true
                            if (itemApi.event === 'new-message') itemApi.payload.isPolling = true //используем в storeChat.js

                            if (
                                itemApi.event === 'unprocessed' ||
                                itemApi.event === 'unprocessed-remove'
                            ) {
                                //обновляем страницу, сокет не успел дойти, но в ините счетчик уже +1,  в итоге полилинг добавлял уже лишний
                                console.log(itemApi.event);
                                let findIndex = this.$store.state.visitors.process.findIndex(
                                    //Если диалог уже есть в ините, то не добавляем
                                    processItem =>
                                        processItem.site_id + processItem.guest_uuid ===
                                        itemApi.payload.site_id + itemApi.payload.guest_uuid
                                )
                                console.log('itemApi.event', itemApi.event, findIndex)
                                if (findIndex!=-1) return
                            }

                            //console.log(socketEmitName, itemApi.payload)
                            this.$root.$emit(socketEmitName, itemApi.payload)
                        }
                    })
                })
                .finally(() => {
                    let interval = config.polling_interval_ms ? config.polling_interval_ms:5000
                    setTimeout(() => {
                        this.pollingSocketsInit()
                    }, interval)
                })
        },
        pollingSocketsDestroy() {
            this.pollingSocketsGo = false
        },
        pollingSockets() {
            if(!config.polling_server) return
            this.pollingSocketsGo = true
            this.pollingSocketsInit()
            setTimeout(() => {
                this.$store.commit('sockets/historyClear')
            }, 60 * 1000)
        }
    }
}
