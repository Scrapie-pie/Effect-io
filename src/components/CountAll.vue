<template lang="pug">
    base-count(:count="unreadAll").count-all
</template>

<script>
import BaseCount from '@/components/BaseCount'

export default {
    name: 'CountAll',
    components: { BaseCount },
    data() {
        return {}
    },
    computed: {
        unread() {
            return this.$store.state.user.profile.unread || {}
        },
        unreadAll() {
            return (
                this.unread.common +
                this.unread.guest +
                this.unread.unprocessed +
                this.unread.private
            )
        }
    }
}
</script>

<style lang="scss">
.count-all {
}
</style>
