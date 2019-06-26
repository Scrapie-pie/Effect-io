export default {
    data() {
        return {
            spellingShow: false,
            spellingCheck: 0,
            spellingList: 1,
            spellingIgnoredWords: [],
            spellingMessage: '',
            spellingResultMessage: ''
        }
    },

    created() {
        this.spellingCheck = this.$store.state.user.profile.spelling
    },

    methods: {
        spellingShowBox(list) {
            if (list.length) {
                this.spellingList = list
                this.spellingShow = true
                console.log('spellingShowBox', list)
            }
        }
    },
    watch: {
        /*   '$route' (to, from) {
            this.spellingCheck = this.$store.state.user.profile.spelling
        },*/
        spellingCheck(val) {
            this.$http
                .post('spelling/spelling/settings', {
                    enabled: this.spellingCheck
                })
                .then(() => {
                    this.$store.commit('user/profileUpdate', {
                        spelling: this.spellingCheck
                    })
                })
        }
    }
}
