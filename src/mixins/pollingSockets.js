import { ApiInit } from '@/api/api'

export default {
    data() {
        return {
            pollingSocketsInterval: null
        }
    },
    created() {
        this.$root.$once('emitPollingSockets',this.pollingSockets)
    },
    beforeDestroy() {

        clearTimeout(this.pollingSocketsInterval)
    },
    computed: {},
    methods: {
        pollingSockets() {
            this.pollingHistoryMessageInterval = setInterval(() => {
                ApiInit.socketPolling({
                    socketGroupId: this.$store.state.api.socketGroupId
                }).then(({ data }) => {
                    console.log('pollingSockets', data)

                    data.forEach(itemApi => {
                        let socketStoreItemFind = this.$store.state.sockets.history.find(
                            itemStore => itemStore.socket_id === itemApi.payload.socket_id
                        )
                        if (!socketStoreItemFind) {
                            let socketEmitName = this.$store.state.sockets.emitList[itemApi.event]
                            if(itemApi.event==='message') itemApi.payload.isPolling=true //используем в storeChat.js
                            this.$root.$emit(socketEmitName, itemApi.payload)
                        }
                    })


                    setTimeout(()=>{
                        this.$store.commit('sockets/historyClear')
                    },60*1000)
                })
            }, 1000 * 5)
        }
    }
}
