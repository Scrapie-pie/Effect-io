export default {
    methods: {},
    computed: {
        scenarioCurrent() {
            return this.$store.getters['scenario/gettersAll'].find(
                item => item.id === +this.$route.params.scenarioId
            )
        }
    },
    watch: {
        scenarioCurrent: {
            handler(val) {
                if (val) {
                    console.log(val)
                    this.model = val
                }
            },

            immediate: true
        }
    }
}
