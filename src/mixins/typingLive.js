

export default {
    data() {
        return {
            typingLiveLastSendMessage: '',
            typingLiveNewMessage: '',
            typingLiveLastMessage: '',
            typingLiveLastSend: true
        }
    },
    created() {},

    mounted() {},
    beforeDestroy() {},
    methods: {
        typingLiveSend() {
            if (this.typingLiveNewMessage != this.typingLiveLastSendMessage) {

                this.$http.post('message/operator-typing', this.httpParams.params)

            }
        },
        typingLive(message) {

            if(this.viewModeChat!=='visitors') return

            this.typingLiveNewMessage = message

            console.log(this.typingLiveNewMessage, message)

            if (message != this.typingLiveLastMessage) {
                this.typingLiveLastMessage = message

                if (this.typingLiveLastSend) {
                    this.typingLiveLastSend = false
                    setTimeout(() => {
                        this.typingLiveSend()
                        this.typingLiveLastSend = true
                    }, 3000)
                }
            }
        }
    }
}
