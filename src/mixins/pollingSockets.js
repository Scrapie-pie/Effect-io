
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
        pollingSocketsInit(){
            let  pollingServ = this.$http
            if (process.env.NODE_ENV === 'production') {
                pollingServ = this.$http.create({
                    baseURL: '//polling.effect.com',
                    headers: { 'content-type': 'application/json' }
                })
            }

            pollingServ.get('/socket/polling', {
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
        },
        pollingSocketsDestroy(){
            clearTimeout(this.pollingSocketsInterval)
            console.log('pollingSocketsDestroy');
        },
        pollingSockets() {
            this.pollingSocketsInit()
            this.pollingSocketsInterval = setInterval(this.pollingSocketsInit, 1000 * 5)
            console.log(this.pollingSocketsInterval);
        }
    }
}
