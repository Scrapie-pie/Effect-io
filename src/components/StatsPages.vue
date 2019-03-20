<template lang="pug">
    base-table
        thead: tr: th(v-for="(item, index) in headList" :key="index" v-text="item")
        tbody
            tr(v-for="(item, index) in itemList" :key="index")
                td: a(:href="item.url" v-text="item.url" target="_blank")
                td(v-text="item.dialogues_requests")
                td(v-text="item.dialogues_percents")


</template>

<script>

import {stats} from '@/mixins/mixins'

export default {
    mixins:[stats],

    data() {
        return {

        }
    },
    computed:{
        headList(){
            let list = [
                'URL',
                'Получено диалогов',
                'Процент от общего количества обращений (%)'
            ];
            return list
        },
    },
}
</script>

<style lang="scss">

</style>

