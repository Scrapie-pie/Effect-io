
export default {
    data() {
        return {
            pollingSocketsInterval: null
        }
    },
    created() {


    },
    beforeDestroy() {


    },
    computed: {},
    methods: {
        pollingSocketsDestroy(){
            clearTimeout(this.pollingSocketsInterval)
        },
        pollingSockets() {
            this.pollingHistoryMessageInterval = setInterval(() => {
                this.$http.get('/socket/polling', {
                    params:{
                        uuid:this.$store.state.user.profile.uuid,
                        socketGroupId: this.$store.state.user.profile.owner_id
                    }

                }).then(({ data:{data} }) => {


                    data.forEach(itemApi => {
                        let socketStoreItemFind = this.$store.state.sockets.history.find(
                            itemStore => {

                                return itemStore?.socket_id === itemApi.payload.socket_id

                            }
                        )
                        if (!socketStoreItemFind) {
                            let socketEmitName = this.$store.state.sockets.emitList[itemApi.event]
                            itemApi.payload.isPolling = true
                            if(itemApi.event==='new-message') itemApi.payload.isPolling=true //используем в storeChat.js

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
