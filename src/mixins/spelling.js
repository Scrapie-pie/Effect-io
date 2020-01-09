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
        toggleSpellingCheck() {
            this.$http
                .post('spelling/spelling/settings', {
                    enabled: !this.spellingCheck
                })
                .then(() => {
                    this.$store.commit('user/profileUpdate', {
                        spelling: !this.spellingCheck
                    })
                })
        },
        spellingShowBox(list) {
            if (list.length) {
                this.spellingList = list
                this.spellingShow = true

            }
        }
    }
}
