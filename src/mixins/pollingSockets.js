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

            if (process.env.VUE_APP_POLLING_SERVER) {
                pollingServ = this.$http.create({
                    baseURL: process.env.VUE_APP_POLLING_SERVER,
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

                                let findIndex = this.$store.state.visitors.process.findIndex(
                                    //Если диалог уже есть в ините, то не добавляем
                                    processItem =>
                                        processItem.site_id + processItem.guest_uuid ===
                                        itemApi.payload.site_id + itemApi.payload.guest_uuid
                                )

                                if (findIndex != -1) return
                            }

                            this.$root.$emit(socketEmitName, itemApi.payload)
                        }
                    })
                })
                .finally(() => {
                    let interval = process.env.VUE_APP_POLLING_INTERVAL_MS
                        ? process.env.VUE_APP_POLLING_INTERVAL_MS
                        : 5000
                    setTimeout(() => {
                        this.pollingSocketsInit()
                    }, +interval)
                })
        },
        pollingSocketsDestroy() {
            this.pollingSocketsGo = false
        },
        pollingSockets() {
            if (!process.env.VUE_APP_POLLING_SERVER) return
            this.pollingSocketsGo = true
            this.pollingSocketsInit()
            setTimeout(() => {
                this.$store.commit('sockets/historyClear')
            }, 60 * 1000)
        }
    }
}
