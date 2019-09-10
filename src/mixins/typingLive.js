import lodash_throttle from 'lodash/throttle'

export default {
    data() {
        return {
            typingLiveMessage:'',
            typingLiveThrottle: ()=>{}
        }
    },
    created() {
        this.typingLiveThrottle = lodash_throttle(()=>{

            if(this.typingLiveMessage) this.$http.post('message/operator-typing', this.httpParams.params)
        },3000)
    },

    mounted() {},
    beforeDestroy() {},
    methods: {
        typingLive(message) {
            if(this.viewModeChat!=='visitors') return

            this.typingLiveMessage = message
            this.typingLiveThrottle()
        }
    }
}
