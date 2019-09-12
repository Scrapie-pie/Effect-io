<template lang="pug">
    .message-item(:class="messageClass")
        .message-item__time-wrap
            time.message-item__time {{time | datetimeHMS}}
            loader-message.message-item__loader-message(:status="loaderMessage")
        .message-item__text-wrap
            strong.message-item__name(v-html="name" v-if="name")
            p.message-item__text(
                v-if="text"
            )
                input-emoji(type="text" :text="text")
            figure.message-item__files(v-if="files.length")
                ul.message-item__files-list
                    li.message-item__files-item(v-for="(item, index) in files" :key="item.link")
                        img(
                        v-if="item.link_min",
                        :src="item.link_min",
                        :alt="item.name",
                        @click="$root.$emit('popup-img',item.link)"
                        )
                        div(v-else)
                            base-icon.message-item__files-icon(name="file")
                            a(

                            v-text="item.name",
                            :href="item.link"
                            target="_blank"
                            )

</template>

<script>
import inputEmoji from '@/components/inputEmoji'

import { datetimeHMS } from '@/modules/datetime'
export default {
    components: {
        inputEmoji
    },
    filters: {
        datetimeHMS
    },
    props: {
        text: {
            type: String,
            default: ''
        },
        time: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {}
    },
    computed: {}
}
</script>

<style lang="scss"></style>
