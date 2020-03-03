<template lang="pug">
    .link-share
        input(:value="text"  ref="input" type="text").link-share__hid

        base-btn(:icon="{name:'linkShare',box:false,textHidden:'Поделится'}" theme="default", @click="linkDialogShare")
</template>

<script>
import { httpParams } from '@/mixins/mixins'
export default {
    name: 'LinkShare',
    mixins: [httpParams],
    data() {
        return {}
    },
    computed: {
        text() {
            let item = this.httpParams.params

            item.chat_id = this.$store.state.roomActive.chatId
            let { guest_uuid, site_id, chat_id } = item

            //dialogPush(this, 'search', item, 'chat_id')
            console.log(item)
            let routeData = this.$router.resolve({
                name: 'search',
                params: { guest_uuid, site_id, chat_id }
            })
            console.log(location.origin + routeData.href)
            return location.origin + routeData.href
        }
    },
    methods: {
        linkDialogShare() {
            var copyText = this.$refs.input

            console.log(copyText)

            /* Select the text field */
            copyText.select()
            copyText.setSelectionRange(0, 99999) /*For mobile devices*/

            /* Copy the text inside the text field */
            document.execCommand('copy')
        }
    }
}
</script>

<style lang="scss">
.link-share {
    display: inline-block;
    vertical-align: middle;
    &__hid {
        @extend %visuallyhidden;
    }
}
</style>
